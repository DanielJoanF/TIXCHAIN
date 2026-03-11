import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Search, ShieldCheck, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/api';

const EventCard = ({ event }) => {
    const soldPercent = event.totalTickets > 0
        ? Math.round(((event.totalTickets - event.availableTickets) / event.totalTickets) * 100)
        : 0;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <Link to={`/event/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-panel" style={{ overflow: 'hidden', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(45deg, #101538, #1a2254)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0, 212, 255, 0.2)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-cyan)', fontSize: '12px', color: 'var(--color-cyan)', fontWeight: 'bold' }}>
                        <ShieldCheck size={14} /> Verified by TixChain
                    </div>
                </div>

                <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>{event.name}</h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-dim)', fontSize: '14px', marginBottom: '16px' }}>
                        <Calendar size={14} /> {formatDate(event.eventDate)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>Price</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--color-cyan)' }}>{formatPrice(event.originalPrice)}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '4px' }}>Available</div>
                            <div style={{ fontWeight: 'bold' }}>{event.availableTickets} / {event.totalTickets}</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                            <span className="text-dim">Tickets Sold</span>
                            <span className="text-cyan">{soldPercent}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${soldPercent}%`, background: 'var(--color-cyan)', boxShadow: '0 0 10px var(--color-cyan)', transition: 'width 0.5s ease' }}></div>
                        </div>
                    </div>

                    <button className="btn-primary" style={{ width: '100%' }}>View Details</button>
                </div>
            </div>
        </Link>
    );
};

const EventListing = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEvents()
            .then(data => { setEvents(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, []);

    const filtered = events.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1>Discover Events</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Search size={18} className="text-dim" style={{ marginRight: '8px' }} />
                        <input type="text" placeholder="Search events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--color-white)', outline: 'none' }} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                    <Loader size={32} className="text-cyan" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            ) : error ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: '#ef4444', marginBottom: '12px' }}>Failed to load events: {error}</p>
                    <button className="btn-outline" onClick={() => window.location.reload()}>Retry</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {filtered.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                    {filtered.length === 0 && <p className="text-dim">No events found.</p>}
                </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default EventListing;
