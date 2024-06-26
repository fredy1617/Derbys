<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matchs extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'derby_id'];  // Asegúrate de tener los campos necesarios aquí

    // Cambia la tabla y la llave primaria si es necesario
    protected $table = 'matchs';  // Nombre de la tabla en la base de datos
    protected $primaryKey = 'id';  // Llave primaria de la tabla

    // Relación con los grupos
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_matches', 'match_id', 'group_id');
    }

    public function roosters()
    {
        return $this->hasMany(Roosters::class, 'match_id');
    }
}
