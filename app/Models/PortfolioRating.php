<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioRating extends Model
{
    public $timestamps = false;

    protected $fillable = ['rating', 'name', 'comment'];

    protected $casts = [
        'rating'     => 'integer',
        'created_at' => 'datetime',
    ];
}
