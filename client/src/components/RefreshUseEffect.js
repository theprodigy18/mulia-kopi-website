import React, { createContext, useState } from 'react';

// Buat Context
export const RefreshUseEffectContext = createContext();

// Buat Provider untuk Context
export const RefreshUseEffectProvider = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0); // Contoh nilai awal

    return (
        <RefreshUseEffectContext.Provider value={{ refreshKey, setRefreshKey }}>
            {children}
        </RefreshUseEffectContext.Provider>
    );
};
