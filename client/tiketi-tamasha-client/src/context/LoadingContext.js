/*
    GLORY BE TO GOD,
    TIKETI-TAMASHA,

    LOADING CONTEXT PROVIDER,
    BY ISRAEL MAFABI EMMANUEL
*/

import React, { createContext, useState, useContext } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
