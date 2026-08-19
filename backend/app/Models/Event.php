<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', // <--- Agregamos la referencia al usuario creador
        'title',
        'description',
        'category',
        'modality',
        'faculty',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'image',
        'location',
        'max_participants',
        'status',
    ];

    // Relación con el usuario organizador
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Inscripciones y control de cupos -- Cristina Pihuave

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function registeredCount()
    {
        return $this->registrations()->count();
    }

    public function availableSpots()
    {
        $libres = $this->max_participants - $this->registeredCount();
        return $libres < 0 ? 0 : $libres;
    }
}