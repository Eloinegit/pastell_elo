<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatisserieController;
use App\Http\Controllers\OrderController;

// 1. La page principale qui charge React
Route::get('/', function () {
    return view('welcome');
});

// 2. La route pour récupérer les produits (GET)
Route::get('/api/patisseries', [PatisserieController::class, 'index']);

// 3. La route pour enregistrer la commande (POST)
Route::post('/api/orders', [OrderController::class, 'store']);