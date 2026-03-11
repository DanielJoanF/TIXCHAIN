import React, { useState } from 'react';
import { ShieldCheck, Filter, ArrowRightLeft, Search, CheckCircle } from 'lucide-react';

const MOCK_LISTINGS = [
    { id: '1043', event: 'Crypto Music Festival 2026', type: 'VIP', seller: '0xabc...def', originalPriceIdr: 'Rp 650.000', listPriceIdr: 'Rp 715.000', listPriceEth: '0.0165 ETH', maxPriceIdr: 'Rp 715.000' },
    { id: '89', event: 'Web3 Builder Summit', type: 'General', seller: '0x942...bca', originalPriceIdr: 'Rp 1.500.000', listPriceIdr: 'Rp 1.600.000', listPriceEth: '0.037 ETH', maxPriceIdr: 'Rp 1.650.000' }
];

const ListingCard = ({ listing }) => {
    const [buyState, setBuyState] = useState('idle');

    const handleBuy = () => {
        setBuyState('escrow');
        setTimeout(() => setBuyState('success'), 2500);
    };

    return (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>

            {/* Event Info */}
            <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '20px', margin: 0 }}>{listing.event}</h3>
                    <span style={{ fontSize: '12px', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>{listing.type}</span>
                </div>
                <p className="text-dim" style={{ fontSize: '14px', fontFamily: 'monospace' }}>Seller: {listing.seller} | Token #{listing.id}</p>
            </div>

            {/* Price Details */}
            <div style={{ flex: '1 1 200px', padding: '0 24px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontWeight: 'bold', fontSize: '24px', color: 'var(--color-cyan)', marginBottom: '4px' }}>{listing.listPriceIdr}</div>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>{listing.listPriceEth}</div>

                <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    Max price: 110% of original ({listing.maxPriceIdr})
                </div>
            </div>

            {/* CTA */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {buyState === 'success' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '12px 24px', borderRadius: '8px', justifyContent: 'center' }}>
                        <CheckCircle size={20} /> Transferred
                    </div>
                ) : (
                    <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        onClick={handleBuy}
                        disabled={buyState === 'escrow'}
                    >
                        {buyState === 'escrow' ? 'Escrow Loading...' : 'Buy via Escrow'}
                    </button>
                )}

                <div style={{ fontSize: '12px', color: 'var(--color-text-dim)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <ArrowRightLeft size={12} /> Funds held in smart contract until transfer
                </div>
            </div>
        </div>
    );
};

const SecondaryMarket = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>

            {/* Header & Trust Badge */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ marginBottom: '8px' }}>Secondary Marketplace</h1>
                    <p className="text-dim">Buy and sell tickets securely, verified on the blockchain.</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0, 212, 255, 0.05)', padding: '12px 24px', borderRadius: '30px', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                    <ShieldCheck size={24} className="text-cyan" />
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--color-cyan)' }}>Protected by Smart Contract</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-dim)' }}>Zero counterparty risk & price capped</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', background: 'var(--color-surface)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Search size={18} className="text-dim" style={{ marginRight: '12px' }} />
                    <input type="text" placeholder="Search events or token IDs..." style={{ background: 'transparent', border: 'none', color: 'var(--color-white)', outline: 'none', width: '100%' }} />
                </div>

                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={18} /> Filter Price
                </button>
            </div>

            {/* Listings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {MOCK_LISTINGS.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>
        </div>
    );
};

export default SecondaryMarket;
