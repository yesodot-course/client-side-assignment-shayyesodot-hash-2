import { Box, Button, Divider, Paper, Typography } from "@mui/material";

interface CartSummaryProps {
    totalPrice: number;
    totalQuantity: number;
    distinctItemsCount: number;
    isPending: boolean;
    onCheckout: () => void;
    onClear: () => void;
}

export const CartSummary = ({
    totalPrice,
    totalQuantity,
    distinctItemsCount,
    isPending,
    onCheckout,
    onClear,
}: CartSummaryProps) => {
    return (
        <Paper
            sx={{
                p: 4,
                borderRadius: 4,
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                position: "sticky",
                top: 100,
                textAlign: "right",
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                סיכום הזמנה
            </Typography>
            <Divider sx={{ mb: 3, borderColor: "#e0e0e0" }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, flexDirection: "row-reverse" }}>
                <Typography color="text.secondary">פריטים שונים</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{distinctItemsCount} / 10</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexDirection: "row-reverse" }}>
                <Typography color="text.secondary">סה"כ פריטים ({totalQuantity})</Typography>
                <Typography sx={{ fontWeight: "bold" }}>₪{totalPrice.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexDirection: "row-reverse" }}>
                <Typography color="text.secondary">משלוח</Typography>
                <Typography color="success.main" sx={{ fontWeight: "bold" }}>
                    חינם
                </Typography>
            </Box>

            <Divider sx={{ mb: 3, borderColor: "#e0e0e0" }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, flexDirection: "row-reverse" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    סה"כ לתשלום
                </Typography>
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: "bold" }}>
                    ₪{totalPrice.toFixed(2)}
                </Typography>
            </Box>

            {totalQuantity > 50 && (
                <Typography variant="caption" color="error.main" sx={{ display: "block", mb: 2, textAlign: "center" }}>
                    ⚠ הזמנה חורגת ממגבלת 50 פריטים
                </Typography>
            )}
            {distinctItemsCount > 10 && (
                <Typography variant="caption" color="error.main" sx={{ display: "block", mb: 2, textAlign: "center" }}>
                    ⚠ הזמנה חורגת ממגבלת 10 מוצרים שונים
                </Typography>
            )}

            <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={onCheckout}
                disabled={distinctItemsCount === 0 || isPending}
                sx={{ py: 1.5, borderRadius: 8, fontWeight: 700, fontSize: "1.1rem", mb: 2 }}
            >
                {isPending ? "מעבד..." : "המשך לתשלום"}
            </Button>

            <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={onClear}
                disabled={distinctItemsCount === 0}
                sx={{ borderRadius: 8 }}
            >
                רוקן סל
            </Button>
        </Paper>
    );
};
