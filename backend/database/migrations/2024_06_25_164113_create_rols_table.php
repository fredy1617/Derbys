<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rols', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('derby_id');
            $table->foreign('derby_id')->references('id')->on('derbys')->onDelete('cascade');
            $table->unsignedBigInteger('ronda')->nullable();
            $table->unsignedBigInteger('gallo1_id');
            $table->foreign('gallo1_id')->references('id')->on('roosters')->onDelete('cascade');
            $table->unsignedBigInteger('gallo2_id')->nullable();
            $table->foreign('gallo2_id')->references('id')->on('roosters')->onDelete('cascade');
            $table->string('condicion');
            $table->timestamps();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('rols');
    }
};
