import { ArrowForward, ShoppingCart, VerifiedUser } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Divider,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { itemsApi } from "../api/itemsApi";
import type { RootState } from "../app/store";
import { addToCart } from "../features/cart/cartSlice";

const DetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [quantity, setQuantity] = useState(1);
    const { data: item, isLoading } = useQuery({
        queryKey: ["item", id],
        queryFn: () => itemsApi.getItem(id ?? ""),
        enabled: Boolean(id),
    });

    const handleAddToCart = () => {
        if (!item) return;
        const existingInCart = cartItems.find((c) => c.id === item.id);
        const totalRequested = (existingInCart?.quantity || 0) + quantity;

        if (totalRequested > item.stock) {
            toast.error(`אין מספיק מלאי. (כבר יש ${existingInCart?.quantity || 0} בסל, המקסימום הוא ${item.stock})`);
            return;
        }
        dispatch(addToCart({ item, quantity }));
        toast.success("נוסף לסל בהצלחה");
    };

    if (isLoading)
        return (
            <Typography align="center" sx={{ mt: 10 }}>
                טוען...
            </Typography>
        );
    if (!item)
        return (
            <Typography align="center" sx={{ mt: 10 }}>
                המוצר לא נמצא
            </Typography>
        );

    return (
        <Container maxWidth="lg" sx={{ py: 6 }} dir="rtl">
            <Button
                startIcon={<ArrowForward />}
                onClick={() => navigate(-1)}
                sx={{ mb: 4, color: "text.secondary", "&:hover": { color: "primary.main" } }}
            >
                חזרה למוצרים
            </Button>

            <Card
                sx={{
                    borderRadius: 4,
                    background: "#ffffff",
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                <Grid container sx={{ flexDirection: "row-reverse" }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                p: 4,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={item.image}
                                alt={item.name}
                                sx={{
                                    maxHeight: 500,
                                    objectFit: "contain",
                                    borderRadius: 2,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <CardContent
                            sx={{ p: 6, display: "flex", flexDirection: "column", height: "100%", textAlign: "right" }}
                        >
                            <Box sx={{ mb: 2 }}>
                                <Chip label={item.category} color="primary" variant="outlined" sx={{ ml: 1, mb: 2 }} />
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.2 }}>
                                    {item.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    ספק: {item.supplier}
                                </Typography>
                            </Box>

                            <Typography variant="h3" color="primary.main" sx={{ fontWeight: 900, mb: 3 }}>
                                ₪{item.price.toFixed(2)}
                            </Typography>

                            <Divider sx={{ my: 2, borderColor: "#e0e0e0" }} />

                            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, mb: 4 }}>
                                {item.description}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 4,
                                    flexDirection: "row-reverse",
                                    justifyContent: "flex-start",
                                }}
                            >
                                <VerifiedUser color="success" />
                                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                                    {item.stock} יחידות זמינות במלאי
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    mt: "auto",
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: 3,
                                    flexDirection: "row-reverse",
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        כמות
                                    </Typography>
                                    <TextField
                                        type="number"
                                        value={quantity}
                                        onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
                                        disabled={item.stock === 0}
                                        slotProps={{ htmlInput: { min: 1, max: item.stock } }}
                                        sx={{ width: 100 }}
                                    />
                                </Box>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleAddToCart}
                                    disabled={item.stock === 0}
                                    startIcon={<ShoppingCart />}
                                    sx={{
                                        flexGrow: 1,
                                        py: 2,
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                    }}
                                >
                                    {item.stock > 0 ? "הוסף לסל" : "אזל מהמלאי"}
                                </Button>
                            </Box>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Container>
    );
};

export default DetailsPage;
