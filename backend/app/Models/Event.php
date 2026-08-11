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
        'location',
        'max_participants',
    ];
}
