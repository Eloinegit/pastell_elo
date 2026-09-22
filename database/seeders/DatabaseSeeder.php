<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // On appelle le seeder qui contient nos 12 pâtisseries
        $this->call([
            PatisserieSeeder::class,
        ]);
    }
}