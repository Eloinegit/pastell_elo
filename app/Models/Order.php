<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // On autorise la modification de ces colonnes
    protected $fillable = [
        'customer_name',
        'customer_email',
        'delivery_address',
        'total_price',
        'status',
        'user_id' // <-- NOUVEAU : On autorise l'enregistrement de l'ID utilisateur
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}