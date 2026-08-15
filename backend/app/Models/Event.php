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
