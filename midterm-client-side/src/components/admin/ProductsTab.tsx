import { Add, Delete, Edit } from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import type { Item } from "../../types";

interface ProductsTabProps {
    items: Item[];
    onAddProduct: () => void;
    onEditProduct: (item: Item) => void;
    onDeleteProduct: (id: string) => void;
}

export const ProductsTab = ({ items, onAddProduct, onEditProduct, onDeleteProduct }: ProductsTabProps) => (
    <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                ניהול מוצרים
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={onAddProduct} sx={{ borderRadius: 2 }}>
                הוסף מוצר לחנות
            </Button>
        </Box>
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 3,
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            <Table>
                <TableHead>
                    <TableRow sx={{ background: "#f5f5f5" }}>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            שם מוצר
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            קטגוריה
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            ספק
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            מחיר
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            מלאי
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                            פעולות
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                אין מוצרים בחנות
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell align="right">{item.name}</TableCell>
                                <TableCell align="right">{item.category}</TableCell>
                                <TableCell align="right">{item.supplier}</TableCell>
                                <TableCell align="right">₪{item.price.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="body2"
                                        color={
                                            item.stock === 0
                                                ? "error.main"
                                                : item.stock < 5
                                                  ? "warning.main"
                                                  : "text.primary"
                                        }
                                        sx={{ fontWeight: item.stock < 5 ? "bold" : "normal" }}
                                    >
                                        {item.stock}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <IconButton color="primary" onClick={() => onEditProduct(item)} title="ערוך מוצר">
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => onDeleteProduct(item.id)} title="מחק מוצר">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
);
