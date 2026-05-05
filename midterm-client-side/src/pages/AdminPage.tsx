import { Group, Inventory, TrendingUp } from "@mui/icons-material";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { itemsApi } from "../api/itemsApi";
import { revenueApi } from "../api/revenueApi";
import { suppliersApi } from "../api/suppliersApi";
import { AnalyticsTab } from "../components/admin/AnalyticsTab";
import { ProductDialog } from "../components/admin/ProductDialog";
import { ProductsTab } from "../components/admin/ProductsTab";
import { SupplierDialog } from "../components/admin/SupplierDialog";
import { SuppliersTab } from "../components/admin/SuppliersTab";
import type { Analytics, Item, Supplier, SupplierItem } from "../types";

// ── Data fetchers ────────────────────────────────────────────────────────────

const fetchItems = async (): Promise<Item[]> => {
    try {
        return await itemsApi.getItems();
    } catch {
        return [];
    }
};

const fetchSuppliers = async (): Promise<Supplier[]> => {
    try {
        return await suppliersApi.getSuppliers();
    } catch {
        return [];
    }
};

const fetchAnalytics = async (): Promise<Analytics> => {
    const fallback: Analytics = {
        totalProducts: 0,
        lowStockItems: [],
        monthlyRevenue: 0,
        weeklyProfitableCategory: "",
        dailyProfitableItem: {} as Item,
        highestProfitMarginItem: {} as Item,
        lowestProfitMarginItem: {} as Item,
        mostProfitableSupplier: {} as Supplier,
        supplierSpending: [],
    };

    try {
        const [monthlyRevenue, weeklyCategory, dailyItem, profitMargins, mostProfitableSupplier, supplierSpending] =
            await Promise.all([
                revenueApi.getMonthlyRevenue(),
                revenueApi.getWeeklyProfitableCategory(),
                revenueApi.getDailyProfitableItem(),
                revenueApi.getProfitMargins(),
                revenueApi.getMostProfitableSupplier(),
                revenueApi.getSupplierSpending(),
            ]);

        return {
            ...fallback,
            monthlyRevenue,
            weeklyProfitableCategory: weeklyCategory,
            dailyProfitableItem: dailyItem,
            highestProfitMarginItem: profitMargins.highest,
            lowestProfitMarginItem: profitMargins.lowest,
            mostProfitableSupplier,
            supplierSpending,
        };
    } catch {
        return fallback;
    }
};

// ── Tab panel ────────────────────────────────────────────────────────────────

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
    <div role="tabpanel" hidden={value !== index} id={`admin-tabpanel-${index}`} aria-labelledby={`admin-tab-${index}`}>
        {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
);

// ── Main component ───────────────────────────────────────────────────────────

const AdminPage = () => {
    const queryClient = useQueryClient();
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;

    // ── Queries ──
    const { data: items = [] } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
    const { data: suppliers = [] } = useQuery({ queryKey: ["suppliers"], queryFn: fetchSuppliers });
    const { data: analytics } = useQuery({ queryKey: ["analytics"], queryFn: fetchAnalytics });

    // ── UI state ──
    const [tabValue, setTabValue] = useState(0);

    // ── Product dialog state ──
    const [productDialog, setProductDialog] = useState<{ open: boolean; item?: Item }>({ open: false });
    const [productForm, setProductForm] = useState<Partial<Item>>({});
    const [supplierPrice, setSupplierPrice] = useState<number | undefined>();
    const [imageTab, setImageTab] = useState<"url" | "file">("url");
    const [isUploading, setIsUploading] = useState(false);

    // ── Supplier dialog state ──
    const [supplierDialog, setSupplierDialog] = useState<{ open: boolean; supplier?: Supplier; focusOnAdd?: boolean }>({
        open: false,
    });
    const [supplierForm, setSupplierForm] = useState<Partial<Supplier>>({});
    const [catalogItems, setCatalogItems] = useState<SupplierItem[]>([]);
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");
    const newItemInputRef = useRef<HTMLInputElement | null>(null);

    // ── Derived values ──
    const lowStockItems = useMemo(() => items.filter((item) => item.stock < 5), [items]);

    // Focus new item input when dialog opens in focusOnAdd mode
    useEffect(() => {
        if (supplierDialog.open && supplierDialog.focusOnAdd) {
            setTimeout(() => newItemInputRef.current?.focus(), 100);
        }
    }, [supplierDialog.open, supplierDialog.focusOnAdd]);

    // ── Mutations ──
    const createItemMutation = useMutation({
        mutationFn: (item: Omit<Item, "id">) => itemsApi.createItem(item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success("המוצר נוצר בהצלחה");
            closeProductDialog();
        },
    });

    const updateItemMutation = useMutation({
        mutationFn: ({ id, item }: { id: string; item: Partial<Item> }) => itemsApi.updateItem(id, item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success("המוצר עודכן בהצלחה");
            closeProductDialog();
        },
    });

    const deleteItemMutation = useMutation({
        mutationFn: (id: string) => itemsApi.deleteItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success("המוצר נמחק");
        },
    });

    const createSupplierMutation = useMutation({
        mutationFn: (supplier: Omit<Supplier, "id">) => suppliersApi.createSupplier(supplier),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suppliers"] });
            toast.success("ספק נוצר בהצלחה");
            closeSupplierDialog();
        },
    });

    const updateSupplierMutation = useMutation({
        mutationFn: ({ id, supplier }: { id: string; supplier: Partial<Supplier> }) =>
            suppliersApi.updateSupplier(id, supplier),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suppliers"] });
            queryClient.invalidateQueries({ queryKey: ["items"] }); // supplier name change cascades
            toast.success("הספק עודכן בהצלחה");
            closeSupplierDialog();
        },
    });

    const deleteSupplierMutation = useMutation({
        mutationFn: (id: string) => suppliersApi.deleteSupplier(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suppliers"] });
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success("הספק נמחק");
        },
    });

    // ── Product dialog handlers ──
    const openAddProduct = () => {
        setProductForm({});
        setSupplierPrice(undefined);
        setImageTab("url");
        setProductDialog({ open: true });
    };

    const openEditProduct = (item: Item) => {
        setProductForm(item);
        const selectedSupplier = suppliers.find((s) => s.id === item.supplierId);
        const supplierItem = selectedSupplier?.items.find((i) => i.name === item.name);
        setSupplierPrice(supplierItem?.price);
        setImageTab("url");
        setProductDialog({ open: true, item });
    };

    const closeProductDialog = () => {
        setProductDialog({ open: false });
        setProductForm({});
        setSupplierPrice(undefined);
        setImageTab("url");
        setIsUploading(false);
    };

    const handleProductFormChange = (form: Partial<Item>) => {
        setProductForm(form);
    };

    const handleSaveProduct = () => {
        const { name, price, stock, category, supplierId } = productForm;
        if (!name || price === undefined || stock === undefined || !category || !supplierId) {
            toast.error("נא למלא את כל שדות החובה");
            return;
        }
        if (supplierPrice && price < supplierPrice * 1.3) {
            toast.error(`המחיר חייב להיות לפחות ₪${(supplierPrice * 1.3).toFixed(2)} (שולי רווח 30%)`);
            return;
        }
        if (productDialog.item) {
            updateItemMutation.mutate({ id: productDialog.item.id, item: productForm });
        } else {
            createItemMutation.mutate(productForm as Omit<Item, "id">);
        }
    };

    const handleDeleteProduct = (id: string) => {
        if (confirm("האם אתה בטוח שברצונך למחוק מוצר זה?")) {
            deleteItemMutation.mutate(id);
        }
    };

    const handleImageFileUpload = async (file: File) => {
        if (file.size > 32 * 1024 * 1024) {
            toast.error("הקובץ גדול מדי (מקסימום 32MB)");
            return;
        }
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
            const url: string = res.data.data.url;
            setProductForm((prev) => ({ ...prev, image: url }));
            toast.success("התמונה הועלתה בהצלחה!");
        } catch {
            toast.error("העלאת התמונה נכשלה. בדוק את ה-API KEY שלך.");
        } finally {
            setIsUploading(false);
        }
    };

    // ── Supplier dialog handlers ──
    const openAddSupplier = () => {
        setSupplierForm({});
        setCatalogItems([]);
        setNewItemName("");
        setNewItemPrice("");
        setSupplierDialog({ open: true });
    };

    const openEditSupplier = (supplier: Supplier, focusOnAdd = false) => {
        setSupplierForm(supplier);
        setCatalogItems([...supplier.items]);
        setNewItemName("");
        setNewItemPrice("");
        setSupplierDialog({ open: true, supplier, focusOnAdd });
    };

    const closeSupplierDialog = () => {
        setSupplierDialog({ open: false });
        setSupplierForm({});
        setCatalogItems([]);
    };

    const handleAddCatalogItem = () => {
        const trimmedName = newItemName.trim();
        const price = Number(newItemPrice);
        if (!trimmedName) {
            toast.error("נא להזין שם מוצר תקין");
            return;
        }
        if (!newItemPrice || price <= 0) {
            toast.error("נא להזין מחיר חיובי");
            return;
        }
        if (catalogItems.some((i) => i.name.toLowerCase() === trimmedName.toLowerCase())) {
            toast.error("מוצר עם שם זה כבר קיים בקטלוג");
            return;
        }
        setCatalogItems([...catalogItems, { name: trimmedName, price }]);
        setNewItemName("");
        setNewItemPrice("");
        newItemInputRef.current?.focus();
    };

    const handleRemoveCatalogItem = (index: number) => {
        setCatalogItems(catalogItems.filter((_, i) => i !== index));
    };

    const handleSaveSupplier = () => {
        const name = supplierForm.name?.trim();
        if (!name) {
            toast.error("שם הספק הוא חובה");
            return;
        }
        if (catalogItems.length === 0) {
            toast.error("יש להוסיף לפחות מוצר אחד לקטלוג הספק");
            return;
        }

        const payload = { name, items: catalogItems };
        if (supplierDialog.supplier) {
            updateSupplierMutation.mutate({ id: supplierDialog.supplier.id, supplier: payload });
        } else {
            createSupplierMutation.mutate(payload as Omit<Supplier, "id">);
        }
    };

    const handleDeleteSupplier = (id: string) => {
        if (confirm("מחיקת ספק תמחק את כל המוצרים הקשורים אליו. האם אתה בטוח?")) {
            deleteSupplierMutation.mutate(id);
        }
    };

    // ── Render ──
    return (
        <Container maxWidth="xl" sx={{ py: 4 }} dir="rtl">
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        color: "primary.main",
                        mb: 1,
                    }}
                >
                    לוח בקרה ניהולי
                </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_e, val: number) => setTabValue(val)}
                    aria-label="admin tabs"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab icon={<TrendingUp />} iconPosition="start" label="אנליטיקה" />
                    <Tab icon={<Inventory />} iconPosition="start" label="מוצרים" />
                    <Tab icon={<Group />} iconPosition="start" label="ספקים" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <AnalyticsTab analytics={analytics} totalProductsCount={items.length} lowStockItems={lowStockItems} allItems={items} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <ProductsTab
                    items={items}
                    onAddProduct={openAddProduct}
                    onEditProduct={openEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <SuppliersTab
                    suppliers={suppliers}
                    onAddSupplier={openAddSupplier}
                    onEditSupplier={openEditSupplier}
                    onDeleteSupplier={handleDeleteSupplier}
                />
            </TabPanel>

            {/* Dialogs */}
            <ProductDialog
                open={productDialog.open}
                isEditing={!!productDialog.item}
                productForm={productForm}
                suppliers={suppliers}
                supplierPrice={supplierPrice}
                imageTab={imageTab}
                isUploading={isUploading}
                onClose={closeProductDialog}
                onSave={handleSaveProduct}
                onFormChange={handleProductFormChange}
                onSupplierItemSelect={setSupplierPrice}
                onImageTabChange={setImageTab}
                onFileUpload={handleImageFileUpload}
            />

            <SupplierDialog
                open={supplierDialog.open}
                supplier={supplierDialog.supplier}
                focusOnAdd={supplierDialog.focusOnAdd}
                supplierForm={supplierForm}
                catalogItems={catalogItems}
                newItemName={newItemName}
                newItemPrice={newItemPrice}
                newItemInputRef={newItemInputRef}
                onClose={closeSupplierDialog}
                onSave={handleSaveSupplier}
                onSupplierFormChange={setSupplierForm}
                onNewItemNameChange={setNewItemName}
                onNewItemPriceChange={setNewItemPrice}
                onAddCatalogItem={handleAddCatalogItem}
                onRemoveCatalogItem={handleRemoveCatalogItem}
            />
        </Container>
    );
};

export default AdminPage;
