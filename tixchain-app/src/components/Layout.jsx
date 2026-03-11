import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { isConnected, walletAddress, loading, connectWallet, disconnect } = useAuth();

    return (
        <>
            <header style={{ padding: '20px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(10, 14, 39, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div className="container flex-between">
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--color-cyan)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy)', fontWeight: 'bold' }}>T</div>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-white)' }}>Tix<span className="text-cyan">Chain</span></span>
                    </Link>

                    <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <Link to="/events" className="text-dim hover:text-white" style={{ transition: 'color 0.2s' }}>Events</Link>
                        <Link to="/market" className="text-dim hover:text-white" style={{ transition: 'color 0.2s' }}>Marketplace</Link>
                        <Link to="/dashboard" className="text-dim hover:text-white" style={{ transition: 'color 0.2s' }}>Dashboard</Link>

                        {isConnected ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid var(--color-cyan)', padding: '8px 16px', borderRadius: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }}></div>
                                    <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--color-cyan)' }}>
                                        {walletAddress.length > 12 ? walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4) : walletAddress}
                                    </span>
                                </div>
                                <button onClick={disconnect} className="btn-outline" style={{ padding: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <LogOut size={14} />
                                </button>
                            </div>
                        ) : (
                            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={connectWallet} disabled={loading}>
                                <Wallet size={16} />
                                {loading ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <main>
                {children}
            </main>
        </>
    );
};

export default Layout;
