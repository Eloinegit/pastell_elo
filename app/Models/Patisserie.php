<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patisserie extends Model
{
    use HasFactory;

    // On autorise la modification de ces colonnes
    protected $fillable = [
        'nom',
        'description',
        'prix',
        'categorie',
        'image'
    ];
}