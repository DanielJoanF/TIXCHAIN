import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, MapPin, Plus, Minus, Info, Loader } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchEvent, mintTicket } from '../services/api';

const SuccessConfetti = () => (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
        {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} style={{
                position: 'absolute', left: `${Math.random() * 100}%`, top: `-10%`,
                width: '10px', height: '10px',
                backgroundColor: ['#00d4ff', '#fff', '#0a0e27'][Math.floor(Math.random() * 3)],
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `fall ${Math.random() * 2 + 1}s linear forwards`
            }} />
        ))}
        <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(720deg); } }`}</style>
    </div>
);

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isConnected, walletAddress, connectWallet } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [mintState, setMintState] = useState('idle');
    const [mintResult, setMintResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvent(id)
            .then(data => { setEvent(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [id]);

    const handleMint = async () => {
        if (!isConnected) { connectWallet(); return; }
        setMintState('minting');
        setError(null);
        try {
            const result = await mintTicket(event.id, walletAddress);
            setMintResult(result);
            setMintState('success');
        } catch (err) {
            setError(err.message);
            setMintState('idle');
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <Loader size={32} className="text-cyan" style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (!event) return (
        <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
            <p style={{ color: '#ef4444' }}>Event not found. {error}</p>
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '40px 24px', position: 'relative' }}>
            {mintState === 'success' && <SuccessConfetti />}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(320px, 1fr)', gap: '40px', alignItems: 'start' }}>
                <div>
                    <div style={{ width: '100%', aspectRatio: '21/9', background: 'linear-gradient(45deg, #1a2254, #00d4ff)', borderRadius: '16px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }}></div>
                    </div>
                    <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>{event.name}</h1>
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', color: 'var(--color-text-dim)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> Indonesia</div>
                    </div>
                    <div style={{ lineHeight: '1.8', color: 'var(--color-text-dim)' }}>
                        <h3 style={{ color: 'var(--color-white)', marginBottom: '16px' }}>About the Event</h3>
                        <p>{event.description}</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '32px', position: 'sticky', top: '100px' }}>
                    {mintState === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <CheckCircle size={64} color="var(--color-cyan)" style={{ margin: '0 auto 24px', filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))' }} />
                            <h2 style={{ marginBottom: '12px' }}>Minting Successful!</h2>
                            <p className="text-dim" style={{ marginBottom: '24px' }}>Your NFT ticket is now in your wallet.</p>
                            <div style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid var(--color-cyan)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>Token ID</div>
                                <div className="text-cyan" style={{ fontFamily: 'monospace', fontSize: '14px' }}>#{mintResult?.tokenId}</div>
                            </div>
                            <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/dashboard')}>View in Dashboard</button>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ marginBottom: '24px' }}>Mint Ticket</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? '#10b981' : '#ef4444', boxShadow: `0 0 5px ${isConnected ? '#10b981' : '#ef4444'}` }}></div>
                                    <span className="text-dim">Wallet</span>
                                </div>
                                <span style={{ fontFamily: 'monospace' }}>{isConnected ? walletAddress.slice(0, 8) + '...' : 'Not connected'}</span>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span className="text-dim">Quantity (Max 2)</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '12px', color: 'var(--color-white)' }}><Minus size={16} /></button>
                                    <div style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>{quantity}</div>
                                    <button onClick={() => setQuantity(Math.min(2, quantity + 1))} style={{ padding: '12px', color: 'var(--color-white)' }}><Plus size={16} /></button>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span className="text-dim">Price per ticket</span><span>{formatPrice(event.originalPrice)}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span className="text-dim" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Available <Info size={12} /></span><span>{event.availableTickets} left</span></div>
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '12px 0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}><span>Total</span><span className="text-cyan">{formatPrice(event.originalPrice * quantity)}</span></div>
                            </div>

                            {error && <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}

                            <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }} onClick={handleMint} disabled={mintState === 'minting' || event.availableTickets === 0}>
                                {mintState === 'minting' ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '16px', height: '16px', border: '2px solid var(--color-navy)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        Minting Transaction...
                                    </div>
                                ) : !isConnected ? 'Connect Wallet to Mint' : event.availableTickets === 0 ? 'Sold Out' : 'Mint Ticket as NFT'}
                            </button>
                        </>
                    )}
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default TicketDetail;
