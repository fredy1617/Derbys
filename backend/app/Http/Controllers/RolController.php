<?php

namespace App\Http\Controllers;

use App\Models\Derbys;
use App\Models\Matchs;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;
use Illuminate\Support\Collection;

class RolController extends Controller
{
    public function store(Request $request)
    {
        try{
            // Obtener el derby y sus partidos
            $derby = Derbys::findOrFail($request->id);
            $partidos = Matchs::where('derby_id', $derby->id)->with('roosters')->get();

            // Calcular el número de rondas (igual al número de gallos por ronda)
            $no_rondas = $derby->no_roosters;

            // Obtener todos los gallos de los partidos del derby
            $gallos = new Collection();
            foreach ($partidos as $partido) {
                $gallos = $gallos->merge($partido->roosters);
            }
            $gallos = $gallos->sortBy('weight')->values(); // Ordenar por peso y reindexar

            $numPartidos = count($partidos);
            $Total_Peleas = 0;
            $RONDAS = [];

            if ($numPartidos % 2 == 0) {
                $Total_Peleas = ($numPartidos * $no_rondas) / 2;
            } else {
                $Total_Peleas = (($numPartidos * $no_rondas) + 1) / 2;
            }
            LOGGER($no_rondas.' RONDAS   ---   PARTIDOS '.$numPartidos);

            LOGGER ('TOTAL DE PELEAS'.$Total_Peleas);
            
            if ($numPartidos % 2 == 0) {
                for ($i = 1; $i <= $no_rondas; $i++) {                 
                    $peleas = $Total_Peleas / $no_rondas;
                    $RONDAS['RONDA '.$i]['peleas'] = $peleas;
                }
            } else {
                for ($i = 1; $i <= $no_rondas; $i++) { 
                    if ($i % 2 == 0) {
                        $peleas = ($numPartidos - 1) / 2;
                    } else {
                        $peleas = ($numPartidos + 1) / 2;
                    }
                    $RONDAS['RONDA '.$i]['peleas'] = $peleas;
                }
            }
            
            // Eliminar roles anteriores del derby
            Rol::where('derby_id', $derby->id)->delete();

            for ($i = 1; $i <= $no_rondas; $i++) {
                $conditionApplied = false;
                $negativo=0;
                foreach ($gallos as $gallo) {
                    $negativo --;
                    $group_id = Matchs::where('matchs.id', $gallo->match_id)
                                ->join('group_matches', 'matchs.id', '=', 'group_matches.match_id')
                                ->value('group_matches.group_id') ?? $negativo;

                    if ($gallo['name'] == 'Gallo N°' . $i) {                    

                        // Verificar si el gallo tiene el mismo ring que algún gallo de la ronda anterior
                        $isDuplicateRing = false;
                        if ($i > 1 && isset($RONDAS['RONDA ' . ($i - 1)]['gallos'])) {
                            foreach ($RONDAS['RONDA ' . ($i - 1)]['gallos'] as $prevGallo) {
                                if ($gallo['ring'] == $prevGallo['ring']) {
                                    $isDuplicateRing = true;
                                    break;
                                }
                            }
                        }
            
                        if (!$isDuplicateRing) {
                            $RONDAS['RONDA ' . $i]['gallos'][] = [
                                'id' => $gallo->id, // Asegúrate de tener el campo 'id' correctamente
                                'name' => $gallo->name,
                                'weight' => $gallo->weight,
                                'ring' => $gallo->ring,
                                'match_id' => $gallo->match_id,
                                'group_id' => $group_id, // Incluir el group_id obtenido
                            ];
                        } 
                    }
                    
                    // Condición especial para rondas impares 
                    if ($numPartidos % 2 !== 0 && $i % 2 !== 0 && !$conditionApplied) {
                        if ($gallo['name'] == 'Gallo N°' . ($i + 1)) {
                            $RONDAS['RONDA ' . $i]['gallos'][] = [
                                'id' => $gallo->id, // Asegúrate de tener el campo 'id' correctamente
                                'name' => $gallo->name,
                                'weight' => $gallo->weight,
                                'ring' => $gallo->ring,
                                'match_id' => $gallo->match_id,
                                'group_id' => $group_id, // Incluir el group_id obtenido
                            ];
                            $conditionApplied = true; // Marcar la condición como aplicada
                        }
                    }                
                }
                if ($numPartidos % 2 !== 0 && $i % 2 !== 0 && $i == $no_rondas) {
                    $RONDAS['RONDA ' . $i]['gallos'][] = [
                        'id' => '0', // Asegúrate de tener el campo 'id' correctamente
                        'name' => 'EXTRA',
                        'weight' => '2300',
                        'ring' => 'EXTRA',
                        'match_id' => '0',
                        'group_id' => '0',
                    ];
                }
            }
        
            // Mostrar información de las rondas
            //foreach ($RONDAS as $ronda => $info) {
                //Logger($ronda);
                //Logger($info);
            //}
            // Generar los enfrentamientos por cada ronda
            $enfrentamientos = [];

            foreach ($RONDAS as $ronda => $infoRonda) {
                //LOGGER($infoRonda);

                $rondaTurno = 1;
                $gallosDisponibles = $infoRonda['gallos']; // Lista de gallos disponibles para la ronda actual

                // Crear una lista de enfrentamientos para controlar las peleas ya asignadas
                $enfrentamientosRonda = [];

                while ($rondaTurno <= $infoRonda['peleas']) {
                    // Lógica para seleccionar los gallos y aplicar las condiciones
                    $gallo1 = null;
                    $gallo2 = null;

                    foreach ($gallosDisponibles as $index1 => $gallo1) {
                        // Verificar si el gallo ya tiene una pelea dentro de la misma ronda
                        if ($this->galloConPelea($enfrentamientosRonda, $gallo1)) {
                            continue; // Saltar este gallo y pasar al siguiente
                        }

                        foreach ($gallosDisponibles as $index2 => $gallo2) {
                            // Verificar si el gallo ya tiene una pelea dentro de la misma ronda
                            if ($this->galloConPelea($enfrentamientosRonda, $gallo2)) {
                                continue; // Saltar este gallo y pasar al siguiente
                            }

                            // Verificar que los gallos cumplan las condiciones y no sean el mismo gallo
                            if (
                                $index1 != $index2 && // No es el mismo gallo
                                abs($gallo1['weight'] - $gallo2['weight']) <= $derby->tolerance &&
                                $gallo1['match_id'] !== $gallo2['match_id'] &&
                                $gallo1['group_id'] !== $gallo2['group_id'] &&                            
                                !$this->peleaRepetida($enfrentamientosRonda, $gallo1, $gallo2)
                            ) {
                                // Agregar el enfrentamiento si cumple las condiciones
                                $enfrentamientosRonda[] = [
                                    'pelea' => "Gallo {$gallo1['ring']} vs Gallo {$gallo2['ring']}",
                                    'condicion' => "Ronda " . ($ronda),
                                ];
                                
                                //INSERT EN TABLA ROL 'derby_id', 'ronda', 'gallo1_id', 'gallo2_id', 'condicion',
                                // Crear una instancia de Rol y asignar los valores
                                
                                $numeroRonda = (int) filter_var($ronda, FILTER_SANITIZE_NUMBER_INT);
                                
                                if ($gallo1['id'] == 0) {
                                    $gallo1['id'] = $gallo2['id'];
                                }
                                if ($gallo2['id'] == 0) {
                                    $gallo2['id'] = $gallo1['id'];
                                }

                                $enfrentamientos[] = [
                                    'derby_id' => $derby->id,
                                    'ronda' => $numeroRonda,
                                    'gallo1_id' => $gallo1['id'],
                                    'gallo2_id' => $gallo2['id'],
                                    'condicion' => 'Pelear',
                                    'match1_id' => $gallo1['match_id'],
                                    'match2_id' => $gallo2['match_id'],
                                ];
                                $rondaTurno++;
                                break 2; // Salir de ambos bucles foreach
                            }
                        }
                    }
                }
            }

            $this->agregarTabla($enfrentamientos);
            // Devolver respuesta exitosa con los enfrentamientos
            return response()->json([
                'success' => true,
                'message' => 'Enfrentamientos generados correctamente.',
                'enfrentamientos' => $enfrentamientos,
            ]);
        } catch (\Exception $e) {
            // Devolver respuesta de error en caso de excepción
            return response()->json([
                'success' => false,
                'message' => 'Error al generar enfrentamientos: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function agregarTabla($enfrentamientos)
    {
        // Ordenar por 'match1_id' y luego por 'match2_id' si 'match1_id' es igual
        usort($enfrentamientos, function($a, $b) {
            if ($a['match1_id'] === $b['match1_id']) {
                return $a['match2_id'] <=> $b['match2_id'];
            }
            return $a['match1_id'] <=> $b['match1_id'];
        });

        // Registrar los datos ordenados de enfrentamientos
        LOGGER($enfrentamientos);

        // Preparar los datos para insertar en la tabla 'rol'
        $dataInstert = array_map(function($enfrentamiento) {
            return [
                'derby_id' => $enfrentamiento['derby_id'],
                'ronda' => $enfrentamiento['ronda'],
                'gallo1_id' => $enfrentamiento['gallo1_id'],
                'gallo2_id' => $enfrentamiento['gallo2_id'],
                'condicion' => $enfrentamiento['condicion'],
            ];
        }, $enfrentamientos);

        // Registrar los datos ordenados de enfrentamientos
        LOGGER($dataInstert);

        foreach ($dataInstert as $data) {
            $pelea = new Rol($data);
            $pelea->save();
        }
    }

    // Función para verificar si una pelea ya ha sido agregada previamente en la misma ronda
    private function peleaRepetida($enfrentamientosRonda, $gallo1, $gallo2)
    {
        foreach ($enfrentamientosRonda as $pelea) {
            $gallosPelea = explode(' vs ', $pelea['pelea']);
            if (
                ($gallosPelea[0] == "Gallo {$gallo1['ring']}" && $gallosPelea[1] == "Gallo {$gallo2['ring']}") ||
                ($gallosPelea[0] == "Gallo {$gallo2['ring']}" && $gallosPelea[1] == "Gallo {$gallo1['ring']}") 
            ) {
                return true; // La pelea ya ha sido agregada previamente en la misma ronda
            }
        }
        return false; // La pelea es única en la misma ronda
    }

    // Función para verificar si un gallo ya tiene una pelea en la misma ronda
    private function galloConPelea($enfrentamientosRonda, $gallo)
    {
        foreach ($enfrentamientosRonda as $pelea) {
            $gallosPelea = explode(' vs ', $pelea['pelea']);
            if (
                $gallosPelea[0] == "Gallo {$gallo['ring']}" ||
                $gallosPelea[1] == "Gallo {$gallo['ring']}"
            ) {
                return true; // El gallo ya tiene una pelea dentro de la misma ronda
            }
        }
        return false; // El gallo no tiene peleas en la misma ronda
    }

    public function show($id)
    {
        $enfrentamientos = Rol::where('derby_id', $id)->with('gallo1', 'gallo2')->get();
        
        foreach ($enfrentamientos as $enfrentamiento) {
            // Obtener el nombre del partido para gallo1
            $match1_id = $enfrentamiento->gallo1->match_id;
            $match1 = Matchs::select('name')->where('id', $match1_id)->first();
            $enfrentamiento->gallo1->match_name = $match1 ? $match1->name : null;

            // Obtener el nombre del partido para gallo2
            $match2_id = $enfrentamiento->gallo2->match_id;
            $match2 = Matchs::select('name')->where('id', $match2_id)->first();
            $enfrentamiento->gallo2->match_name = $match2 ? $match2->name : null;
        }

        return response()->json($enfrentamientos);
    }

}
