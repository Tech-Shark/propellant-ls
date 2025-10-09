import axiosInstance from "@/api/AxiosInstance.ts";
import axios, {AxiosResponse, Method} from "axios";
import {toast} from "sonner";
import {useState} from "react";

export const ApiCall = ({method, url, data}: {
    method: Method;
    url: string;
    data: unknown;
}) => {
    const [isCalling, setIsCalling] = useState(false);

    let status = false;
    let response: AxiosResponse;

    const call = async () => {
        setIsCalling(true);

        const promise = axiosInstance({
            method,
            url,
            data
        });

        toast.promise(promise, {
            loading: 'Loading...',
            success: (response) => {
                status = true;
                return response?.data.message;
            },
            error: (error) => {
                console.error("API call error:", error);
                
                if (axios.isAxiosError(error)) {
                    // Get friendly error message
                    const errorMessage = error.response?.data?.message || 
                                        (error as any).friendlyMessage;
                    
                    if (errorMessage) {
                        return errorMessage;
                    }
                    
                    // Network error
                    if (!error.response) {
                        return "Network error. Please check your connection and try again.";
                    }
                    
                    return "An error occurred. Please try again.";
                }
                
                return "Something went wrong. Please try again later.";
            },
            finally: () => {
                setIsCalling(false);
            }
        });

        response = await promise;
    }

    call();

    return {status, response, isCalling};
}