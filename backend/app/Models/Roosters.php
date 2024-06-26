<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roosters extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'ring', 
        'weight', 
        'match_id'
    ];

    public function match()
    {
        return $this->belongsTo(Matchs::class, 'match_id');
    } 
}
