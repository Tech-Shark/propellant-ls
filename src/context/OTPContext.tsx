import React, {createContext} from "react";

interface OTPContextType {
    isVisible: boolean;
    type: string;
    setType: (type: string) => void;
    setIsVisible: (isVisible: boolean) => void;
    setEmail: (email: string) => void;
    email: string;
    url: string;
    setUrl: (url: string) => void;
}

const OTPContext = createContext<OTPContextType | undefined>(undefined);

export const OTPContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [type, setType] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [url, setUrl] = React.useState('');

    return (
        <OTPContext.Provider value={{ isVisible, type, setType, setIsVisible, setEmail, email, url, setUrl }}>
            {children}
        </OTPContext.Provider>
    )
}

export const useOTPContext = () => {
    const context = React.useContext(OTPContext);
    if (context === undefined) {
        throw new Error('useOTPContext must be used within a OTPContextProvider');
    }
    return context;
}