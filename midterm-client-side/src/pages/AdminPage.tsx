import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Item, Supplier, SupplierItem, Analytics } from '../types';
import { itemsApi } from '../api/itemsApi';
import { suppliersApi } from '../api/suppliersApi';
import { revenueApi } from '../api/revenueApi';
import { 
  Button, Typography, Box, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Card, CardContent, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, FormControl, InputLabel, 
  Select, MenuItem, Tabs, Tab, Container, Grid, IconButton, 
  ToggleButtonGroup, ToggleButton, CircularProgress, Divider, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { 
  Edit, Delete, Add, TrendingUp, Inventory, Group, AttachMoney, 
  Link as LinkIcon, Upload, CheckCircle, Warning, DeleteSweep 
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';

const fetchItems = async (): Promise<Item[]> => {
  try {
    return await itemsApi.getItems();
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

const fetchSuppliers = async (): Promise<Supplier[]> => {
  try {
    return await suppliersApi.getSuppliers();
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
};

const fetchAnalytics = async (): Promise<Analytics> => {
  try {
    const [monthlyRevenue, weeklyCategory, dailyItem, profitMargins, mostProfitableSupplier, supplierSpending] = await Promise.all([
      revenueApi.getMonthlyRevenue(),
      revenueApi.getWeeklyProfitableCategory(),
      revenueApi.getDailyProfitableItem(),
      revenueApi.getProfitMargins(),
      revenueApi.getMostProfitableSupplier(),
      revenueApi.getSupplierSpending(),
    ]);

    return {
      totalProducts: 0,
      lowStockItems: [],
      monthlyRevenue,
      weeklyProfitableCategory: weeklyCategory,
      dailyProfitableItem: dailyItem,
      highestProfitMarginItem: profitMargins.highest,
      lowestProfitMarginItem: profitMargins.lowest,
      mostProfitableSupplier,
      supplierSpending,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      totalProducts: 0,
      lowStockItems: [],
      monthlyRevenue: 0,
      weeklyProfitableCategory: '',
      dailyProfitableItem: {} as Item,
      highestProfitMarginItem: {} as Item,
      lowestProfitMarginItem: {} as Item,
      mostProfitableSupplier: {} as Supplier,
      supplierSpending: [],
    };
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPage = () => {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ['items'], queryFn: fetchItems });
  const { data: suppliers = [] } = useQuery({ queryKey: ['suppliers'], queryFn: fetchSuppliers });
  const { data: analytics } = useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics });

  const [tabValue, setTabValue] = useState(0);
  const [imageTab, setImageTab] = useState<'url' | 'file'>('url');
  const [isUploading, setIsUploading] = useState(false);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string;
  const [productDialog, setProductDialog] = useState<{ open: boolean; item?: Item }>({ open: false });
  const [supplierDialog, setSupplierDialog] = useState<{ open: boolean; supplier?: Supplier; focusOnAdd?: boolean }>({ open: false });
  
  const [productForm, setProductForm] = useState<Partial<Item>>({});
  const [supplierForm, setSupplierForm] = useState<Partial<Supplier>>({});
  const [catalogItems, setCatalogItems] = useState<SupplierItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<string>('');
  const [supplierPrice, setSupplierPrice] = useState<number | undefined>();
  
  const newItemInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (supplierDialog.open && supplierDialog.focusOnAdd) {
      setTimeout(() => newItemInputRef.current?.focus(), 100);
    }
  }, [supplierDialog.open, supplierDialog.focusOnAdd]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const createItemMutation = useMutation({
    mutationFn: (item: Omit<Item, 'id'>) => itemsApi.createItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('המוצר נוצר בהצלחה');
      handleCloseProductDialog();
    },
    onError: (error: Error | AxiosError<{ message?: string }>) => {
      const message = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : 'נכשלה יצירת המוצר';
      toast.error(message);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, item }: { id: string; item: Partial<Item> }) => itemsApi.updateItem(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('המוצר עודכן בהצלחה');
      handleCloseProductDialog();
    },
    onError: () => toast.error('עדכון המוצר נכשל'),
  });

  const createSupplierMutation = useMutation({
    mutationFn: (supplier: Omit<Supplier, 'id'>) => suppliersApi.createSupplier(supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('ספק נוצר בהצלחה');
      handleCloseSupplierDialog();
    },
    onError: (error: Error | AxiosError<{ message?: string }>) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : 'נכשלה יצירת הספק';
      toast.error(message);
    },
  });

  const updateSupplierMutation = useMutation({
    mutationFn: ({ id, supplier }: { id: string; supplier: Partial<Supplier> }) => suppliersApi.updateSupplier(id, supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('הספק עודכן בהצלחה');
      handleCloseSupplierDialog();
    },
    onError: () => toast.error('עדכון הספק נכשל'),
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => itemsApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('המוצר נמחק');
    },
    onError: () => toast.error('מחיקת המוצר נכשלה'),
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: (id: string) => suppliersApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('הספק נמחק');
    },
    onError: () => toast.error('מחיקת הספק נכשלה'),
  });

  const handleDeleteItem = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      deleteItemMutation.mutate(id);
    }
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm('מחיקת ספק תמחק את כל המוצרים הקשורים אליו. האם אתה בטוח?')) {
      deleteSupplierMutation.mutate(id);
    }
  };

  const handleAddProduct = () => {
    setProductForm({});
    setSupplierPrice(undefined);
    setProductDialog({ open: true });
  };

  const handleEditProduct = (item: Item) => {
    setProductForm(item);
    const selectedSupplier = suppliers.find(s => s.id === item.supplierId);
    const supplierItem = selectedSupplier?.items.find(i => i.name === item.name);
    setSupplierPrice(supplierItem?.price);
    setProductDialog({ open: true, item });
  };

  const handleCloseProductDialog = () => {
    setProductDialog({ open: false });
    setProductForm({});
    setSupplierPrice(undefined);
    setImageTab('url');
    setIsUploading(false);
  };

  const handleImageFileUpload = async (file: File) => {
    if (file.size > 32 * 1024 * 1024) {
      toast.error('הקובץ גדול מדי (מקסימום 32MB)');
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData,
      );
      const url: string = res.data.data.url;
      setProductForm((prev) => ({ ...prev, image: url }));
      toast.success('התמונה הועלתה בהצלחה!');
    } catch {
      toast.error('העלאת התמונה נכשלה. בדוק את ה-API KEY שלך.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSupplier = () => {
    setSupplierForm({});
    setCatalogItems([]);
    setNewItemName('');
    setNewItemPrice('');
    setSupplierDialog({ open: true });
  };

  const handleEditSupplier = (supplier: Supplier, focusOnAdd: boolean = false) => {
    setSupplierForm(supplier);
    setCatalogItems([...supplier.items]);
    setNewItemName('');
    setNewItemPrice('');
    setSupplierDialog({ open: true, supplier, focusOnAdd });
  };

  const handleCloseSupplierDialog = () => {
    setSupplierDialog({ open: false });
    setSupplierForm({});
    setCatalogItems([]);
  };

  const handleAddCatalogItem = () => {
    if (!newItemName || !newItemPrice || Number(newItemPrice) <= 0) {
      toast.error('נא להזין שם תקין ומחיר חיובי');
      return;
    }
    setCatalogItems([...catalogItems, { name: newItemName, price: Number(newItemPrice) }]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleRemoveCatalogItem = (index: number) => {
    setCatalogItems(catalogItems.filter((_, i) => i !== index));
  };

  const handleSaveProduct = () => {
    const { name, price, stock, category, supplierId } = productForm;
    if (!name || price === undefined || stock === undefined || !category || !supplierId) {
      toast.error('נא למלא את כל שדות החובה');
      return;
    }

    if (supplierPrice && productForm.price && productForm.price < supplierPrice * 1.3) {
      toast.error(`המחיר חייב להיות לפחות $${(supplierPrice * 1.3).toFixed(2)} (שולי רווח של 30%)`);
      return;
    }
    
    if (productDialog.item) {
      updateItemMutation.mutate({ id: productDialog.item.id, item: productForm });
    } else {
      createItemMutation.mutate(productForm as Omit<Item, 'id'>);
    }
  };

  const handleSaveSupplier = () => {
    const name = supplierForm.name?.trim();
    if (!name) {
      toast.error('שם הספק הוא חובה');
      return;
    }
    if (catalogItems.length === 0) {
      toast.error('יש להוסיף לפחות מוצר אחד לקטלוג הספק');
      return;
    }

    const payload = { name, items: catalogItems };
    
    if (supplierDialog.supplier) {
      updateSupplierMutation.mutate({ id: supplierDialog.supplier.id, supplier: payload });
    } else {
      createSupplierMutation.mutate(payload as Omit<Supplier, 'id'>);
    }
  };

  const totalProductsCount = items.length;
  const lowStockItems = items.filter((item) => item.stock > 0 && item.stock < 5);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }} dir="rtl">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #8b5cf6 30%, #ec4899 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          לוח בקרה ניהולי
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs" textColor="primary" indicatorColor="primary">
          <Tab icon={<TrendingUp />} iconPosition="start" label="אנליטיקה" />
          <Tab icon={<Inventory />} iconPosition="start" label="מוצרים" />
          <Tab icon={<Group />} iconPosition="start" label="ספקים" />
        </Tabs>
      </Box>

      {/* Analytics Tab */}
      <CustomTabPanel value={tabValue} index={0}>
        {analytics ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ background: 'linear-gradient(145deg, #1e2130, #262a3d)', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Inventory color="primary" />
                    <Typography variant="h6" color="text.secondary">סה"כ מוצרים</Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{totalProductsCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ background: 'linear-gradient(145deg, #1e2130, #262a3d)', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AttachMoney color="success" />
                    <Typography variant="h6" color="text.secondary">הכנסה חודשית</Typography>
                  </Box>
                  <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold', textAlign: 'center' }}>${analytics.monthlyRevenue?.toFixed(2) || '0.00'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ background: 'linear-gradient(145deg, #1e2130, #262a3d)', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TrendingUp color="warning" />
                    <Typography variant="h6" color="text.secondary">קטגוריה מובילה</Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{analytics.weeklyProfitableCategory || 'אין נתונים'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ background: 'linear-gradient(145deg, #1e2130, #262a3d)', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Group color="info" />
                    <Typography variant="h6" color="text.secondary">ספק הכי רווחי</Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{analytics.mostProfitableSupplier?.name || 'אין נתונים'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ background: 'linear-gradient(145deg, #1e2130, #262a3d)', height: '100%' }}>
                <CardContent sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>מוצר הכי רווחי (24 שעות)</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{analytics.dailyProfitableItem?.name || 'אין פריט רווחי היום'}</Typography>
                  {analytics.dailyProfitableItem?.price && (
                    <Typography variant="body2" color="text.secondary">${analytics.dailyProfitableItem.price.toFixed(2)}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ background: 'linear-gradient(145deg, #1e2130, #262a3d)', height: '100%' }}>
                <CardContent sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>שולי רווח (כל הזמן)</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>שולי רווח הכי גבוהים</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{analytics.highestProfitMarginItem?.name || 'אין נתונים'}</Typography>
                      {analytics.highestProfitMarginItem?.price && (
                        <Typography variant="body2" color="text.secondary">${analytics.highestProfitMarginItem.price.toFixed(2)}</Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="caption" color="error.main" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>שולי רווח הכי נמוכים</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{analytics.lowestProfitMarginItem?.name || 'אין נתונים'}</Typography>
                      {analytics.lowestProfitMarginItem?.price && (
                        <Typography variant="body2" color="text.secondary">${analytics.lowestProfitMarginItem.price.toFixed(2)}</Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ background: 'linear-gradient(145deg, #1e2130, #262a3d)', height: '100%', border: lowStockItems.length > 0 ? '1px solid rgba(255,152,0,0.4)' : 'none' }}>
                <CardContent sx={{ textAlign: 'right' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexDirection: 'row-reverse' }}>
                    <Warning color={lowStockItems.length > 0 ? 'warning' : 'disabled'} />
                    <Typography variant="h6" color={lowStockItems.length > 0 ? 'warning.main' : 'text.secondary'}>
                      מלאי נמוך ({lowStockItems.length})
                    </Typography>
                  </Box>
                  {lowStockItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">כל המוצרים במלאי תקין ✓</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxHeight: 120, overflowY: 'auto' }}>
                      {lowStockItems.map((item) => (
                        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse' }}>
                          <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{item.name}</Typography>
                          <Typography variant="caption" color="warning.main" sx={{ fontWeight: 'bold' }}>{item.stock} נותרו</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {analytics.supplierSpending && (
              <Grid size={{ xs: 12 }}>
                <Card sx={{ background: 'linear-gradient(145deg, #1e2130, #262a3d)' }}>
                  <CardContent sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>פירוט הוצאות לפי ספק</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {analytics.supplierSpending.map((s, i) => (
                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, background: 'rgba(0,0,0,0.2)', flexDirection: 'row-reverse' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: 'row-reverse' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ width: 24, textAlign: 'center' }}>{i + 1}.</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{s.supplierName}</Typography>
                          </Box>
                          <Typography variant="body1" color="primary.light" sx={{ fontWeight: 'bold' }}>${s.amount.toFixed(2)}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        )}
      </CustomTabPanel>

      {/* Products Tab */}
      <CustomTabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>ניהול מוצרים</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddProduct} sx={{ borderRadius: 2 }}>
            הוסף מוצר לחנות
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 3, background: 'rgba(30, 33, 48, 0.5)', backdropFilter: 'blur(10px)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(0,0,0,0.2)' }}>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>שם מוצר</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>קטגוריה</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>ספק</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>מחיר חנות</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>מלאי</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell align="right">{item.name}</TableCell>
                  <TableCell align="right">{item.category}</TableCell>
                  <TableCell align="right">{item.supplier}</TableCell>
                  <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.stock}</TableCell>
                  <TableCell align="left">
                    <IconButton color="primary" onClick={() => handleEditProduct(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteItem(item.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomTabPanel>

      {/* Suppliers Tab */}
      <CustomTabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>ניהול ספקים וקטלוגים</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddSupplier} sx={{ borderRadius: 2 }}>
            הוסף ספק חדש
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 3, background: 'rgba(30, 33, 48, 0.5)', backdropFilter: 'blur(10px)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(0,0,0,0.2)' }}>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>שם ספק</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>כמות מוצרים בקטלוג</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold' }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} hover>
                  <TableCell align="right">{supplier.name}</TableCell>
                  <TableCell align="right">{supplier.items.length}</TableCell>
                  <TableCell align="left">
                    <IconButton color="success" onClick={() => handleEditSupplier(supplier, true)} title="הוסף מוצר לקטלוג">
                      <Add />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteSupplier(supplier.id)} title="מחק ספק">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomTabPanel>

      {/* Product Dialog */}
      <Dialog open={productDialog.open} onClose={handleCloseProductDialog} maxWidth="sm" fullWidth dir="rtl" sx={{ '& .MuiDialog-paper': { borderRadius: 3, background: '#1e2130' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'right' }}>{productDialog.item ? 'עריכת מוצר' : 'הוספת מוצר חדש לחנות'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2.5, pt: 2 }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>ספק</InputLabel>
            <Select
              value={productForm.supplierId ?? ''}
              label="ספק"
              onChange={(event) => {
                const selectedSupplier = suppliers.find(s => s.id === event.target.value);
                setProductForm({ 
                  ...productForm, 
                  supplierId: event.target.value as string,
                  supplier: selectedSupplier?.name ?? '',
                  name: ''
                });
                setSupplierPrice(undefined);
              }}
            >
              {suppliers.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth disabled={!productForm.supplierId}>
            <InputLabel>מוצר מקטלוג הספק</InputLabel>
            <Select
              value={productForm.name ?? ''}
              label="מוצר מקטלוג הספק"
              onChange={(event) => {
                const selectedSupplier = suppliers.find(s => s.id === productForm.supplierId);
                const si = selectedSupplier?.items.find(i => i.name === event.target.value);
                setProductForm({ ...productForm, name: event.target.value as string });
                setSupplierPrice(si?.price);
              }}
            >
              {suppliers.find(s => s.id === productForm.supplierId)?.items.map((si) => (
                <MenuItem key={si.name} value={si.name}>
                  {si.name} (${si.price.toFixed(2)})
                </MenuItem>
              )) || <MenuItem disabled>בחר ספק תחילה</MenuItem>}
            </Select>
          </FormControl>

          <TextField
            label="מחיר בחנות (דולר)"
            type="number"
            value={productForm.price ?? ''}
            onChange={(event) => setProductForm({ ...productForm, price: Number(event.target.value) })}
            helperText={supplierPrice ? `מחיר מינימום: $${(supplierPrice * 1.3).toFixed(2)} (שולי רווח של 30%)` : ''}
            error={!!supplierPrice && !!productForm.price && productForm.price < supplierPrice * 1.3}
          />
          <TextField
            label="מלאי"
            type="number"
            value={productForm.stock ?? ''}
            onChange={(event) => setProductForm({ ...productForm, stock: Number(event.target.value) })}
          />
          <TextField
            label="קטגוריה"
            value={productForm.category ?? ''}
            onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
          />
          
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'right' }}>תמונת מוצר</Typography>
            <ToggleButtonGroup value={imageTab} exclusive onChange={(_e, val) => val && setImageTab(val)} size="small" sx={{ mb: 2, flexDirection: 'row-reverse' }}>
              <ToggleButton value="url">קישור (URL)</ToggleButton>
              <ToggleButton value="file">העלאת קובץ</ToggleButton>
            </ToggleButtonGroup>

            {imageTab === 'url' ? (
              <TextField
                fullWidth
                placeholder="https://example.com/image.jpg"
                value={productForm.image ?? ''}
                onChange={(event) => setProductForm({ ...productForm, image: event.target.value })}
              />
            ) : (
              <Box
                sx={{
                  border: '2px dashed rgba(139,92,246,0.4)',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  '&:hover': !isUploading ? { borderColor: 'primary.main', background: 'rgba(139,92,246,0.05)' } : {},
                  transition: 'all 0.2s',
                  opacity: isUploading ? 0.7 : 1,
                }}
                component="label"
              >
                <input type="file" accept="image/*" hidden disabled={isUploading} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFileUpload(file);
                  e.target.value = '';
                }} />
                {isUploading ? <CircularProgress size={24} /> : <Typography variant="body2">לחץ להעלאת תמונה</Typography>}
                {productForm.image && !isUploading && <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>התמונה הועלתה בהצלחה ✓</Typography>}
              </Box>
            )}
          </Box>

          <TextField
            label="תיאור מוצר"
            value={productForm.description ?? ''}
            onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'flex-start' }}>
          <Button onClick={handleCloseProductDialog}>ביטול</Button>
          <Button variant="contained" onClick={handleSaveProduct}>שמור מוצר</Button>
        </DialogActions>
      </Dialog>

      {/* Supplier Dialog */}
      <Dialog open={supplierDialog.open} onClose={handleCloseSupplierDialog} maxWidth="md" fullWidth dir="rtl" sx={{ '& .MuiDialog-paper': { borderRadius: 3, background: '#1e2130' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'right' }}>
          {supplierDialog.supplier ? (supplierDialog.focusOnAdd ? 'הוספת מוצר לקטלוג הספק' : 'עריכת פרטי ספק') : 'הוספת ספק חדש'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="שם ספק"
            value={supplierForm.name ?? ''}
            onChange={(event) => setSupplierForm({ ...supplierForm, name: event.target.value })}
            sx={{ mb: 4, mt: 1 }}
          />
          
          <Divider sx={{ mb: 2 }}>ניהול קטלוג מוצרים</Divider>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: 'row-reverse' }}>
            <TextField
              sx={{ flexGrow: 1 }}
              label="שם מוצר בקטלוג"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              inputRef={newItemInputRef}
            />
            <TextField
              sx={{ width: 150 }}
              label="מחיר ספק"
              type="number"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
            />
            <Button variant="outlined" startIcon={<Add />} onClick={handleAddCatalogItem}>
              הוסף לקטלוג
            </Button>
          </Box>

          <Paper variant="outlined" sx={{ background: 'rgba(0,0,0,0.1)', borderRadius: 2 }}>
            <List>
              {catalogItems.map((item, index) => (
                <ListItem key={index} divider={index < catalogItems.length - 1} sx={{ flexDirection: 'row-reverse' }}>
                  <ListItemText 
                    primary={item.name} 
                    secondary={`מחיר עלות: $${item.price.toFixed(2)}`}
                    sx={{ textAlign: 'right' }}
                  />
                  <ListItemSecondaryAction sx={{ right: 16, left: 'auto' }}>
                    <IconButton edge="end" color="error" onClick={() => handleRemoveCatalogItem(index)}>
                      <DeleteSweep />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {catalogItems.length === 0 && (
                <Typography variant="body2" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                  אין מוצרים בקטלוג הספק. הוסף לפחות מוצר אחד כדי להמשיך.
                </Typography>
              )}
            </List>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'flex-start' }}>
          <Button onClick={handleCloseSupplierDialog}>ביטול</Button>
          <Button variant="contained" onClick={handleSaveSupplier}>שמור ספק וקטלוג</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;
