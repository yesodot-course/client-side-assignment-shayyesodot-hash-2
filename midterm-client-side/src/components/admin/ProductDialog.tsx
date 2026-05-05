import { CheckCircle, Link as LinkIcon, Upload } from "@mui/icons-material";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import type { Item, Supplier } from "../../types";

interface ProductDialogProps {
    open: boolean;
    isEditing: boolean;
    productForm: Partial<Item>;
    suppliers: Supplier[];
    supplierPrice?: number;
    imageTab: "url" | "file";
    isUploading: boolean;
    onClose: () => void;
    onSave: () => void;
    onFormChange: (form: Partial<Item>) => void;
    onSupplierItemSelect: (price: number | undefined) => void;
    onImageTabChange: (tab: "url" | "file") => void;
    onFileUpload: (file: File) => void;
}

export const ProductDialog = ({
    open,
    isEditing,
    productForm,
    suppliers,
    supplierPrice,
    imageTab,
    isUploading,
    onClose,
    onSave,
    onFormChange,
    onSupplierItemSelect,
    onImageTabChange,
    onFileUpload,
}: ProductDialogProps) => {
    const minPrice = supplierPrice ? supplierPrice * 1.3 : undefined;
    const priceError = !!(minPrice && productForm.price !== undefined && productForm.price < minPrice);

    const selectedSupplier = suppliers.find((s) => s.id === productForm.supplierId);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{ "& .MuiDialog-paper": { borderRadius: 3, background: "#ffffff" } }}
        >
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "right" }}>
                {isEditing ? "עריכת מוצר" : "הוספת מוצר חדש לחנות"}
            </DialogTitle>

            <DialogContent sx={{ display: "grid", gap: 2.5, pt: 2 }}>
                {/* Supplier selector */}
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>ספק</InputLabel>
                    <Select
                        value={productForm.supplierId ?? ""}
                        label="ספק"
                        onChange={(e) => {
                            const selected = suppliers.find((s) => s.id === e.target.value);
                            onFormChange({
                                ...productForm,
                                supplierId: e.target.value as string,
                                supplier: selected?.name ?? "",
                                name: "",
                            });
                            onSupplierItemSelect(undefined);
                        }}
                    >
                        {suppliers.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                                {s.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Product from supplier catalog */}
                <FormControl fullWidth disabled={!productForm.supplierId}>
                    <InputLabel>מוצר מקטלוג הספק</InputLabel>
                    <Select
                        value={productForm.name ?? ""}
                        label="מוצר מקטלוג הספק"
                        onChange={(e) => {
                            const si = selectedSupplier?.items.find((i) => i.name === e.target.value);
                            onFormChange({ ...productForm, name: e.target.value as string });
                            onSupplierItemSelect(si?.price);
                        }}
                    >
                        {selectedSupplier?.items.map((si) => (
                            <MenuItem key={si.name} value={si.name}>
                                {si.name} (₪{si.price.toFixed(2)})
                            </MenuItem>
                        )) ?? <MenuItem disabled>בחר ספק תחילה</MenuItem>}
                    </Select>
                </FormControl>

                {/* Store price */}
                <TextField
                    label="מחיר בחנות (₪)"
                    type="number"
                    value={productForm.price ?? ""}
                    onChange={(e) => onFormChange({ ...productForm, price: Number(e.target.value) })}
                    helperText={minPrice ? `מחיר מינימום: ₪${minPrice.toFixed(2)} (שולי רווח 30%)` : ""}
                    error={priceError}
                    slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                />

                {/* Stock */}
                <TextField
                    label="מלאי"
                    type="number"
                    value={productForm.stock ?? ""}
                    onChange={(e) => onFormChange({ ...productForm, stock: Number(e.target.value) })}
                    slotProps={{ htmlInput: { min: 0 } }}
                />

                {/* Category */}
                <TextField
                    label="קטגוריה"
                    value={productForm.category ?? ""}
                    onChange={(e) => onFormChange({ ...productForm, category: e.target.value })}
                />

                {/* Image */}
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: "right" }}>
                        תמונת מוצר
                    </Typography>
                    <ToggleButtonGroup
                        value={imageTab}
                        exclusive
                        onChange={(_e, val) => val && onImageTabChange(val)}
                        size="small"
                        sx={{ mb: 2, flexDirection: "row-reverse" }}
                    >
                        <ToggleButton value="url">
                            <LinkIcon sx={{ mr: 0.5 }} fontSize="small" />
                            קישור (URL)
                        </ToggleButton>
                        <ToggleButton value="file">
                            <Upload sx={{ mr: 0.5 }} fontSize="small" />
                            העלאת קובץ
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {imageTab === "url" ? (
                        <TextField
                            fullWidth
                            placeholder="https://example.com/image.jpg"
                            value={productForm.image ?? ""}
                            onChange={(e) => onFormChange({ ...productForm, image: e.target.value })}
                        />
                    ) : (
                        <Box
                            component="label"
                            sx={{
                                display: "block",
                                border: "2px dashed #cccccc",
                                borderRadius: 2,
                                p: 3,
                                textAlign: "center",
                                cursor: isUploading ? "not-allowed" : "pointer",
                                "&:hover": !isUploading ? { borderColor: "primary.main", background: "#f5f5f5" } : {},
                                transition: "all 0.2s",
                                opacity: isUploading ? 0.7 : 1,
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                disabled={isUploading}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) onFileUpload(file);
                                    e.target.value = "";
                                }}
                            />
                            {isUploading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Typography variant="body2">לחץ להעלאת תמונה</Typography>
                            )}
                            {productForm.image && !isUploading && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,
                                        mt: 1,
                                    }}
                                >
                                    <CheckCircle color="success" fontSize="small" />
                                    <Typography variant="caption" color="success.main">
                                        התמונה הועלתה בהצלחה
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>

                {/* Description */}
                <TextField
                    label="תיאור מוצר"
                    value={productForm.description ?? ""}
                    onChange={(e) => onFormChange({ ...productForm, description: e.target.value })}
                    multiline
                    rows={3}
                />
            </DialogContent>

            <DialogActions sx={{ p: 3, justifyContent: "flex-start" }}>
                <Button onClick={onClose}>ביטול</Button>
                <Button variant="contained" onClick={onSave}>
                    שמור מוצר
                </Button>
            </DialogActions>
        </Dialog>
    );
};
