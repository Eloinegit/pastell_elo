<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PatisserieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Patisserie::insert([
            // --- Éclairs & Macarons ---
            [
                'nom' => 'Chocolate Eclair',
                'description' => 'Crispy choux pastry filled with rich dark chocolate custard.',
                'prix' => 4.50,
                'categorie' => 'Eclairs',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Rose Macaron',
                'description' => 'Delicate almond meringue with raspberry and rose filling.',
                'prix' => 2.50,
                'categorie' => 'Macarons',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Pistachio Macaron',
                'description' => 'Light and nutty macaron with premium pistachio cream.',
                'prix' => 2.50,
                'categorie' => 'Macarons',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // --- Tarts & Pies ---
            [
                'nom' => 'Strawberry Tart',
                'description' => 'Buttery shortcrust pastry, almond cream, and fresh strawberries.',
                'prix' => 5.00,
                'categorie' => 'Tarts',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Lemon Meringue Pie',
                'description' => 'Zesty lemon curd topped with fluffy toasted meringue.',
                'prix' => 5.50,
                'categorie' => 'Tarts',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // --- Viennoiseries (Breakfast) ---
            [
                'nom' => 'Butter Croissant',
                'description' => 'Flaky, golden, and made with 100% French butter.',
                'prix' => 2.80,
                'categorie' => 'Viennoiseries',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Pain au Chocolat',
                'description' => 'Warm, flaky pastry filled with two sticks of dark chocolate.',
                'prix' => 3.00,
                'categorie' => 'Viennoiseries',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Almond Brioche',
                'description' => 'Soft, sweet brioche bread topped with crunchy sliced almonds.',
                'prix' => 3.20,
                'categorie' => 'Viennoiseries',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // --- Cakes & Cupcakes ---
            [
                'nom' => 'Vanilla Cupcake',
                'description' => 'Moist vanilla sponge topped with silky buttercream frosting.',
                'prix' => 3.50,
                'categorie' => 'Cupcakes',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Red Velvet Cake',
                'description' => 'Classic red velvet slice with tangy cream cheese frosting.',
                'prix' => 6.00,
                'categorie' => 'Cakes',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Chocolate Lava Cake',
                'description' => 'Warm chocolate cake with a gooey, molten center.',
                'prix' => 5.50,
                'categorie' => 'Cakes',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Carrot Cake',
                'description' => 'Spiced carrot cake with walnuts and cream cheese icing.',
                'prix' => 4.80,
                'categorie' => 'Cakes',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}