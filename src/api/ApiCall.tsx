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
                if (axios.isAxiosError(error)) {
                    console.log(error)
                    return error.response?.data.message;
                }
                else {
                    return "Something went wrong. Please try again later.";
                }
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