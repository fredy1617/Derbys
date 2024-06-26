<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roosters', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ring');
            $table->integer('weight');
            $table->foreignId('match_id')
                ->constrained('matchs')
                ->onDelete('cascade') // Eliminación en cascada al borrar 
                ->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roosters');
    }
};
