import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {OTPContextProvider} from "@/context/OTPContext.tsx";
import {RouterProvider} from "react-router-dom";
import {router} from "@/routes/Routes.tsx";
import { AuthProvider } from './context/AuthContext.tsx';

createRoot(document.getElementById("root")!).render(
    <OTPContextProvider>
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    </OTPContextProvider>
);
