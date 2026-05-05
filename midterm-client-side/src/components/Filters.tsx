import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

interface FiltersProps {
    category: string;
    supplier: string;
    sortBy: string;
    minPrice: number;
    maxPrice: number;
    categories: string[];
    suppliers: string[];
    onChange: (filters: {
        category: string;
        supplier: string;
        sortBy: string;
        minPrice: number;
        maxPrice: number;
    }) => void;
}

export const Filters = ({
    category,
    supplier,
    sortBy,
    minPrice,
    maxPrice,
    categories,
    suppliers,
    onChange,
}: FiltersProps) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }} dir="rtl">
        <FormControl fullWidth size="small">
            <InputLabel>קטגוריה</InputLabel>
            <Select
                value={category}
                label="קטגוריה"
                onChange={(event) => onChange({ category: event.target.value, supplier, sortBy, minPrice, maxPrice })}
            >
                <MenuItem value="">הכל</MenuItem>
                {categories.map((value) => (
                    <MenuItem key={value} value={value}>
                        {value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

        <FormControl fullWidth size="small">
            <InputLabel>ספק</InputLabel>
            <Select
                value={supplier}
                label="ספק"
                onChange={(event) => onChange({ category, supplier: event.target.value, sortBy, minPrice, maxPrice })}
            >
                <MenuItem value="">הכל</MenuItem>
                {suppliers.map((value) => (
                    <MenuItem key={value} value={value}>
                        {value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, flexDirection: "row-reverse" }}>
            <TextField
                label="מחיר מקסימלי"
                type="number"
                size="small"
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={maxPrice}
                onChange={(event) => {
                    const value = Math.max(0, Number(event.target.value));
                    onChange({ category, supplier, sortBy, minPrice, maxPrice: value });
                }}
            />
            <TextField
                label="מחיר מינימלי"
                type="number"
                size="small"
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={minPrice}
                onChange={(event) => {
                    const value = Math.max(0, Number(event.target.value));
                    onChange({ category, supplier, sortBy, minPrice: value, maxPrice });
                }}
            />
        </Box>

        <FormControl fullWidth size="small">
            <InputLabel>מיון לפי</InputLabel>
            <Select
                value={sortBy}
                label="מיון לפי"
                onChange={(event) => onChange({ category, supplier, sortBy: event.target.value, minPrice, maxPrice })}
            >
                <MenuItem value="">ללא מיון</MenuItem>
                <MenuItem value="price-asc">מחיר: מהנמוך לגבוה</MenuItem>
                <MenuItem value="price-desc">מחיר: מהגבוה לנמוך</MenuItem>
                <MenuItem value="name-asc">שם: א-ת</MenuItem>
                <MenuItem value="name-desc">שם: ת-א</MenuItem>
            </Select>
        </FormControl>
    </Box>
);
