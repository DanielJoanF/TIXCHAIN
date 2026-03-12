import React, { createContext, useContext, useState, useEffect } from 'react';
import { walletLogin } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(localStorage.getItem('tixchain_wallet') || '');
    const [token, setToken] = useState(localStorage.getItem('tixchain_token') || '');
    const [role, setRole] = useState(localStorage.getItem('tixchain_role') || '');
    const [loading, setLoading] = useState(false);

    const isConnected = !!token;

    const connectWallet = async () => {
        setLoading(true);
        try {
            // Simulate wallet address (in prod, this comes from MetaMask)
            const hex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            const simulatedWallet = '0x' + hex;
            const data = await walletLogin(simulatedWallet);

            setWalletAddress(data.walletAddress);
            setToken(data.token);
            setRole(data.role);
            localStorage.setItem('tixchain_wallet', data.walletAddress);
            localStorage.setItem('tixchain_token', data.token);
            localStorage.setItem('tixchain_role', data.role);
        } catch (err) {
            console.error('Wallet connect failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const disconnect = () => {
        setWalletAddress('');
        setToken('');
        setRole('');
        localStorage.removeItem('tixchain_wallet');
        localStorage.removeItem('tixchain_token');
        localStorage.removeItem('tixchain_role');
    };

    return (
        <AuthContext.Provider value={{ walletAddress, token, role, isConnected, loading, connectWallet, disconnect }}>
            {children}
        </AuthContext.Provider>
    );
};
