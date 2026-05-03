import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, Card, CardContent, CardMedia, Chip, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Item } from "../types";

interface ProductCardProps {
    item: Item;
    onAddToCart: (item: Item, quantity: number) => void;
}

export const ProductCard = ({ item, onAddToCart }: ProductCardProps) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <Card
            dir="rtl"
            sx={{
                width: 320,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                textAlign: "right",
            }}
        >
            <Box sx={{ position: "relative" }}>
                <CardMedia
                    component="img"
                    height="220"
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: "cover" }}
                />
                <Chip
                    label={item.category}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        color: "primary.main",
                        fontWeight: "bold",
                        border: "1px solid rgba(0,0,0,0.1)",
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5, p: 3 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        height: "2.4em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {item.name}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row-reverse",
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
                        ₪{item.price.toFixed(2)}
                    </Typography>
                    <Typography
                        variant="body2"
                        color={item.stock > 0 ? "success.main" : "error.main"}
                        sx={{ fontWeight: 600 }}
                    >
                        {item.stock > 0 ? `${item.stock} יחידות במלאי` : "אזל מהמלאי"}
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 2, flexDirection: "row-reverse" }}>
                    <TextField
                        size="small"
                        type="number"
                        value={quantity}
                        onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
                        disabled={item.stock === 0}
                        slotProps={{ htmlInput: { min: 1, max: item.stock } }}
                        sx={{ width: 80, "& input": { textAlign: "center", p: 1 } }}
                    />
                    <Button
                        variant="outlined"
                        component={Link}
                        to={`/product/${item.id}`}
                        fullWidth
                        startIcon={<VisibilityIcon sx={{ ml: 1, mr: 0 }} />}
                        sx={{ borderRadius: 5 }}
                    >
                        פרטים
                    </Button>
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    disabled={item.stock === 0}
                    onClick={() => onAddToCart(item, quantity)}
                    startIcon={<ShoppingCartIcon sx={{ ml: 1, mr: 0 }} />}
                    sx={{ mt: 1, py: 1.2, borderRadius: 5, fontWeight: "bold" }}
                >
                    {item.stock > 0 ? "הוסף לסל" : "אזל מהמלאי"}
                </Button>
            </CardContent>
        </Card>
    );
};
