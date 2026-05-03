import { Box, CircularProgress, Container, Fade, Grid, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { itemsApi } from "../api/itemsApi";
import type { RootState } from "../app/store";
import { Filters } from "../components/Filters";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";
import { addToCart } from "../features/cart/cartSlice";
import type { Item } from "../types";

const HomePage = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const { data: items = [], isLoading } = useQuery({ queryKey: ["items"], queryFn: itemsApi.getItems });
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        supplier: "",
        minPrice: 0,
        maxPrice: 10000,
        sortBy: "",
    });

    const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))), [items]);
    const suppliers = useMemo(() => Array.from(new Set(items.map((item) => item.supplier))), [items]);

    const filteredItems = useMemo(() => {
        return items
            .filter(
                (item) =>
                    item.name.toLowerCase().includes(search.toLowerCase()) &&
                    (filters.category === "" || item.category === filters.category) &&
                    (filters.supplier === "" || item.supplier === filters.supplier) &&
                    item.price >= filters.minPrice &&
                    item.price <= filters.maxPrice
            )
            .sort((a, b) => {
                switch (filters.sortBy) {
                    case "price-asc":
                        return a.price - b.price;
                    case "price-desc":
                        return b.price - a.price;
                    case "name-asc":
                        return a.name.localeCompare(b.name);
                    case "name-desc":
                        return b.name.localeCompare(a.name);
                    default:
                        return 0;
                }
            });
    }, [items, search, filters]);

    const handleAddToCart = (item: Item, quantity: number) => {
        const existingInCart = cartItems.find((c) => c.id === item.id);
        const totalRequested = (existingInCart?.quantity || 0) + quantity;

        if (totalRequested > item.stock) {
            toast.error(`אין מספיק מלאי. (כבר יש ${existingInCart?.quantity || 0} בסל, המקסימום הוא ${item.stock})`);
            return;
        }

        dispatch(addToCart({ item, quantity }));
        toast.success("נוסף לסל בהצלחה");
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress color="primary" size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }} dir="rtl">
            {/* Hero Section */}
            <Box sx={{ textAlign: "center", mb: 8, mt: 4 }}>
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 900,
                        fontSize: { xs: "3rem", md: "5rem" },
                        background: "linear-gradient(45deg, #e4d72cff 30%, #e64545ff 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 2,
                        textShadow: "0 0 40px rgba(139, 92, 246, 0.3)",
                    }}
                >
                    שי שיווק השקמה
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: "auto", fontWeight: 300 }}>
                    גלו את קולקציית המוצרים המובילה שלנו, שנבחרה בקפידה במיוחד עבורכם.
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ flexDirection: "row-reverse" }}>
                {/* Filters Sidebar */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            background: "rgba(30, 33, 48, 0.5)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                            position: "sticky",
                            top: 100,
                            textAlign: "right",
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
                            חיפוש וסינון
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <SearchBar value={search} onChange={setSearch} />
                            <Filters
                                category={filters.category}
                                supplier={filters.supplier}
                                sortBy={filters.sortBy}
                                minPrice={filters.minPrice}
                                maxPrice={filters.maxPrice}
                                categories={categories}
                                suppliers={suppliers}
                                onChange={setFilters}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Product Grid */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {filteredItems.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 10 }}>
                            <Typography variant="h5" color="text.secondary">
                                לא נמצאו מוצרים התואמים לחיפוש שלך.
                            </Typography>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
                                gap: 4,
                                justifyItems: "center",
                            }}
                        >
                            {filteredItems.map((item, index) => (
                                <Fade in={true} timeout={500 + index * 100} key={item.id}>
                                    <Box>
                                        <ProductCard item={item} onAddToCart={handleAddToCart} />
                                    </Box>
                                </Fade>
                            ))}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default HomePage;
