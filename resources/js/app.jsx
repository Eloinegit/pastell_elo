import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    const [patisseries, setPatisseries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [detailQty, setDetailQty] = useState(1);
    
    // NOUVEAU : État pour l'utilisateur connecté
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Charger les produits
        fetch('/api/patisseries')
            .then(response => response.json())
            .then(data => {
                setPatisseries(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });

        // NOUVEAU : Charger l'utilisateur connecté
        fetch('/api/user', { credentials: 'same-origin' })
            .then(response => response.json())
            .then(data => {
                if (data) setCurrentUser(data);
            })
            .catch(error => console.error('Error fetching user:', error));
    }, []);

    const categories = ['All', ...new Set(patisseries.map(p => p.categorie))];

    const filteredPatisseries = patisseries.filter(p => {
        const matchCategory = selectedCategory === 'All' || p.categorie === selectedCategory;
        const matchSearch = p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const addToCart = (product, qty = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
            }
            return [...prevCart, { ...product, quantity: qty }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            setCart(prevCart => prevCart.filter(item => item.id !== productId));
            return;
        }
        setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    };

    const cartTotal = cart.reduce((total, item) => total + (item.prix * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const goToCheckout = () => {
        setIsCartOpen(false);
        setCurrentPage('checkout');
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const formData = new FormData(e.target);
        const orderData = {
            customer_name: formData.get('name'),
            customer_email: formData.get('email'),
            delivery_address: formData.get('address'),
            cart: cart,
            total: cartTotal
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                setOrderPlaced(true);
                setCart([]);
                setCurrentPage('home');
                window.scrollTo(0, 0);
            } else {
                alert("Erreur lors de la commande.");
            }
        } catch (error) {
            console.error('Network error:', error);
            alert("Erreur de connexion.");
        }
    };

    const viewProductDetails = (product) => {
        setSelectedProduct(product);
        setDetailQty(1);
        window.scrollTo(0, 0);
    };

    const backToShop = () => {
        setSelectedProduct(null);
    };

    const addToCartFromDetail = () => {
        addToCart(selectedProduct, detailQty);
        backToShop();
    };

    if (loading) return <div style={styles.loading}>Loading sweetness...</div>;

    // --- VUE DÉTAIL PRODUIT ---
    if (selectedProduct) {
        return (
            <div style={styles.container}>
                <Header currentUser={currentUser} cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} onLogoClick={() => { backToShop(); setCurrentPage('home'); }} />
                <section style={styles.detailSection}>
                    <button style={styles.backBtn} onClick={backToShop}>← Back to Shop</button>
                    <div style={styles.detailGrid}>
                        <div style={styles.detailImageContainer}>
                            {selectedProduct.image ? (
                                <img src={`/${selectedProduct.image}`} alt={selectedProduct.nom} style={styles.detailImg} />
                            ) : (
                                <div style={styles.detailEmojiFallback}><span style={styles.detailEmoji}>{getEmoji(selectedProduct.categorie)}</span></div>
                            )}
                        </div>
                        <div style={styles.detailInfo}>
                            <span style={styles.detailCategory}>{selectedProduct.categorie}</span>
                            <h1 style={styles.detailTitle}>{selectedProduct.nom}</h1>
                            <p style={styles.detailPrice}>${selectedProduct.prix}</p>
                            <p style={styles.detailDescription}>{selectedProduct.description}</p>
                            <div style={styles.detailActions}>
                                <div style={styles.qtySelector}>
                                    <button style={styles.qtyBtn} onClick={() => setDetailQty(Math.max(1, detailQty - 1))}>-</button>
                                    <span style={styles.qtyText}>{detailQty}</span>
                                    <button style={styles.qtyBtn} onClick={() => setDetailQty(detailQty + 1)}>+</button>
                                </div>
                                <button style={styles.addBtnLarge} onClick={addToCartFromDetail}>ADD TO CART</button>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // --- VUE CHECKOUT ---
    if (currentPage === 'checkout') {
        return (
            <div style={styles.container}>
                <Header currentUser={currentUser} cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} onLogoClick={() => setCurrentPage('home')} />
                <section style={styles.checkoutSection}>
                    <h2 style={styles.sectionTitle}>Checkout</h2>
                    <div style={styles.checkoutGrid}>
                        <form onSubmit={handlePlaceOrder} style={styles.checkoutForm}>
                            <h3 style={styles.formTitle}>Delivery Details</h3>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Full Name</label>
                                {/* NOUVEAU : Pré-remplir si connecté */}
                                <input type="text" name="name" required style={styles.input} placeholder="John Doe" defaultValue={currentUser ? currentUser.name : ''} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email Address</label>
                                <input type="email" name="email" required style={styles.input} placeholder="john@example.com" defaultValue={currentUser ? currentUser.email : ''} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Delivery Address</label>
                                <input type="text" name="address" required style={styles.input} placeholder="123 Baker Street" />
                            </div>
                            <button type="submit" style={styles.placeOrderBtn}>PLACE ORDER</button>
                        </form>
                        <div style={styles.orderSummary}>
                            <h3 style={styles.formTitle}>Order Summary</h3>
                            {cart.map(item => (
                                <div key={item.id} style={styles.summaryItem}>
                                    <div style={{flex: 1}}>
                                        <p style={styles.summaryName}>{item.nom} <span style={{color: '#999', fontSize: '12px'}}>x{item.quantity}</span></p>
                                    </div>
                                    <p style={styles.summaryPrice}>${(item.prix * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                            <div style={styles.summaryTotal}>
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    // --- VUE SUCCÈS ---
    if (orderPlaced) {
        return (
            <div style={styles.container}>
                <Header currentUser={currentUser} cartCount={0} onCartClick={() => setIsCartOpen(true)} onLogoClick={() => setCurrentPage('home')} />
                <section style={styles.successSection}>
                    <h1 style={styles.successTitle}>Thank you for your order!</h1>
                    <p style={styles.successText}>Your delicious pastries are being prepared with love.</p>
                    <button style={styles.heroBtn} onClick={() => setOrderPlaced(false)}>CONTINUE SHOPPING</button>
                </section>
                <Footer />
            </div>
        );
    }

    // --- VUE ACCUEIL (SHOP) ---
    return (
        <div style={styles.container}>
            <Header currentUser={currentUser} cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} onLogoClick={() => setCurrentPage('home')} />
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <h2 style={styles.heroTitle}>Artisanal Bakery & Pastries</h2>
                    <p style={styles.heroSubtitle}>Freshly baked with love, delivered to your door.</p>
                    <button style={styles.heroBtn} onClick={() => document.getElementById('shop').scrollIntoView({behavior: 'smooth'})}>SHOP NOW</button>
                </div>
            </section>
            <section id="shop" style={styles.productsSection}>
                <h2 style={styles.sectionTitle}>Our Best Sellers</h2>
                <div style={styles.searchContainer}>
                    <input type="text" placeholder="Search for pastries..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />
                </div>
                <div style={styles.filterContainer}>
                    {categories.map(category => (
                        <button key={category} onClick={() => setSelectedCategory(category)} style={{...styles.filterBtn, ...(selectedCategory === category ? styles.filterBtnActive : {})}}>{category}</button>
                    ))}
                </div>
                {filteredPatisseries.length === 0 && <div style={styles.noResults}><p>No pastries found.</p></div>}
                <div style={styles.grid}>
                    {filteredPatisseries.map(patisserie => (
                        <div key={patisserie.id} style={styles.card} onClick={() => viewProductDetails(patisserie)} className="product-card-clickable">
                            <div style={styles.cardImage}>
                                {patisserie.image ? (
                                    <img src={`/${patisserie.image}`} alt={patisserie.nom} style={styles.cardImg} />
                                ) : (
                                    <span style={styles.emoji}>{getEmoji(patisserie.categorie)}</span>
                                )}
                            </div>
                            <div style={styles.cardBody}>
                                <h3 style={styles.cardTitle}>{patisserie.nom}</h3>
                                <p style={styles.cardDescription}>{patisserie.description}</p>
                                <p style={styles.cardPrice}>${patisserie.prix}</p>
                                <button style={styles.addBtn} onClick={(e) => { e.stopPropagation(); addToCart(patisserie); }}>ADD TO CART</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
            {isCartOpen && (
                <>
                    <div style={styles.overlay} onClick={() => setIsCartOpen(false)}></div>
                    <div style={styles.cartSidebar}>
                        <div style={styles.cartHeader}>
                            <h2 style={styles.cartTitle}>Your Cart</h2>
                            <button style={styles.closeBtn} onClick={() => setIsCartOpen(false)}>×</button>
                        </div>
                        <div style={styles.cartItems}>
                            {cart.length === 0 ? <p style={styles.emptyCart}>Your cart is empty.</p> : cart.map(item => (
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
                            ))}
                        </div>
                        {cart.length > 0 && (
                            <div style={styles.cartFooter}>
                                <div style={styles.totalRow}><span>Total</span><span style={styles.totalPrice}>${cartTotal.toFixed(2)}</span></div>
                                <button style={styles.checkoutBtn} onClick={goToCheckout}>CHECKOUT</button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// --- HEADER MODIFIÉ : Affiche My Account / Logout si connecté ---
function Header({ currentUser, cartCount, onCartClick, onLogoClick }) {
    return (
        <header style={styles.header}>
            <h1 style={styles.logo} onClick={onLogoClick} className="clickable-logo">Pastell'Elo</h1>
            <nav style={styles.nav}>
                <a href="/" style={styles.navLink}>HOME</a>
                <a href="/#shop" style={styles.navLink}>SHOP</a>
                {currentUser ? (
                    <>
                        <a href="/account" style={styles.navLink}>MY ACCOUNT</a>
                        <form method="POST" action="/logout" style={{ display: 'inline' }}>
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
                            <button type="submit" style={{...styles.navLink, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit'}}>LOGOUT</button>
                        </form>
                    </>
                ) : (
                    <>
                        <a href="/login" style={styles.navLink}>LOGIN</a>
                        <a href="/register" style={styles.navLink}>REGISTER</a>
                    </>
                )}
            </nav>
            <button style={styles.cartBtn} onClick={onCartClick}>CART ({cartCount})</button>
        </header>
    );
}

function Footer() {
    return <footer style={styles.footer}><p>© 2026 Pastell'Elo. All rights reserved.</p></footer>;
}

function getEmoji(categorie) {
    const emojis = { 'Eclairs': '', 'Tarts': '', 'Macarons': '🧁', 'Cakes': '', 'Cupcakes': '🧁', 'Viennoiseries': '🥐' };
    return emojis[categorie] || '🍰';
}

const styles = {
    container: { fontFamily: "'Poppins', sans-serif", backgroundColor: '#ffffff', color: '#333333', minHeight: '100vh', position: 'relative' },
    loading: { padding: '100px', textAlign: 'center', fontSize: '20px', color: '#d4a373', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
    header: { backgroundColor: '#ffffff', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' },
    logo: { fontFamily: "'Playfair Display', cursive", fontSize: '32px', fontStyle: 'italic', margin: 0, color: '#222222', fontWeight: '400', cursor: 'pointer' },
    nav: { display: 'flex', gap: '30px', alignItems: 'center' },
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
    card: { backgroundColor: '#ffffff', overflow: 'hidden', border: '1px solid #f0f0f0', transition: 'all 0.3s', cursor: 'pointer' },
    cardImage: { height: '250px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    cardImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
    emoji: { fontSize: '80px', opacity: 0.8 },
    cardBody: { padding: '25px', textAlign: 'center' },
    cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: '20px', margin: '0 0 10px 0', color: '#222222', fontWeight: '400' },
    cardDescription: { fontSize: '13px', color: '#777', marginBottom: '15px', lineHeight: '1.5' },
    cardPrice: { fontSize: '16px', color: '#555555', fontWeight: '400', marginBottom: '20px', letterSpacing: '1px' },
    addBtn: { backgroundColor: 'transparent', color: '#222222', border: '1px solid #222222', padding: '10px 25px', fontSize: '11px', fontWeight: '500', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' },
    footer: { backgroundColor: '#ffffff', color: '#999999', textAlign: 'center', padding: '40px 20px', fontSize: '13px', borderTop: '1px solid #f0f0f0', letterSpacing: '1px' },
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
    cartSidebar: { position: 'fixed', top: 0, right: 0, width: '400px', height: '100%', backgroundColor: '#fff', zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' },
    cartHeader: { padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cartTitle: { fontFamily: "'Playfair Display', serif", fontSize: '24px', margin: 0, fontWeight: '400' },
    closeBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#222' },
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
    checkoutBtn: { width: '100%', backgroundColor: '#222222', color: 'white', border: 'none', padding: '15px', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' },
    checkoutSection: { maxWidth: '1000px', margin: '60px auto', padding: '0 20px' },
    checkoutGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px' },
    checkoutForm: { display: 'flex', flexDirection: 'column', gap: '20px' },
    formTitle: { fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '20px', fontWeight: '400', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '12px', color: '#777', letterSpacing: '1px', textTransform: 'uppercase' },
    input: { padding: '15px', border: '1px solid #e0e0e0', fontSize: '14px', fontFamily: "'Poppins', sans-serif", outline: 'none' },
    placeOrderBtn: { backgroundColor: '#222222', color: 'white', border: 'none', padding: '18px', fontSize: '13px', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', marginTop: '10px' },
    orderSummary: { backgroundColor: '#f9f9f9', padding: '30px' },
    summaryItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' },
    summaryName: { margin: 0 },
    summaryPrice: { margin: 0, fontWeight: '500' },
    summaryTotal: { display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0', fontSize: '18px', fontWeight: '600' },
    successSection: { textAlign: 'center', padding: '100px 20px' },
    successTitle: { fontFamily: "'Playfair Display', serif", fontSize: '48px', marginBottom: '20px', fontWeight: '400' },
    successText: { fontSize: '18px', color: '#777', marginBottom: '40px' },
    detailSection: { maxWidth: '1100px', margin: '60px auto', padding: '0 20px' },
    backBtn: { background: 'none', border: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#777', cursor: 'pointer', marginBottom: '40px', letterSpacing: '1px' },
    detailGrid: { display: 'flex', gap: '60px', flexWrap: 'wrap' },
    detailImageContainer: { flex: '1', minWidth: '300px', backgroundColor: '#f9f9f9', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    detailImg: { width: '100%', height: '100%', objectFit: 'cover' },
    detailEmojiFallback: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
    detailEmoji: { fontSize: '150px', opacity: 0.8 },
    detailInfo: { flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    detailCategory: { fontSize: '12px', color: '#999', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' },
    detailTitle: { fontFamily: "'Playfair Display', serif", fontSize: '42px', fontWeight: '400', color: '#222', margin: '0 0 20px 0', lineHeight: '1.2' },
    detailPrice: { fontSize: '24px', color: '#555', marginBottom: '30px', fontWeight: '400' },
    detailDescription: { fontSize: '16px', color: '#666', lineHeight: '1.8', marginBottom: '40px' },
    detailActions: { display: 'flex', gap: '20px', alignItems: 'center' },
    qtySelector: { display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', padding: '5px 15px' },
    addBtnLarge: { backgroundColor: '#222222', color: 'white', border: 'none', padding: '15px 40px', fontSize: '13px', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .navLink:hover { color: #000000; }
    .heroBtn:hover, .placeOrderBtn:hover, .checkoutBtn:hover, .addBtnLarge:hover { background-color: #444444; }
    .product-card-clickable:hover { border-color: #222; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .product-card-clickable:hover img { transform: scale(1.05); }
    .addBtn:hover, .cartBtn:hover { background-color: #222222; color: white; }
    .filterBtn:hover { border-color: #222; color: #222; }
    .searchInput:focus, .input:focus { border-color: #222; }
    .clickable-logo:hover { opacity: 0.7; }
    .backBtn:hover { color: #222; }
`;
document.head.appendChild(styleSheet);

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}