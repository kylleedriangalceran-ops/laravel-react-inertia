<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\ContactController;

Route::get('/', function () {
    // Track one visit per browser session
    if (!session()->has('visit_counted')) {
        session(['visit_counted' => true]);
        Cache::increment('portfolio:total_visits');
        $dayKey = 'portfolio:visits:' . now()->format('Y-m-d');
        Cache::add($dayKey, 0, now()->addDays(10));
        Cache::increment($dayKey);
    }

    $totalVisits  = (int) Cache::get('portfolio:total_visits', 0);
    $avgRating    = round(\App\Models\PortfolioRating::avg('rating') ?? 0, 1);
    $totalRatings = \App\Models\PortfolioRating::count();

    // Fetch testimonials (ratings with comments)
    $testimonials = \App\Models\PortfolioRating::whereNotNull('comment')
        ->whereNotNull('name')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($rating) {
            return [
                'name' => $rating->name,
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'date' => $rating->created_at->toISOString(),
            ];
        });

    return Inertia::render('Welcome', [
        'totalVisits'  => $totalVisits,
        'avgRating'    => $avgRating,
        'totalRatings' => $totalRatings,
        'testimonials' => $testimonials,
    ]);
});

Route::post('/analytics/rate', function (\Illuminate\Http\Request $request) {
    $validated = $request->validate([
        'rating' => 'required|integer|min:1|max:5',
        'name' => 'nullable|string|max:255',
        'comment' => 'nullable|string|max:1000',
    ]);

    \App\Models\PortfolioRating::create([
        'rating' => $validated['rating'],
        'name' => $validated['name'] ?? null,
        'comment' => $validated['comment'] ?? null,
    ]);

    $avgRating    = round(\App\Models\PortfolioRating::avg('rating') ?? 0, 1);
    $totalRatings = \App\Models\PortfolioRating::count();
    return response()->json(['success' => true, 'avgRating' => $avgRating, 'totalRatings' => $totalRatings]);
})->name('analytics.rate');

Route::post('/contact', [ContactController::class, 'sendContactEmail'])->name('contact.send');
Route::get('/contact/{id}/status', [ContactController::class, 'messageStatus'])->name('contact.status');
Route::get('/admin/status', [ContactController::class, 'adminStatus'])->name('admin.status');

Route::get('/admin/dashboard', [MessageController::class, 'index'])->name('admin.dashboard');
Route::post('/admin/ping', [MessageController::class, 'ping'])->name('admin.ping');

Route::post('/admin/messages/{id}/reply', [MessageController::class, 'reply'])->name('admin.messages.reply');
Route::post('/admin/messages/{id}/read', [MessageController::class, 'markAsRead'])->name('admin.messages.read');
Route::delete('/admin/messages/{id}', [MessageController::class, 'destroy'])->name('admin.messages.destroy');
Route::delete('/admin/conversations/{email}', [MessageController::class, 'destroyConversation'])->name('admin.messages.destroyConversation');

Route::get('/admin/messages/unread-count', [MessageController::class, 'getUnreadCount'])->name('admin.messages.unread-count');
Route::post('/admin/cache/clear', [MessageController::class, 'clearCache'])->name('admin.cache.clear');
