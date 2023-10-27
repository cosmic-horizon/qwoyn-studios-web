// KeplrContext.js
import React, { createContext, useContext, useState } from 'react';

const KeplrContext = createContext();

export const useKeplr = () => {
    return useContext(KeplrContext);
}

export const KeplrProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [keplrAddress, setKeplrAddress] = useState(localStorage.getItem('keplrAddress') || null);

    const connectKeplr = (address) => {
        setIsConnected(true);
        setKeplrAddress(address);
        localStorage.setItem('keplrAddress', address);
    };

    const disconnectKeplr = () => {
        setIsConnected(false);
        setKeplrAddress(null);
        localStorage.removeItem('keplrAddress');
    };

    return (
        <KeplrContext.Provider value={{ isConnected, keplrAddress, connectKeplr, disconnectKeplr }}>
            {children}
        </KeplrContext.Provider>
    )
};
