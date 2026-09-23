import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    const [patisseries, setPatisseries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All'); // Nouvel état pour le filtre

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

    // Récupérer les catégories uniques depuis la base de données
    const categories = ['All', ...new Set(patisseries.map(p => p.categorie))];

    // Filtrer les produits selon la catégorie sélectionnée
    const filteredPatisseries = selectedCategory === 'All' 
        ? patisseries 
        : patisseries.filter(p => p.categorie === selectedCategory);

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
            </header>

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <h2 style={styles.heroTitle}>Artisanal Bakery & Pastries</h2>
                    <p style={styles.heroSubtitle}>Freshly baked with love, delivered to your door.</p>
                    <button style={styles.heroBtn}>SHOP NOW</button>
                </div>
            </section>

            {/* Products Grid */}
            <section style={styles.productsSection}>
                <h2 style={styles.sectionTitle}>Our Best Sellers</h2>
                
                {/* NOUVEAU : Les boutons de filtre */}
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

                {/* Grille des produits filtrés */}
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
                                <button style={styles.addBtn}>ADD TO CART</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <p>© 2026 Pastell'Elo. All rights reserved.</p>
            </footer>
        </div>
    );
}

function getEmoji(categorie) {
    const emojis = {
        'Eclairs': '🥐',
        'Tarts': '',
        'Macarons': '',
        'Cakes': '🎂',
        'Cupcakes': '🧁',
        'Viennoiseries': '🥐',
    };
    return emojis[categorie] || '🍰';
}

// --- STYLES ---
const styles = {
    container: { fontFamily: "'Poppins', sans-serif", backgroundColor: '#ffffff', color: '#333333', minHeight: '100vh' },
    loading: { padding: '100px', textAlign: 'center', fontSize: '20px', color: '#d4a373', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
    
    header: { backgroundColor: '#ffffff', padding: '40px 20px 20px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' },
    logo: { fontFamily: "'Playfair Display', cursive", fontSize: '64px', fontStyle: 'italic', margin: '0 0 20px 0', color: '#222222', fontWeight: '400' },
    nav: { display: 'flex', justifyContent: 'center', gap: '40px', paddingBottom: '10px' },
    navLink: { textDecoration: 'none', color: '#555555', fontWeight: '400', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.3s' },
    
    hero: { backgroundColor: '#ffffff', padding: '100px 20px', textAlign: 'center' },
    heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: '48px', marginBottom: '15px', color: '#222222', fontWeight: '400' },
    heroSubtitle: { fontSize: '18px', color: '#777777', marginBottom: '30px', fontWeight: '300' },
    heroBtn: { backgroundColor: '#222222', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '0px', fontSize: '13px', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' },
    
    productsSection: { maxWidth: '1200px', margin: '80px auto', padding: '0 20px' },
    sectionTitle: { fontFamily: "'Playfair Display', serif", textAlign: 'center', fontSize: '36px', marginBottom: '30px', color: '#222222', fontWeight: '400' },
    
    // NOUVEAUX STYLES POUR LES FILTRES
    filterContainer: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' },
    filterBtn: { 
        padding: '10px 25px', 
        border: '1px solid #e0e0e0', 
        backgroundColor: 'transparent', 
        color: '#777', 
        borderRadius: '30px', 
        cursor: 'pointer', 
        fontSize: '12px', 
        letterSpacing: '1.5px', 
        textTransform: 'uppercase', 
        transition: 'all 0.3s',
        fontFamily: "'Poppins', sans-serif"
    },
    filterBtnActive: { 
        backgroundColor: '#222222', 
        color: '#ffffff', 
        borderColor: '#222222' 
    },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' },
    
    card: { backgroundColor: '#ffffff', borderRadius: '0px', overflow: 'hidden', border: '1px solid #f0f0f0', transition: 'all 0.3s' },
    cardImage: { height: '280px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: '90px', opacity: 0.8 },
    cardBody: { padding: '25px', textAlign: 'center' },
    cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: '20px', margin: '0 0 10px 0', color: '#222222', fontWeight: '400' },
    cardPrice: { fontSize: '16px', color: '#555555', fontWeight: '400', marginBottom: '20px', letterSpacing: '1px' },
    addBtn: { backgroundColor: 'transparent', color: '#222222', border: '1px solid #222222', padding: '10px 25px', borderRadius: '0px', fontSize: '11px', fontWeight: '500', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' },
    
    footer: { backgroundColor: '#ffffff', color: '#999999', textAlign: 'center', padding: '40px 20px', fontSize: '13px', borderTop: '1px solid #f0f0f0', letterSpacing: '1px' }
};

// Effets de survol
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .navLink:hover { color: #000000; }
    .heroBtn:hover { background-color: #444444; }
    .card:hover { border-color: #222; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .addBtn:hover { background-color: #222222; color: white; }
    .filterBtn:hover { border-color: #222; color: #222; }
`;
document.head.appendChild(styleSheet);

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}