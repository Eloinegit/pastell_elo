import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    const [patisseries, setPatisseries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // NOUVEAUX ÉTATS POUR LE PANIER
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        fetch('/api/patisseries')
            .then(response => response.json())
            .then(data => {
                setPatisseries(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, []);

    const categories = ['All', ...new Set(patisseries.map(p => p.categorie))];

    const filteredPatisseries = patisseries.filter(p => {
        const matchCategory = selectedCategory === 'All' || p.categorie === selectedCategory;
        const matchSearch = p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    // --- LOGIQUE DU PANIER ---
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // Ouvre le panier quand on ajoute
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart => 
            prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
        );
    };

    const cartTotal = cart.reduce((total, item) => total + (item.prix * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    // -------------------------

    if (loading) {
        return <div style={styles.loading}>Loading sweetness...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.logo}>Pastell'Elo</h1>
                <nav style={styles.nav}>
                    <a href="#" style={styles.navLink}>HOME</a>
                    <a href="#" style={styles.navLink}>SHOP</a>
                    <a href="#" style={styles.navLink}>ABOUT</a>
                    <a href="#" style={styles.navLink}>CONTACT</a>
                </nav>
                {/* Bouton Panier dans le Header */}
                <button style={styles.cartBtn} onClick={() => setIsCartOpen(true)}>
                    CART ({cartCount})
                </button>
            </header>

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <h2 style={styles.heroTitle}>Artisanal Bakery & Pastries</h2>
                    <p style={styles.heroSubtitle}>Freshly baked with love, delivered to your door.</p>
                    <button style={styles.heroBtn}>SHOP NOW</button>
                </div>
            </section>

            {/* Products Section */}
            <section style={styles.productsSection}>
                <h2 style={styles.sectionTitle}>Our Best Sellers</h2>
                
                <div style={styles.searchContainer}>
                    <input 
                        type="text"
                        placeholder="Search for pastries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <div style={styles.filterContainer}>
                    {categories.map(category => (
                        <button 
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                ...styles.filterBtn,
                                ...(selectedCategory === category ? styles.filterBtnActive : {})
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredPatisseries.length === 0 && (
                    <div style={styles.noResults}>
                        <p>No pastries found. Try a different search!</p>
                    </div>
                )}

                <div style={styles.grid}>
                    {filteredPatisseries.map(patisserie => (
                        <div key={patisserie.id} style={styles.card}>
                            <div style={styles.cardImage}>
                                <span style={styles.emoji}>
                                    {getEmoji(patisserie.categorie)}
                                </span>
                            </div>
                            <div style={styles.cardBody}>
                                <h3 style={styles.cardTitle}>{patisserie.nom}</h3>
                                <p style={styles.cardPrice}>${patisserie.prix}</p>
                                <button style={styles.addBtn} onClick={() => addToCart(patisserie)}>ADD TO CART</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <p>© 2026 Pastell'Elo. All rights reserved.</p>
            </footer>

            {/* --- PANNEAU LATÉRAL DU PANIER (CART SIDEBAR) --- */}
            {isCartOpen && (
                <>
                    <div style={styles.overlay} onClick={() => setIsCartOpen(false)}></div>
                    <div style={styles.cartSidebar}>
                        <div style={styles.cartHeader}>
                            <h2 style={styles.cartTitle}>Your Cart</h2>
                            <button style={styles.closeBtn} onClick={() => setIsCartOpen(false)}></button>
                        </div>
                        
                        <div style={styles.cartItems}>
                            {cart.length === 0 ? (
                                <p style={styles.emptyCart}>Your cart is empty.</p>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} style={styles.cartItem}>
                                        <div style={styles.cartItemInfo}>
                                            <h4 style={styles.cartItemName}>{item.nom}</h4>
                                            <p style={styles.cartItemPrice}>${item.prix}</p>
                                        </div>
                                        <div style={styles.quantityControls}>
                                            <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span style={styles.qtyText}>{item.quantity}</span>
                                            <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div style={styles.cartFooter}>
                                <div style={styles.totalRow}>
                                    <span>Total</span>
                                    <span style={styles.totalPrice}>${cartTotal.toFixed(2)}</span>
                                </div>
                                <button style={styles.checkoutBtn}>CHECKOUT</button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function getEmoji(categorie) {
    const emojis = {
        'Eclairs': '🥐', 'Tarts': '🥧', 'Macarons': '🧁', 
        'Cakes': '🎂', 'Cupcakes': '🧁', 'Viennoiseries': '🥐',
    };
    return emojis[categorie] || '🍰';
}

// --- STYLES ---
const styles = {
    container: { fontFamily: "'Poppins', sans-serif", backgroundColor: '#ffffff', color: '#333333', minHeight: '100vh', position: 'relative' },
    loading: { padding: '100px', textAlign: 'center', fontSize: '20px', color: '#d4a373', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
    
    header: { backgroundColor: '#ffffff', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' },
    logo: { fontFamily: "'Playfair Display', cursive", fontSize: '32px', fontStyle: 'italic', margin: 0, color: '#222222', fontWeight: '400' },
    nav: { display: 'flex', gap: '30px' },
    navLink: { textDecoration: 'none', color: '#555555', fontWeight: '400', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.3s' },
    cartBtn: { background: 'none', border: '1px solid #222', padding: '10px 20px', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', fontWeight: '500' },
    
    hero: { backgroundColor: '#ffffff', padding: '80px 20px', textAlign: 'center' },
    heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: '48px', marginBottom: '15px', color: '#222222', fontWeight: '400' },
    heroSubtitle: { fontSize: '18px', color: '#777777', marginBottom: '30px', fontWeight: '300' },
    heroBtn: { backgroundColor: '#222222', color: 'white', border: 'none', padding: '15px 40px', fontSize: '13px', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' },
    
    productsSection: { maxWidth: '1200px', margin: '60px auto', padding: '0 20px' },
    sectionTitle: { fontFamily: "'Playfair Display', serif", textAlign: 'center', fontSize: '36px', marginBottom: '30px', color: '#222222', fontWeight: '400' },
    
    searchContainer: { maxWidth: '500px', margin: '0 auto 40px' },
    searchInput: { width: '100%', padding: '15px 20px', border: '1px solid #e0e0e0', fontSize: '14px', fontFamily: "'Poppins', sans-serif", outline: 'none' },
    
    filterContainer: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' },
    filterBtn: { padding: '10px 25px', border: '1px solid #e0e0e0', backgroundColor: 'transparent', color: '#777', borderRadius: '30px', cursor: 'pointer', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Poppins', sans-serif" },
    filterBtnActive: { backgroundColor: '#222222', color: '#ffffff', borderColor: '#222222' },

    noResults: { textAlign: 'center', padding: '60px 20px', color: '#999', fontSize: '16px' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' },
    card: { backgroundColor: '#ffffff', overflow: 'hidden', border: '1px solid #f0f0f0', transition: 'all 0.3s' },
    cardImage: { height: '250px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: '80px', opacity: 0.8 },
    cardBody: { padding: '25px', textAlign: 'center' },
    cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: '20px', margin: '0 0 10px 0', color: '#222222', fontWeight: '400' },
    cardPrice: { fontSize: '16px', color: '#555555', fontWeight: '400', marginBottom: '20px', letterSpacing: '1px' },
    addBtn: { backgroundColor: 'transparent', color: '#222222', border: '1px solid #222222', padding: '10px 25px', fontSize: '11px', fontWeight: '500', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' },
    
    footer: { backgroundColor: '#ffffff', color: '#999999', textAlign: 'center', padding: '40px 20px', fontSize: '13px', borderTop: '1px solid #f0f0f0', letterSpacing: '1px' },

    // --- STYLES DU PANIER ---
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
    cartSidebar: { position: 'fixed', top: 0, right: 0, width: '400px', height: '100%', backgroundColor: '#fff', zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' },
    cartHeader: { padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cartTitle: { fontFamily: "'Playfair Display', serif", fontSize: '24px', margin: 0, fontWeight: '400' },
    closeBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
    cartItems: { flex: 1, overflowY: 'auto', padding: '20px' },
    emptyCart: { textAlign: 'center', color: '#999', marginTop: '50px' },
    cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f9f9f9' },
    cartItemInfo: { flex: 1 },
    cartItemName: { fontFamily: "'Playfair Display', serif", fontSize: '16px', margin: '0 0 5px 0' },
    cartItemPrice: { fontSize: '14px', color: '#777', margin: 0 },
    quantityControls: { display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e0e0e0', padding: '5px 10px' },
    qtyBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '0 5px' },
    qtyText: { fontSize: '14px', minWidth: '20px', textAlign: 'center' },
    cartFooter: { padding: '20px', borderTop: '1px solid #f0f0f0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '20px', fontWeight: '500' },
    totalPrice: { fontFamily: "'Playfair Display', serif" },
    checkoutBtn: { width: '100%', backgroundColor: '#222222', color: 'white', border: 'none', padding: '15px', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }
};

// Effets de survol
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .navLink:hover { color: #000000; }
    .heroBtn:hover { background-color: #444444; }
    .card:hover { border-color: #222; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .addBtn:hover { background-color: #222222; color: white; }
    .filterBtn:hover { border-color: #222; color: #222; }
    .searchInput:focus { border-color: #222; }
    .cartBtn:hover { background-color: #222; color: white; }
    .checkoutBtn:hover { background-color: #444; }
`;
document.head.appendChild(styleSheet);

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}