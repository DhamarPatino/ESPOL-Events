<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    // Creacion de eventos -- Dhamar Patino

    // POST /api/events
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


        // Consulta, busqueda y filtrado de eventos -- Dhamar Patino

        // GET /api/events
        public function index(Request $request)
        {
            
            $request->validate([
                'search' => 'nullable|string|max:255',
                'category' => 'nullable|string|max:100',
                'date' => 'nullable|date',
                'faculty' => 'nullable|string|max:100',
            ]);

            $query = Event::query();
            
            // Búsqueda general
            if ($request->filled('search')) {
                $search = $request->search;

                // Ajuste para PostgreSQL: "like" distingue mayusculas, "ilike" no -- Cristina Pihuave
                $like = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

                $query->where(function ($q) use ($search, $like) {
                    $q->where('title', $like, "%{$search}%")
                    ->orWhere('description', $like, "%{$search}%");
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

            $events = $query
                ->orderBy('date', 'asc')
                ->orderBy('start_time', 'asc')
                ->get();

            return response()->json([
                'message' => 'Eventos consultados correctamente.',
                'events' => $events
            ]);
        }

    // Consulta del detalle, actualizacion y eliminacion de eventos -- Cristina Pihuave

    // GET /api/events/{id}
    // Devuelve la informacion completa del evento junto con sus cupos
    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Evento no encontrado.'
            ], 404);
        }

        return response()->json([
            'message' => 'Evento consultado correctamente.',
            'event' => $event,
            'registered_participants' => $event->registeredCount(),
            'available_spots' => $event->availableSpots(),
        ]);
    }

    // PUT / PATCH /api/events/{id}
    // Actualiza uno o varios campos del evento
    public function update(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Evento no encontrado.'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|max:100',
            'modality' => 'sometimes|required|string|max:50',
            'faculty' => 'sometimes|required|string|max:100',
            'date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date_format:H:i,H:i:s',
            'location' => 'sometimes|required|string|max:255',
            'max_participants' => 'sometimes|required|integer|min:1',
        ]);

        if (empty($validated)) {
            return response()->json([
                'message' => 'No se enviaron datos para actualizar.'
            ], 422);
        }

        // No se permite reducir los cupos por debajo de los participantes ya inscritos
        if (isset($validated['max_participants'])) {
            $registered = $event->registeredCount();

            if ($validated['max_participants'] < $registered) {
                return response()->json([
                    'message' => 'El máximo de participantes no puede ser menor a los inscritos actuales.',
                    'registered_participants' => $registered,
                ], 422);
            }
        }

        $event->update($validated);

        return response()->json([
            'message' => 'Evento actualizado correctamente.',
            'event' => $event->fresh(),
        ]);
    }

    // DELETE /api/events/{id}
    // Elimina el evento y sus inscripciones asociadas
    public function destroy($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Evento no encontrado.'
            ], 404);
        }

        $event->delete();

        return response()->json([
            'message' => 'Evento eliminado correctamente.'
        ]);
    }

}
