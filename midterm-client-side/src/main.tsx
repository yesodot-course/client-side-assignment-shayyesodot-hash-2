import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./app/store";
import { theme } from "./theme";
import "./index.css";
import App from "./App";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <BrowserRouter>
                        <App />
                        <ToastContainer theme="dark" />
                    </BrowserRouter>
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    </StrictMode>
);
