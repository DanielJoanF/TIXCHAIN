import React, { useState } from 'react';
import { QrCode, Share2, Link as LinkIcon, Lock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MOCK_TICKETS = [
    { id: '1042', event: 'Crypto Music Festival 2026', date: 'Oct 15, 2026', type: 'VIP Pass', isQRActive: false, isSellable: true, price: 'Rp 650.000' },
    { id: '891', event: 'Web3 Builder Summit', date: 'Tomorrow', type: 'General', isQRActive: true, isSellable: false, price: 'Rp 1.500.000' }
];

const PremiumTicket = ({ ticket }) => (
    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)' }}>
        <div style={{ padding: '24px', background: 'linear-gradient(90deg, #1a2254, #00d4ff)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>{ticket.type}</div>
                <h3 style={{ fontSize: '20px', margin: 0 }}>{ticket.event}</h3>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} />
            </div>
        </div>
        <div style={{ padding: '24px', display: 'flex', gap: '24px', background: 'var(--color-navy)' }}>
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '16px' }}><div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>Date</div><div style={{ fontWeight: 'bold' }}>{ticket.date}</div></div>
                <div style={{ marginBottom: '16px' }}><div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>Token ID</div><div style={{ fontFamily: 'monospace', color: 'var(--color-cyan)' }}>#{ticket.id}</div></div>
                <div><div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>Original Mint</div><div>{ticket.price}</div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '120px', height: '120px', background: 'var(--color-white)', borderRadius: '12px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {ticket.isQRActive ? (
                        <div style={{ width: '100px', height: '100px', background: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><QrCode size={64} className="text-cyan" /></div>
                    ) : (
                        <>
                            <div style={{ width: '100px', height: '100px', background: 'var(--color-navy)', filter: 'blur(8px)', opacity: 0.5 }}></div>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--color-navy)' }}>
                                <Lock size={24} style={{ marginBottom: '8px' }} /><span style={{ fontSize: '10px', fontWeight: 'bold' }}>Unlocks H-1</span>
                            </div>
                        </>
                    )}
                </div>
                {ticket.isQRActive && (
                    <Link to={`/checkin/${ticket.id}`} style={{ marginTop: '12px', color: 'var(--color-cyan)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                        <Share2 size={14} /> View Full-Screen
                    </Link>
                )}
            </div>
        </div>
        <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'flex', gap: '12px' }}>
            <button className="btn-primary" style={{ flex: 1 }} disabled={!ticket.isSellable}>
                {!ticket.isSellable ? <><Lock size={16} /> Market Locked (&lt;H-7)</> : 'Sell in Marketplace'}
            </button>
            <button className="btn-outline" style={{ padding: '12px' }} title="View on Polygonscan"><LinkIcon size={16} /></button>
        </div>
    </div>
);

const UserDashboard = () => {
    const { isConnected, walletAddress, connectWallet } = useAuth();
    const [activeTab, setActiveTab] = useState('tickets');

    if (!isConnected) return (
        <div className="container animate-fade-in" style={{ padding: '100px 24px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '16px' }}>Connect your wallet to view your dashboard</h2>
            <button className="btn-primary" onClick={connectWallet}>Connect Wallet</button>
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--color-cyan), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>0x</div>
                    <div>
                        <h2 style={{ marginBottom: '8px', fontFamily: 'monospace' }}>{walletAddress.length > 16 ? walletAddress.slice(0, 8) + '...' + walletAddress.slice(-4) : walletAddress}</h2>
                        <div style={{ display: 'flex', gap: '16px', color: 'var(--color-text-dim)', fontSize: '14px' }}>
                            <span>Network: Polygon</span>
                        </div>
                    </div>
                </div>
            </div>

            <h1 style={{ marginBottom: '32px' }}>Dashboard</h1>

            <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {[{ id: 'tickets', label: 'My Tickets (2)' }, { id: 'history', label: 'History' }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                        padding: '16px 0', color: activeTab === tab.id ? 'var(--color-cyan)' : 'var(--color-text-dim)',
                        borderBottom: activeTab === tab.id ? '2px solid var(--color-cyan)' : '2px solid transparent',
                        fontWeight: activeTab === tab.id ? 'bold' : 'normal', transition: 'all 0.2s'
                    }}>{tab.label}</button>
                ))}
            </div>

            {activeTab === 'tickets' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
                    {MOCK_TICKETS.map(ticket => <PremiumTicket key={ticket.id} ticket={ticket} />)}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="glass-panel" style={{ padding: '0' }}>
                    {['Minted Ticket #1042 - Rp 650.000', 'Minted Ticket #891 - Rp 1.500.000'].map((log, i) => (
                        <div key={i} style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-cyan)' }}></div>
                            <div style={{ flex: 1 }}>{log}</div>
                            <div className="text-dim" style={{ fontSize: '14px' }}>Oct {10 - i}, 2026</div>
                            <LinkIcon size={16} className="text-dim" style={{ cursor: 'pointer' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
