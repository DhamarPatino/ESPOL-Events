<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'modality' => 'required|string|max:50',
            'faculty' => 'required|string|max:100',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
        ]);

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Evento creado correctamente.',
            'event' => $event
        ], 201);
    }


        public function index(Request $request)
        {
            $query = Event::query();

            // Búsqueda general
            if ($request->filled('search')) {
                $search = $request->search;

                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Filtro por categoría
            if ($request->filled('category')) {
                $query->where('category', $request->category);
            }

            // Filtro por fecha
            if ($request->filled('date')) {
                $query->whereDate('date', $request->date);
            }

            // Filtro por facultad
            if ($request->filled('faculty')) {
                $query->where('faculty', $request->faculty);
            }

            $events = $query->get();

            return response()->json([
                'message' => 'Eventos consultados correctamente.',
                'events' => $events
            ]);
        }

}
