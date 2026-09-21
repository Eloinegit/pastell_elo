<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patisseries', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->decimal('prix', 8, 2); 
            $table->string('image')->nullable(); 
            $table->string('categorie')->default('Gâteau');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patisseries');
    }
};