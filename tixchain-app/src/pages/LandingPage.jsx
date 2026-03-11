import React from 'react';
import { Shield, Ticket, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ParticlesBackground = () => (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: -1 }}>
        {Array.from({ length: 20 }).map((_, i) => {
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            return (
                <div key={i} className="particle" style={{
                    position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${size}px`, height: `${size}px`,
                    backgroundColor: 'var(--color-cyan)', borderRadius: '50%', opacity: Math.random() * 0.5 + 0.1,
                    boxShadow: '0 0 10px var(--color-cyan)', animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`
                }} />
            );
        })}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px', zIndex: -1
        }}></div>
    </div>
);

const LandingPage = () => {
    const { isConnected, connectWallet, loading } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ position: 'relative', minHeight: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <ParticlesBackground />
            <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '100px 24px' }}>
                <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid var(--color-cyan)', borderRadius: '20px', marginBottom: '24px', color: 'var(--color-cyan)', fontSize: '14px', fontWeight: '600' }}>
                    Welcome to the Future of Ticketing
                </div>

                <h1 style={{ fontSize: '72px', marginBottom: '24px', letterSpacing: '-1px' }}>
                    Fair Ticketing for <br />
                    <span className="text-cyan glow-text">True Fans</span>
                </h1>

                <p style={{ fontSize: '20px', color: 'var(--color-text-dim)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                    Secure, transparent, and scalper-proof. Every ticket is an NFT on the Polygon blockchain, ensuring authenticity and a fair secondary market.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
                    {isConnected ? (
                        <button className="btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }} onClick={() => navigate('/events')}>
                            <Zap size={20} /> Browse Events
                        </button>
                    ) : (
                        <button className="btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }} onClick={connectWallet} disabled={loading}>
                            <Zap size={20} /> {loading ? 'Connecting...' : 'Connect Wallet'}
                        </button>
                    )}
                    <button className="btn-outline" style={{ fontSize: '18px', padding: '16px 32px' }} onClick={() => navigate('/events')}>
                        Explore Events
                    </button>
                </div>

                <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-around', padding: '40px', maxWidth: '900px', margin: '0 auto', gap: '24px', flexWrap: 'wrap' }}>
                    {[
                        { icon: <Ticket size={32} color="var(--color-cyan)" />, value: '10,000+', label: 'Tickets Secured' },
                        { icon: <Shield size={32} color="var(--color-cyan)" />, value: 'Zero', label: 'Scalping' },
                        { icon: <Zap size={32} color="var(--color-cyan)" />, value: '100%', label: 'On-Chain Verified' },
                    ].map((stat, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ padding: '16px', borderRadius: '50%', background: 'rgba(0, 212, 255, 0.1)' }}>{stat.icon}</div>
                            <h3 className="text-cyan glow-text" style={{ fontSize: '36px', marginTop: '8px' }}>{stat.value}</h3>
                            <p className="text-dim">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
