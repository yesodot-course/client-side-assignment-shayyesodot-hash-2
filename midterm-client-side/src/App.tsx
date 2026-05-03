import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import { Box } from "@mui/material";

function App() {
    return (
        <>
            <Navbar />
            <Box component="main" sx={{ p: 2 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<DetailsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </Box>
        </>
    );
}

export default App;
