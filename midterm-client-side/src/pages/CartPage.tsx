import { ShoppingCartCheckout } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardMedia, Container, Grid, Paper, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { itemsApi } from "../api/itemsApi";
import { ordersApi } from "../api/ordersApi";
import type { RootState } from "../app/store";
import { CartItemsList } from "../components/cart/CartItemsList";
import { CartSummary } from "../components/cart/CartSummary";
import type { CartItem } from "../features/cart/cartSlice";
import { addToCart, clearCart, removeFromCart, updateQuantity } from "../features/cart/cartSlice";
import type { Item } from "../types";

const CartPage = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const { data: allItems = [] } = useQuery({ queryKey: ["items"], queryFn: itemsApi.getItems });

    const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
    const totalQuantity = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

    // Recommendations: same category items not in cart, with stock > 0
    // Shuffle deterministically by hashing item id + cart ids (no Math.random inside render)
    const recommendations = useMemo(() => {
        const cartCategories = new Set(cartItems.map((item) => item.category));
        const seed = cartItems.map((i) => i.id).join("");
        const hash = (s: string, i: number) => ((s.charCodeAt(i % s.length) || 1) * (i + 1)) % 97;

        return allItems
            .filter(
                (item) =>
                    cartCategories.has(item.category) &&
                    !cartItems.some((cartItem) => cartItem.id === item.id) &&
                    item.stock > 0
            )
            .map((item, i) => ({ item, order: hash(seed + item.id, i) }))
            .sort((a, b) => a.order - b.order)
            .map(({ item }) => item)
            .slice(0, 3);
    }, [allItems, cartItems]);

    // ── Checkout ──────────────────────────────────────────────────────────────

    const checkoutMutation = useMutation({
        mutationFn: async (address: string) => {
            const order = {
                items: cartItems.map((item: CartItem) => ({
                    itemId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                address,
                orderDate: new Date().toISOString(),
                shopProfit: 0,
            };
            return ordersApi.createOrder(order);
        },
        onSuccess: () => {
            dispatch(clearCart());
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success("ההזמנה בוצעה בהצלחה!");
        },
    });

    const handleCheckout = () => {
        if (cartItems.length > 10) {
            toast.error("הזמנה לא יכולה להכיל יותר מ-10 מוצרים שונים");
            return;
        }
        if (totalQuantity > 50) {
            toast.error('הזמנה לא יכולה להכיל יותר מ-50 פריטים סה"כ');
            return;
        }

        // Validate stock for all items before checkout
        const outOfStock = cartItems.find((item) => item.quantity > item.stock);
        if (outOfStock) {
            toast.error(`הכמות של "${outOfStock.name}" חורגת מהמלאי הזמין (${outOfStock.stock})`);
            return;
        }

        const address = prompt("נא להזין כתובת למשלוח:");
        if (address?.trim()) {
            checkoutMutation.mutate(address.trim());
        }
    };

    // ── Cart actions ──────────────────────────────────────────────────────────

    const handleRemove = (id: string) => {
        dispatch(removeFromCart(id));
        toast.success("הוסר מהסל");
    };

    const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
        if (newQuantity < 1) return;
        if (newQuantity > item.stock) {
            toast.error(`יש רק ${item.stock} יחידות במלאי`);
            return;
        }
        dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
        toast.success("הסל רוקן");
    };

    const handleAddRecommendation = (item: Item) => {
        const existingInCart = cartItems.find((c) => c.id === item.id);
        const currentQty = existingInCart?.quantity ?? 0;
        if (currentQty + 1 > item.stock) {
            toast.error(`אין מספיק מלאי עבור "${item.name}"`);
            return;
        }
        dispatch(addToCart({ item, quantity: 1 }));
        toast.success("נוסף לסל");
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <Container maxWidth="lg" sx={{ py: 6 }} dir="rtl">
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 800,
                    mb: 4,
                    color: "primary.main",
                    display: "inline-block",
                }}
            >
                סל הקניות שלך
            </Typography>

            <Grid container spacing={4}>
                {/* Cart Items */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {cartItems.length === 0 ? (
                        <Paper
                            sx={{
                                p: 6,
                                textAlign: "center",
                                background: "#f5f5f5",
                                borderRadius: 4,
                                border: "1px solid #e0e0e0",
                            }}
                        >
                            <ShoppingCartCheckout sx={{ fontSize: 80, color: "text.secondary", mb: 2, opacity: 0.5 }} />
                            <Typography variant="h5" color="text.secondary">
                                הסל שלך ריק לחלוטין.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                גלו מוצרים מדהימים בחנות שלנו.
                            </Typography>
                        </Paper>
                    ) : (
                        <CartItemsList
                            items={cartItems}
                            onRemove={handleRemove}
                            onUpdateQuantity={handleUpdateQuantity}
                        />
                    )}
                </Grid>

                {/* Order Summary */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <CartSummary
                        totalPrice={totalPrice}
                        totalQuantity={totalQuantity}
                        distinctItemsCount={cartItems.length}
                        isPending={checkoutMutation.isPending}
                        onCheckout={handleCheckout}
                        onClear={handleClearCart}
                    />
                </Grid>
            </Grid>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <Box sx={{ mt: 8 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: "right" }}>
                        אולי תאהבו גם
                    </Typography>
                    <Grid container spacing={3} sx={{ flexDirection: "row-reverse" }}>
                        {recommendations.map((item) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                                <Card
                                    sx={{
                                        background: "#ffffff",
                                        borderRadius: 2,
                                        border: "1px solid #e0e0e0",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        textAlign: "right",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={item.image}
                                        alt={item.name}
                                        sx={{ objectFit: "cover" }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.category}
                                        </Typography>
                                        <Typography variant="h6" color="primary.main">
                                            ₪{item.price.toFixed(2)}
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Button
                                            variant="contained"
                                            onClick={() => handleAddRecommendation(item)}
                                            sx={{ mt: 2, borderRadius: 2 }}
                                        >
                                            הוסף לסל
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
};

export default CartPage;
