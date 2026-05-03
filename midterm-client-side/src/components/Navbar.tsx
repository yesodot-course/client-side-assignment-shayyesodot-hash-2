import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { AppBar, Badge, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import type { RootState } from "../app/store";

const Navbar = () => {
    const location = useLocation();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const totalCartItems = cartItems.reduce((total: number, item) => total + item.quantity, 0);

    return (
        <AppBar position="sticky" sx={{ top: 0, zIndex: 1100 }} dir="rtl">
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{ minHeight: "70px !important", display: "flex", justifyContent: "space-between" }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "inherit",
                            flexShrink: 0,
                            mr: 2,
                        }}
                        component={Link}
                        to="/"
                    >
                        <StorefrontIcon sx={{ ml: 1, color: "secondary.main", fontSize: 32 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                fontWeight: 900,
                                letterSpacing: ".05rem",
                                color: "#ffffff",
                                display: { xs: "none", sm: "block" },
                            }}
                        >
                            שי שיווק השקמה
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Button
                            component={Link}
                            to="/admin"
                            variant={location.pathname === "/admin" ? "contained" : "text"}
                            startIcon={<AdminPanelSettingsIcon />}
                            sx={{
                                borderRadius: "20px",
                                px: 2,
                                fontWeight: 700,
                                color: location.pathname === "/admin" ? "primary.main" : "white",
                                backgroundColor: location.pathname === "/admin" ? "#ffffff" : "transparent",
                                "& .MuiButton-startIcon": { ml: 1, mr: 0 },
                                "&:hover": {
                                    backgroundColor:
                                        location.pathname === "/admin" ? "#ffffff" : "rgba(255,255,255,0.2)",
                                },
                            }}
                        >
                            ניהול
                        </Button>
                        <Button
                            component={Link}
                            to="/cart"
                            variant={location.pathname === "/cart" ? "contained" : "text"}
                            startIcon={
                                <Badge badgeContent={totalCartItems} color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            }
                            sx={{
                                borderRadius: "20px",
                                px: 3,
                                py: 1,
                                fontWeight: 700,
                                color: location.pathname === "/cart" ? "primary.main" : "white",
                                backgroundColor: location.pathname === "/cart" ? "#ffffff" : "transparent",
                                "& .MuiButton-startIcon": { ml: 1, mr: 0 },
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor:
                                        location.pathname === "/cart" ? "#ffffff" : "rgba(255,255,255,0.2)",
                                },
                            }}
                        >
                            סל קניות
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
