<?php

namespace App\Http\Controllers;

use App\Models\Derbys;
use Illuminate\Http\Request;

class DerbysController extends Controller
{
    public function index()
    {
        $areas = Derbys::all(); 
        return response()->json($areas); 
    }

    public function store(Request $request)
    {
        $Derby = new Derbys($request->all());

        $Derby->save();
        return response()->json(['message' => 'Derby registrado con exito'], 201);
    }

    public function show($id)
    {
        $area = Derbys::find($id);
        return response()->json($area);
    }

    public function update(Request $request, $id)
    {
        // Find the area by ID, or return a 404 error if not found
        $area = Derbys::findOrFail($id);

        // Update the area with the provided data
        $area->update($request->all());
        
        return response()->json(['message' => 'Area actualizada exitosamente.'], 201);
    }

    public function destroy($id)
    {
        Derbys::destroy($id);

        return response()->json(['message' => 'Area eliminada exitosamente.'], 201);
    }

}
