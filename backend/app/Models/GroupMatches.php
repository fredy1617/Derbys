<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupMatches extends Model
{
    use HasFactory;

    protected $fillable = ['match_id', 'group_id'];
}
