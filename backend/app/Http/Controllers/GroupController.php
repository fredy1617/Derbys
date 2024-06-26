<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupMatches;
use Dotenv\Exception\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;
use Illuminate\Validation\ValidationException as ValidationValidationException;

class GroupController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'derby_id' => 'required|exists:derbys,id',
                'name' => 'required|string|max:255',
                'matches' => 'required|array',
            ]);

             // Check if any of the selected matches is already associated with a group
            $existingMatches = GroupMatches::whereIn('match_id', $validatedData['matches'])->exists();
            if ($existingMatches) {
                return response()->json(['error' => 'Uno o más partidos seleccionados ya están asociadas con un grupo'], 400);
            }

            $group = new Group();
            $group->derby_id = $validatedData['derby_id']; // Set the derby_id
            $group->name = $validatedData['name'];
            $group->save();

            // Attach matches to the group
            $group->matches()->attach($validatedData['matches']);

            return response()->json(['message' => 'Hola al agregar el grupo'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al agregar el grupo'], 500);
        }
    }

    public function show($id)
    {
        $grupos = Group::where('derby_id', $id)->with('matches')->get();

        return response()->json($grupos);
    }

    public function update(Request $request, $id)
    {
            // Validar los campos básicos
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'matches' => 'required|array',
                'matches.*.pivot.group_id' => 'required|integer',
                'matches.*.pivot.match_id' => 'required|integer',
            ]);
    
            $group = Group::findOrFail($id);
            $group->name = $validatedData['name'];
            $group->save();
    
            // Obtener las IDs de los partidos que llegan desde la solicitud
            $requestedMatchIds = array_column(array_column($validatedData['matches'], 'pivot'), 'match_id');

            // Obtener las IDs de los partidos actuales del grupo
            $currentMatchIds = $group->matches()->pluck('matchs.id')->toArray();

            // Obtener la diferencia de IDs entre los partidos solicitados y los actuales del grupo
            $difference = array_diff($requestedMatchIds, $currentMatchIds);

            // Verificar si hay partidos en la diferencia que existen en otros grupos
            foreach ($difference as $matchId) {
                $existsInOtherGroups = GroupMatches::where('match_id', $matchId)
                    ->where('group_id', '!=', $id)
                    ->exists();

                if ($existsInOtherGroups) {
                    return response()->json(['error' => 'Uno o más partidos seleccionados existen en algún otro grupo'], 400);
                }
            }
    
            // Determinar las IDs de los partidos a agregar y a eliminar
            $matchesToAdd = array_diff($requestedMatchIds, $currentMatchIds);
            $matchesToRemove = array_diff($currentMatchIds, $requestedMatchIds);
    
            // Añadir los nuevos partidos al grupo
            foreach ($matchesToAdd as $matchId) {
                $group->matches()->attach($matchId, ['group_id' => $id, 'match_id' => $matchId]);
            }
    
            // Eliminar los partidos que ya no están en la lista
            foreach ($matchesToRemove as $matchId) {
                $group->matches()->detach($matchId);
            }
    
            return response()->json($group->load('matches'), 200);       
    }

    public function destroy($id)
    {
        Group::destroy($id);

        return response()->json(['message' => 'Grupo eliminado exitosamente.'], 201);
    }

}
