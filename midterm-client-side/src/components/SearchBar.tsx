import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
    <TextField
        placeholder="חיפוש מוצרים..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        fullWidth
        variant="outlined"
        dir="rtl"
        slotProps={{
            input: {
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="action" />
                    </InputAdornment>
                ),
                sx: {
                    borderRadius: 3,
                    backgroundColor: "rgba(30, 33, 48, 0.5)",
                    "&:hover": { backgroundColor: "rgba(30, 33, 48, 0.8)" },
                    textAlign: "right",
                },
            },
        }}
    />
);
