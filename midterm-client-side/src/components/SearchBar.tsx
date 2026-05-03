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
                        <SearchIcon color="primary" />
                    </InputAdornment>
                ),
                sx: {
                    borderRadius: 30,
                    backgroundColor: "#ffffff",
                    "&:hover": { backgroundColor: "#f9f9f9" },
                    textAlign: "right",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                },
            },
        }}
    />
);
