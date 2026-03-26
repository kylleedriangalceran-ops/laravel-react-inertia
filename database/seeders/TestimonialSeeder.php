<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PortfolioRating;
use Carbon\Carbon;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Sarah Johnson',
                'rating' => 5,
                'comment' => 'Kylle is an exceptional developer with a keen eye for detail. His work on our project exceeded expectations, delivering clean code and a beautiful user interface. Highly recommended for any web development needs!',
                'created_at' => Carbon::now()->subDays(15),
            ],
            [
                'name' => 'Michael Chen',
                'rating' => 5,
                'comment' => 'Working with Kylle was a pleasure. He understood our requirements perfectly and delivered a robust solution using Laravel and React. His communication throughout the project was excellent.',
                'created_at' => Carbon::now()->subDays(30),
            ],
            [
                'name' => 'Emily Rodriguez',
                'rating' => 4,
                'comment' => 'Great developer! Kylle built our company website with modern technologies and made it responsive across all devices. The project was completed on time and within budget.',
                'created_at' => Carbon::now()->subDays(45),
            ],
            [
                'name' => 'David Thompson',
                'rating' => 5,
                'comment' => 'Kylle\'s portfolio speaks for itself. His technical skills combined with his design sensibility make him a valuable asset. The EduGrade project showcases his ability to handle complex systems.',
                'created_at' => Carbon::now()->subDays(60),
            ],
            [
                'name' => 'Lisa Martinez',
                'rating' => 5,
                'comment' => 'Impressive work! Kylle transformed our outdated website into a modern, fast, and user-friendly platform. His expertise in both frontend and backend development is evident in every aspect of the project.',
                'created_at' => Carbon::now()->subDays(75),
            ],
        ];

        foreach ($testimonials as $testimonial) {
            PortfolioRating::create($testimonial);
        }
    }
}
