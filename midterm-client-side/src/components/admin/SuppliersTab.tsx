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
import type { Supplier } from "../../types";

interface SuppliersTabProps {
    suppliers: Supplier[];
    onAddSupplier: () => void;
    onEditSupplier: (supplier: Supplier, focusOnAdd?: boolean) => void;
    onDeleteSupplier: (id: string) => void;
}

export const SuppliersTab = ({ suppliers, onAddSupplier, onEditSupplier, onDeleteSupplier }: SuppliersTabProps) => (
    <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                ניהול ספקים וקטלוגים
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={onAddSupplier} sx={{ borderRadius: 2 }}>
                הוסף ספק חדש
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
                            שם ספק
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            כמות מוצרים בקטלוג
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                            פעולות
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {suppliers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                אין ספקים
                            </TableCell>
                        </TableRow>
                    ) : (
                        suppliers.map((supplier) => (
                            <TableRow key={supplier.id} hover>
                                <TableCell align="right">{supplier.name}</TableCell>
                                <TableCell align="right">{supplier.items.length}</TableCell>
                                <TableCell align="left">
                                    <IconButton
                                        color="primary"
                                        onClick={() => onEditSupplier(supplier, false)}
                                        title="ערוך ספק וקטלוג"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => onDeleteSupplier(supplier.id)}
                                        title="מחק ספק"
                                    >
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
