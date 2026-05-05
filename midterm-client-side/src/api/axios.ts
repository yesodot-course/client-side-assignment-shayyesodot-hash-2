import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "אירעה שגיאה בתקשורת עם השרת";
        toast.error(message);
        return Promise.reject(error);
    }
);

export default apiClient;
