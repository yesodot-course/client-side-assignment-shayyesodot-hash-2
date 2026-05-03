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
                        <StorefrontIcon sx={{ ml: 1, color: "primary.main", fontSize: 32 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                fontWeight: 900,
                                letterSpacing: ".05rem",
                                color: "inherit",
                                background: "linear-gradient(45deg, #b6d11dff 30%, #3ddd0c71 90%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
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
                                borderRadius: "12px",
                                px: 2,
                                fontWeight: 700,
                                color: location.pathname === "/admin" ? "white" : "text.primary",
                                "& .MuiButton-startIcon": { ml: 1, mr: 0 },
                            }}
                        >
                            ניהול
                        </Button>
                        <Button
                            component={Link}
                            to="/cart"
                            variant={location.pathname === "/cart" ? "contained" : "outlined"}
                            color="primary"
                            startIcon={
                                <Badge badgeContent={totalCartItems} color="secondary">
                                    <ShoppingCartIcon />
                                </Badge>
                            }
                            sx={{
                                borderRadius: "12px",
                                px: 2,
                                fontWeight: 700,
                                "& .MuiButton-startIcon": { ml: 1, mr: 0 },
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
