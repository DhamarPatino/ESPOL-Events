<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'modality',
        'faculty',
        'date',
        'start_time',
        'end_time',       // <-- AGREGADO
        'image',          // <-- AGREGADO (o 'image_url')
        'location',
        'max_participants',
    ];

    // Inscripciones y control de cupos -- Cristina Pihuave

    // Un evento tiene muchas inscripciones
    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    // Cantidad de participantes inscritos
    public function registeredCount()
    {
        return $this->registrations()->count();
    }

    // Cupos que quedan libres
    public function availableSpots()
    {
        $libres = $this->max_participants - $this->registeredCount();
        return $libres < 0 ? 0 : $libres;
    }
}
