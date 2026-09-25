<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Patisserie;

class AdminController extends Controller
{
    // --- AUTHENTIFICATION ---
    public function loginForm() { return view('admin.login'); }
    public function login(Request $request) {
        $request->validate(['password' => 'required']);
        if ($request->password === 'admin123') {
            session(['admin_logged_in' => true]);
            return redirect('/admin');
        }
        return back()->withErrors(['password' => 'Mot de passe incorrect']);
    }
    public function logout() {
        session()->forget('admin_logged_in');
        return redirect('/admin/login');
    }

    // --- DASHBOARD ---
    public function dashboard() {
        $orders = Order::with('items.patisserie')->latest()->get();
        $patisseries = Patisserie::all();
        return view('admin.dashboard', compact('orders', 'patisseries'));
    }

    // --- GESTION DES COMMANDES ---
    public function updateOrderStatus(Request $request, $id) {
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);
        return back()->with('success', 'Statut de la commande mis à jour !');
    }

    // --- GESTION DES PÂTISSERIES (CRUD) ---
    
    // 1. Créer (Create)
    public function storePatisserie(Request $request) {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric',
            'categorie' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $data = $request->except('image');
        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images/patisseries'), $imageName);
            $data['image'] = 'images/patisseries/' . $imageName;
        }
        Patisserie::create($data);
        return back()->with('success', 'Pâtisserie ajoutée avec succès !');
    }

    // 2. Modifier (Update) - NOUVEAU
    public function updatePatisserie(Request $request, $id) {
        $patisserie = Patisserie::findOrFail($id);

        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric',
            'categorie' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $data = $request->except('image');

        // Si une nouvelle image est uploadée, on supprime l'ancienne
        if ($request->hasFile('image')) {
            if ($patisserie->image && file_exists(public_path($patisserie->image))) {
                unlink(public_path($patisserie->image));
            }
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images/patisseries'), $imageName);
            $data['image'] = 'images/patisseries/' . $imageName;
        }

        $patisserie->update($data);
        return back()->with('success', 'Pâtisserie modifiée avec succès !');
    }

    // 3. Supprimer (Delete)
    public function destroyPatisserie($id) {
        $patisserie = Patisserie::findOrFail($id);
        if ($patisserie->image && file_exists(public_path($patisserie->image))) {
            unlink(public_path($patisserie->image));
        }
        $patisserie->delete();
        return back()->with('success', 'Pâtisserie supprimée.');
    }
}