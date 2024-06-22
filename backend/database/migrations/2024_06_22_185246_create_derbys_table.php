<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('derbys', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('date');
            $table->decimal('money', 10, 2);
            $table->integer('no_roosters');
            $table->integer('tolerance');
            $table->integer('min_weight');
            $table->integer('max_weight');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('derbys');
    }
};
