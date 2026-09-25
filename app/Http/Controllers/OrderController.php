<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'delivery_address' => 'required|string',
            'cart' => 'required|array|min:1',
            'total' => 'required|numeric'
        ]);

        $order = Order::create([
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'delivery_address' => $validated['delivery_address'],
            'total_price' => $validated['total'],
            'status' => 'pending',
            'user_id' => Auth::id() // Lie la commande à l'utilisateur connecté (ou null si guest)
        ]);

        foreach ($validated['cart'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'patisserie_id' => $item['id'],
                'quantity' => $item['quantity'],
                'price' => $item['prix']
            ]);
        }

        return response()->json([
            'message' => 'Order placed successfully!',
            'order_id' => $order->id
        ], 201);
    }
}