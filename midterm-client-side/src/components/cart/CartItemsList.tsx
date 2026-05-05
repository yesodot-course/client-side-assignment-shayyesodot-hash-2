import { DeleteOutlined, Add, Remove } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, IconButton, TextField, Typography } from "@mui/material";
import type { CartItem } from "../../features/cart/cartSlice";

interface CartItemsListProps {
    items: CartItem[];
    onRemove: (id: string) => void;
    onUpdateQuantity: (item: CartItem, newQuantity: number) => void;
}

export const CartItemsList = ({ items, onRemove, onUpdateQuantity }: CartItemsListProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {items.map((item) => (
                <Card
                    key={item.id}
                    sx={{
                        display: "flex",
                        borderRadius: 4,
                        background: "#ffffff",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                        flexDirection: "row-reverse",
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{ width: 140, objectFit: "cover" }}
                        image={item.image}
                        alt={item.name}
                    />
                    <CardContent
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            py: 3,
                            px: 4,
                            textAlign: "right",
                        }}
                    >
                        {/* Item header */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexDirection: "row-reverse",
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {item.name}
                            </Typography>
                            <IconButton color="error" onClick={() => onRemove(item.id)} title="הסר מהסל">
                                <DeleteOutlined />
                            </IconButton>
                        </Box>

                        {/* Price */}
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, mt: 1 }}>
                            ₪{item.price.toFixed(2)}
                        </Typography>

                        {/* Quantity + total */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mt: 3,
                                flexDirection: "row-reverse",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    background: "#f9f9f9",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 8,
                                    p: 0.5,
                                }}
                            >
                                <IconButton
                                    size="small"
                                    disabled={item.quantity <= 1}
                                    onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                                >
                                    <Remove fontSize="small" />
                                </IconButton>
                                <TextField
                                    size="small"
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => onUpdateQuantity(item, Math.max(1, Number(e.target.value)))}
                                    variant="standard"
                                    slotProps={{
                                        input: { disableUnderline: true },
                                        htmlInput: {
                                            style: { textAlign: "center", width: "40px", fontWeight: "bold" },
                                            min: 1,
                                            max: item.stock,
                                        },
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    disabled={item.quantity >= item.stock}
                                    onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                                    title={item.quantity >= item.stock ? `מקסימום מלאי: ${item.stock}` : ""}
                                >
                                    <Add fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                סה"כ: ₪{(item.price * item.quantity).toFixed(2)}
                            </Typography>
                        </Box>

                        {/* Stock warning */}
                        {item.stock < 5 && item.stock > 0 && (
                            <Typography variant="caption" color="warning.main" sx={{ mt: 1 }}>
                                נותרו רק {item.stock} יחידות במלאי
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};
