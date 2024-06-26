<?php

namespace App\Http\Controllers;

use App\Models\Matchs;
use App\Models\Roosters;
use Illuminate\Http\Request;

class MatchesController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'derby_id' => 'required|exists:derbys,id',
            'name' => 'required|string|max:255',
            'roosters' => 'array',
            'roosters.*.name' => 'required|string|max:255',
            'roosters.*.ring' => 'required|string|max:255',
            'roosters.*.weight' => 'required|numeric',
        ]);

      
        $rings = array_column($data['roosters'], 'ring');

        $existingMatches = Roosters::whereIn('ring', $rings)
            ->join('matchs', 'roosters.match_id', '=', 'matchs.id')
            ->where('matchs.derby_id', $data['derby_id'])
            ->exists();
    
        if ($existingMatches) {
            return response()->json(['error' => 'ALGUN ANILLO YA ESTA REGISTRADO'], 400);
        }

        $match = Matchs::create([
            'derby_id' => $request->derby_id,
            'name' => $request->name,
        ]);

        foreach ($data['roosters'] as $roosterData) {
            $roosterData['match_id'] = $match->id;
            Roosters::create($roosterData);
        }
    }

    public function show($id)
    {
        $partidos = Matchs::where('derby_id', $id)->with('roosters')->get();

        if ($partidos->isEmpty()) {
            return response()->json(['message' => 'No matches found for the given derby ID.'], 404);
        }

        return response()->json($partidos);
    }
    
    public function update(Request $request, $id)
    {
        // Validación de los datos entrantes
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'roosters' => 'array',
            'roosters.*.id' => 'required|integer|exists:roosters,id', // Validar que el ID del gallo exista en la tabla roosters
            'roosters.*.name' => 'required|string|max:255',
            'roosters.*.ring' => 'required|string|max:255',
            'roosters.*.weight' => 'required|numeric',
        ]);

        // Encontrar el partido por su ID
        $match = Matchs::findOrFail($id);

        // Actualizar los datos del partido
        $match->update([
            'derby_id' => $request->derby_id,
            'name' => $request->name,
        ]);

        // Actualizar los datos de los gallos
        foreach ($data['roosters'] as $roosterData) {
            // Encontrar el gallo por su ID
            $rooster = Roosters::findOrFail($roosterData['id']);
            
            // Actualizar el gallo
            $rooster->update([
                'name' => $roosterData['name'],
                'ring' => $roosterData['ring'],
                'weight' => $roosterData['weight'],
            ]);
        }

        return response()->json(['message' => 'Partido actualizado exitosamente.'], 201);
    }


    public function destroy($id)
    {
        Matchs::destroy($id);

        return response()->json(['message' => 'Partido eliminado exitosamente.'], 201);
    }
}
