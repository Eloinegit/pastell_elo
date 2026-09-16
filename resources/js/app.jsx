//import './bootstrap'; //
import React from 'react';
import { createRoot } from 'react-dom/client';

//console.log("🚀 LE FICHIER APP.JSX EST BIEN CHARGÉ !"); // <-- AJOUTE CETTE LIGNE

function App() {
    return (
        <div style={{ padding: '50px', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h1 style={{ color: '#d4a373' }}>🧁 Pastell'Elo</h1>
            <p>Bienvenue dans votre e-commerce pâtisserie !</p>
        </div>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error("❌ Impossible de trouver l'élément avec l'id 'app'");
}//