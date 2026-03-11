import React, { useState, useEffect } from 'react';
import { QrCode, Shield, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchQR } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CheckInMobile = () => {
    const { id } = useParams();
    const { isConnected } = useAuth();
    const [timer, setTimer] = useState(15);
    const [hue, setHue] = useState(0);
    const [qrData, setQrData] = useState(null);
    const navigate = useNavigate();

    const loadQR = () => {
        if (isConnected && id) {
            fetchQR(id).then(setQrData).catch(console.error);
        }
    };

    useEffect(() => {
        loadQR();
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setHue((h) => (h + 75) % 360);
                    loadQR(); // Refresh QR data
                    return 15;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [id, isConnected]);

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--color-navy)', zIndex: 1000, display: 'flex', flexDirection: 'column', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-outline" style={{ border: 'none', padding: '8px' }}>Close</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 212, 255, 0.1)', color: 'var(--color-cyan)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                    <Shield size={12} /> {qrData ? 'Sync Active' : 'Loading...'}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>{qrData?.eventName || 'Loading...'}</h2>
                <p className="text-dim" style={{ fontSize: '16px', marginBottom: '40px' }}>Ticket #{qrData?.tokenId || id}</p>

                <div style={{ padding: '24px', background: 'var(--color-white)', borderRadius: '24px', marginBottom: '40px', boxShadow: `0 0 30px hsla(${hue}, 100%, 50%, 0.4)`, transition: 'box-shadow 0.5s ease' }}>
                    <div style={{ width: '250px', height: '250px', background: `hsla(${190 + hue}, 100%, 30%, 1)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', transition: 'background 0.5s ease' }}>
                        <QrCode size={150} color="white" />
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.8)', boxShadow: '0 0 10px white', animation: 'scan 2.5s infinite linear' }}></div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                            <circle cx="20" cy="20" r="18" fill="none" stroke="var(--color-cyan)" strokeWidth="4" strokeDasharray="113" strokeDashoffset={113 - (113 * timer) / 15} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                        </svg>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{timer}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>Auto-refreshing</span>
                        <span className="text-dim" style={{ fontSize: '12px' }}>Code changes every 15s to prevent screenshot fraud</span>
                    </div>
                </div>

                {qrData?.hash && (
                    <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--color-text-dim)', marginBottom: '16px', wordBreak: 'break-all', textAlign: 'center', maxWidth: '300px' }}>
                        Hash: {qrData.hash.slice(0, 16)}...
                    </div>
                )}

                <button className="btn-outline" style={{ width: '100%', maxWidth: '300px', padding: '16px', borderRadius: '12px' }}>
                    Can't scan? Show backup code
                </button>
            </div>

            <style>{`@keyframes scan { 0% { top: 0%; } 50% { top: 100%; opacity: 1; } 50.1% { opacity: 0; } 100% { top: 0%; opacity: 0; } }`}</style>
        </div>
    );
};

export default CheckInMobile;
