<?php

namespace App\Http\Controllers;

use App\Models\Patisserie; // On importe notre modèle
use Illuminate\Http\Request;

class PatisserieController extends Controller
{
    // Cette méthode va retourner toutes les pâtisseries
    public function index()
    {
        // On récupère tout ce qu'il y a dans la table 'patisseries'
        $patisseries = Patisserie::all();
        
        // On envoie le résultat en format JSON
        return response()->json($patisseries);
    }
}