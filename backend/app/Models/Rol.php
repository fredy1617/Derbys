<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;
    use HasFactory;

    protected $fillable = [
        'derby_id',
        'ronda',
        'gallo1_id',
        'gallo2_id',
        'condicion',
    ];

    public function gallo1()
    {
        return $this->belongsTo(Roosters::class, 'gallo1_id');
    }

    public function gallo2()
    {
        return $this->belongsTo(Roosters::class, 'gallo2_id');
    }

    public function derby()
    {
        return $this->belongsTo(Derbys::class, 'derby_id');
    }
}
