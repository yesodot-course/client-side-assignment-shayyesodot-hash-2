import { AttachMoney, Group, Inventory, TrendingUp, Warning } from "@mui/icons-material";
import { Box, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import type { Analytics, Item } from "../../types";

interface AnalyticsTabProps {
    analytics?: Analytics;
    totalProductsCount: number;
    lowStockItems: Item[];
}

export const AnalyticsTab = ({ analytics, totalProductsCount, lowStockItems }: AnalyticsTabProps) => {
    if (!analytics) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ background: "#ffffff", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" }}>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <Inventory color="primary" />
                            <Typography variant="h6" color="text.secondary">
                                סה"כ מוצרים
                            </Typography>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center" }}>
                            {totalProductsCount}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ background: "#ffffff", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" }}>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <AttachMoney color="success" />
                            <Typography variant="h6" color="text.secondary">
                                הכנסה חודשית
                            </Typography>
                        </Box>
                        <Typography variant="h3" color="success.main" sx={{ fontWeight: "bold", textAlign: "center" }}>
                            ₪{analytics.monthlyRevenue?.toFixed(2) || "0.00"}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ background: "#ffffff", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" }}>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <TrendingUp color="warning" />
                            <Typography variant="h6" color="text.secondary">
                                קטגוריה מובילה
                            </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
                            {analytics.weeklyProfitableCategory || "אין נתונים"}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ background: "#ffffff", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" }}>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <Group color="info" />
                            <Typography variant="h6" color="text.secondary">
                                ספק הכי רווחי
                            </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
                            {analytics.mostProfitableSupplier?.name || "אין נתונים"}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Detail Cards */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ background: "#ffffff", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" }}>
                    <CardContent sx={{ textAlign: "right" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            מוצר הכי רווחי (24 שעות)
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {analytics.dailyProfitableItem?.name || "אין פריט רווחי היום"}
                        </Typography>
                        {analytics.dailyProfitableItem?.price && (
                            <Typography variant="body2" color="text.secondary">
                                ₪{analytics.dailyProfitableItem.price.toFixed(2)}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ background: "#ffffff", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" }}>
                    <CardContent sx={{ textAlign: "right" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            שולי רווח (כל הזמן)
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="success.main"
                                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                                >
                                    שולי רווח הכי גבוהים
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                    {analytics.highestProfitMarginItem?.name || "אין נתונים"}
                                </Typography>
                                {analytics.highestProfitMarginItem?.price && (
                                    <Typography variant="body2" color="text.secondary">
                                        ₪{analytics.highestProfitMarginItem.price.toFixed(2)}
                                    </Typography>
                                )}
                            </Box>
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="error.main"
                                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                                >
                                    שולי רווח הכי נמוכים
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                    {analytics.lowestProfitMarginItem?.name || "אין נתונים"}
                                </Typography>
                                {analytics.lowestProfitMarginItem?.price && (
                                    <Typography variant="body2" color="text.secondary">
                                        ₪{analytics.lowestProfitMarginItem.price.toFixed(2)}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Card
                    sx={{
                        background: "#ffffff",
                        height: "100%",
                        border: lowStockItems.length > 0 ? "1px solid rgba(255,152,0,0.8)" : "1px solid #e0e0e0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}
                >
                    <CardContent sx={{ textAlign: "right" }}>
                        <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, flexDirection: "row-reverse" }}
                        >
                            <Warning color={lowStockItems.length > 0 ? "warning" : "disabled"} />
                            <Typography
                                variant="h6"
                                color={lowStockItems.length > 0 ? "warning.main" : "text.secondary"}
                            >
                                מלאי נמוך ({lowStockItems.length})
                            </Typography>
                        </Box>
                        {lowStockItems.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                כל המוצרים במלאי תקין ✓
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0.5,
                                    maxHeight: 120,
                                    overflowY: "auto",
                                }}
                            >
                                {lowStockItems.map((item) => (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            flexDirection: "row-reverse",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                maxWidth: "70%",
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                        <Typography variant="caption" color="warning.main" sx={{ fontWeight: "bold" }}>
                                            {item.stock} נותרו
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Supplier Spending */}
            {analytics.supplierSpending && (
                <Grid size={{ xs: 12 }}>
                    <Card sx={{ background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" }}>
                        <CardContent sx={{ textAlign: "right" }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                פירוט הוצאות לפי ספק
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {[...analytics.supplierSpending]
                                    .sort((a, b) => b.amount - a.amount)
                                    .map((s, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            p: 1.5,
                                            borderRadius: 2,
                                            background: "#f9f9f9",
                                            flexDirection: "row-reverse",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                flexDirection: "row-reverse",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ width: 24, textAlign: "center" }}
                                            >
                                                {i + 1}.
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {s.supplierName}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" color="primary.light" sx={{ fontWeight: "bold" }}>
                                            ₪{s.amount.toFixed(2)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Grid>
    );
};
