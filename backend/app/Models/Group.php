<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'derby_id'];

    public function matches()
    {
        return $this->belongsToMany(Matchs::class, 'group_matches', 'group_id', 'match_id');
    }
}
