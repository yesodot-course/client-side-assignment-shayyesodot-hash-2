import { Add, DeleteSweep } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import type { RefObject } from "react";
import type { Supplier, SupplierItem } from "../../types";

interface SupplierDialogProps {
    open: boolean;
    supplier?: Supplier;
    focusOnAdd?: boolean;
    supplierForm: Partial<Supplier>;
    catalogItems: SupplierItem[];
    newItemName: string;
    newItemPrice: string;
    newItemInputRef: RefObject<HTMLInputElement | null>;
    onClose: () => void;
    onSave: () => void;
    onSupplierFormChange: (form: Partial<Supplier>) => void;
    onNewItemNameChange: (name: string) => void;
    onNewItemPriceChange: (price: string) => void;
    onAddCatalogItem: () => void;
    onRemoveCatalogItem: (index: number) => void;
}

export const SupplierDialog = ({
    open,
    supplier,
    focusOnAdd,
    supplierForm,
    catalogItems,
    newItemName,
    newItemPrice,
    newItemInputRef,
    onClose,
    onSave,
    onSupplierFormChange,
    onNewItemNameChange,
    onNewItemPriceChange,
    onAddCatalogItem,
    onRemoveCatalogItem,
}: SupplierDialogProps) => {
    const dialogTitle = supplier ? (focusOnAdd ? "הוספת מוצר לקטלוג הספק" : "עריכת פרטי ספק") : "הוספת ספק חדש";

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") onAddCatalogItem();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{ "& .MuiDialog-paper": { borderRadius: 3, background: "#ffffff" } }}
        >
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "right" }}>{dialogTitle}</DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <TextField
                    fullWidth
                    label="שם ספק"
                    value={supplierForm.name ?? ""}
                    onChange={(e) => onSupplierFormChange({ ...supplierForm, name: e.target.value })}
                    sx={{ mb: 4, mt: 1 }}
                />

                <Divider sx={{ mb: 2 }}>ניהול קטלוג מוצרים</Divider>

                {/* Add item row */}
                <Box sx={{ display: "flex", gap: 2, mb: 3, flexDirection: "row-reverse", alignItems: "flex-start" }}>
                    <TextField
                        sx={{ flexGrow: 1 }}
                        label="שם מוצר בקטלוג"
                        value={newItemName}
                        onChange={(e) => onNewItemNameChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        inputRef={newItemInputRef}
                    />
                    <TextField
                        sx={{ width: 150 }}
                        label="מחיר ספק (₪)"
                        type="number"
                        value={newItemPrice}
                        onChange={(e) => onNewItemPriceChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={onAddCatalogItem}
                        sx={{ mt: 1, flexShrink: 0 }}
                    >
                        הוסף לקטלוג
                    </Button>
                </Box>

                <Paper variant="outlined" sx={{ background: "#f9f9f9", borderRadius: 2 }}>
                    <List>
                        {catalogItems.length === 0 ? (
                            <Typography variant="body2" sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                                אין מוצרים בקטלוג הספק. הוסף לפחות מוצר אחד כדי להמשיך.
                            </Typography>
                        ) : (
                            catalogItems.map((item, index) => (
                                <ListItem
                                    key={index}
                                    divider={index < catalogItems.length - 1}
                                    sx={{ flexDirection: "row-reverse" }}
                                >
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`מחיר עלות: ₪${item.price.toFixed(2)}`}
                                        sx={{ textAlign: "right" }}
                                    />
                                    <ListItemSecondaryAction sx={{ right: 16, left: "auto" }}>
                                        <IconButton edge="end" color="error" onClick={() => onRemoveCatalogItem(index)}>
                                            <DeleteSweep />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))
                        )}
                    </List>
                </Paper>
            </DialogContent>

            <DialogActions sx={{ p: 3, justifyContent: "flex-start" }}>
                <Button onClick={onClose}>ביטול</Button>
                <Button variant="contained" onClick={onSave}>
                    שמור ספק וקטלוג
                </Button>
            </DialogActions>
        </Dialog>
    );
};
