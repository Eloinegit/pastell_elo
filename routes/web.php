<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatisserieController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;

// --- ROUTES PUBLIQUES (Site client) ---
Route::get('/', function () { return view('welcome'); });
Route::get('/api/patisseries', [PatisserieController::class, 'index']);
Route::post('/api/orders', [OrderController::class, 'store']);

// --- ROUTES ADMIN (Connexion publique) ---
Route::get('/admin/login', [AdminController::class, 'loginForm'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login']);
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');

// --- ROUTES ADMIN (Protégées) ---
Route::middleware('admin')->group(function () {
    Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::patch('/admin/orders/{id}/status', [AdminController::class, 'updateOrderStatus'])->name('admin.orders.status');
    
    // Gestion des pâtisseries (CRUD complet)
    Route::post('/admin/patisseries', [AdminController::class, 'storePatisserie'])->name('admin.patisseries.store');
    Route::put('/admin/patisseries/{id}', [AdminController::class, 'updatePatisserie'])->name('admin.patisseries.update'); // NOUVEAU
    Route::delete('/admin/patisseries/{id}', [AdminController::class, 'destroyPatisserie'])->name('admin.patisseries.destroy');
});