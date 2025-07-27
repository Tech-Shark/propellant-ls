import {Outlet} from 'react-router-dom';
import {useOTPContext} from "@/context/OTPContext.tsx";
import OTPVerification from "@/components/OTPVerification.tsx";
import {Toaster} from "sonner";

function App() {
    const {isVisible} = useOTPContext();

    return (
        <div className="min-h-screen bg-background">
            {
                isVisible && (
                    <div
                        className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
                        <OTPVerification/>
                    </div>
                )
            }

            <Toaster position="top-right" richColors/>
            <Outlet/>
        </div>
    );
}

export default App;
