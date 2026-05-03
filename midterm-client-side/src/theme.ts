import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#004789", // Rami Levy Blue
            light: "#1963A6",
            dark: "#002b5e",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#E50012", // Rami Levy Red
            light: "#ff3344",
            dark: "#b3000e",
            contrastText: "#ffffff",
        },
        background: {
            default: "#f5f5f5", // Light gray background
            paper: "#ffffff",
        },
        text: {
            primary: "#333333",
            secondary: "#666666",
        },
    },
    typography: {
        fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
        },
        h2: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
        },
        h3: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
        },
        h4: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
        },
        h5: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
        },
        h6: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
        },
        button: {
            textTransform: "none",
            fontWeight: 700,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    padding: "8px 24px",
                    transition: "all 0.2s ease",
                },
                contained: {
                    boxShadow: "none",
                    "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 10px rgba(0, 71, 137, 0.2)",
                    },
                },
                outlined: {
                    borderWidth: "2px",
                    "&:hover": {
                        borderWidth: "2px",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: "1px solid #e0e0e0",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#004789", // Solid Blue Header
                    color: "#ffffff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 30,
                        backgroundColor: "#ffffff",
                        "& fieldset": {
                            borderColor: "#cccccc",
                        },
                        "&:hover fieldset": {
                            borderColor: "#999999",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#004789",
                            borderWidth: "2px",
                        },
                    },
                },
            },
        },
    },
});
