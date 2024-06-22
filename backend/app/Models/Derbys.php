<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Derbys extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'date', 'money', 'no_roosters', 'tolerance', 'min_weight', 'max_weight'
    ];
}
