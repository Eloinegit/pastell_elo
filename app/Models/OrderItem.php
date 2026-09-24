<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    // On autorise ces colonnes à être remplies
    protected $fillable = [
        'order_id',
        'patisserie_id',
        'quantity',
        'price'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function patisserie()
    {
        return $this->belongsTo(Patisserie::class);
    }
}