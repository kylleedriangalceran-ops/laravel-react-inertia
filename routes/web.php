<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\ContactController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

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
