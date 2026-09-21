<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/api/patisseries', [App\Http\Controllers\PatisserieController::class, 'index']);