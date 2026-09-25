<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatisserieController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;

// --- ROUTES PUBLIQUES (Site client) ---
Route::get('/', function () { return view('welcome'); });
Route::get('/api/patisseries', [PatisserieController::class, 'index']);
Route::post('/api/orders', [OrderController::class, 'store']);

// NOUVEAU : Endpoint pour savoir qui est connecté
Route::get('/api/user', function () {
    return response()->json(Auth::user());
});

// --- ROUTES D'AUTHENTIFICATION ---
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/account', [AuthController::class, 'account'])->name('account')->middleware('auth');

// --- ROUTES ADMIN (Connexion publique) ---
Route::get('/admin/login', [AdminController::class, 'loginForm'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login']);
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');

// --- ROUTES ADMIN (Protégées) ---
Route::middleware('admin')->group(function () {
    Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::patch('/admin/orders/{id}/status', [AdminController::class, 'updateOrderStatus'])->name('admin.orders.status');
    Route::post('/admin/patisseries', [AdminController::class, 'storePatisserie'])->name('admin.patisseries.store');
    Route::put('/admin/patisseries/{id}', [AdminController::class, 'updatePatisserie'])->name('admin.patisseries.update');
    Route::delete('/admin/patisseries/{id}', [AdminController::class, 'destroyPatisserie'])->name('admin.patisseries.destroy');
});