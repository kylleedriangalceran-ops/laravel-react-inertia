<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\PortfolioRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Events\MessageReplied;

class MessageController extends Controller
{
    // Cache keys
    const CACHE_MESSAGES_KEY = 'admin:messages:all';
    const CACHE_UNREAD_COUNT_KEY = 'admin:messages:unread_count';
    const CACHE_TTL = 300; // 5 minutes

    public function index()
    {
        $messages = Cache::remember(self::CACHE_MESSAGES_KEY, self::CACHE_TTL, function () {
            return Message::orderBy('created_at', 'desc')->get();
        });

        $unreadCount = Cache::remember(self::CACHE_UNREAD_COUNT_KEY, self::CACHE_TTL, function () {
            return Message::where('is_read', false)->count();
        });

        // Visit analytics
        $totalVisits = (int) Cache::get('portfolio:total_visits', 0);
        $todayVisits = (int) Cache::get('portfolio:visits:' . now()->format('Y-m-d'), 0);

        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $weeklyData[] = [
                'date'   => now()->subDays($i)->format('D'),
                'visits' => (int) Cache::get('portfolio:visits:' . $date, 0),
            ];
        }

        // Rating analytics
        $avgRating    = round(PortfolioRating::avg('rating') ?? 0, 1);
        $totalRatings = PortfolioRating::count();
        $ratingBreakdown = [];
        for ($star = 5; $star >= 1; $star--) {
            $ratingBreakdown[$star] = PortfolioRating::where('rating', $star)->count();
        }

        return Inertia::render('Admin/Dashboard', [
            'messages'    => $messages,
            'unreadCount' => $unreadCount,
            'cacheDriver' => config('cache.default'),
            'analytics'   => [
                'totalVisits'     => $totalVisits,
                'todayVisits'     => $todayVisits,
                'weeklyData'      => $weeklyData,
                'avgRating'       => $avgRating,
                'totalRatings'    => $totalRatings,
                'ratingBreakdown' => $ratingBreakdown,
            ],
        ]);
    }

    public function show($id)
    {
        // Cache individual message
        $message = Cache::remember("admin:message:{$id}", self::CACHE_TTL, function () use ($id) {
            return Message::findOrFail($id);
        });

        // Mark as read
        if (!$message->is_read) {
            $message->update(['is_read' => true]);

            // Clear caches
            $this->clearMessageCaches($id);
        }

        return response()->json($message);
    }

    public function reply(Request $request, $id)
    {
        $validated = $request->validate([
            'reply' => 'nullable|string|max:5000',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        if (empty($validated['reply']) && !$request->hasFile('attachment')) {
            return response()->json(['message' => 'Message or attachment is required'], 422);
        }

        $message = Message::findOrFail($id);
        
        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('attachments', 'public');
        }

        // Decode existing replies or initialize array
        $existingReplies = json_decode($message->admin_reply, true);
        if (!is_array($existingReplies)) {
            $existingReplies = $message->admin_reply ? [
                ['text' => $message->admin_reply, 'created_at' => $message->replied_at]
            ] : [];
        }

        // Add new reply
        $existingReplies[] = [
            'text' => $validated['reply'] ?? '',
            'attachment' => $attachmentPath,
            'created_at' => now()->toIso8601String()
        ];

        $message->update([
            'admin_reply' => json_encode($existingReplies),
            'replied_at' => now(),
        ]);

        // Clear caches
        $this->clearMessageCaches($id);

        // Broadcast the reply real-time (wrapped in try-catch in case broadcasting driver is not configured)
        try {
            broadcast(new MessageReplied($message));
        } catch (\Exception $e) {
            // Broadcasting not available, reply is still saved via polling
        }

        return response()->json(['success' => true, 'message' => $message]);
    }

    public function markAsRead($id)
    {
        $message = Message::findOrFail($id);
        $message->update(['is_read' => true]);

        // Clear caches
        $this->clearMessageCaches($id);

        return response()->json(['success' => true]);
    }

    public function ping()
    {
        // Set admin online status for 15 seconds
        Cache::put('admin_online', true, 15);
        return response()->json(['success' => true]);
    }

    public function getUnreadCount()
    {
        // Get from cache or database
        $count = Cache::remember(self::CACHE_UNREAD_COUNT_KEY, self::CACHE_TTL, function () {
            return Message::where('is_read', false)->count();
        });

        return response()->json(['count' => $count]);
    }

    /**
     * Clear all message-related caches
     */
    private function clearMessageCaches($messageId = null)
    {
        Cache::forget(self::CACHE_MESSAGES_KEY);
        Cache::forget(self::CACHE_UNREAD_COUNT_KEY);

        if ($messageId) {
            Cache::forget("admin:message:{$messageId}");
        }
    }

    /**
     * Clear all caches (useful for manual cache clearing)
     */
    public function clearCache()
    {
        Cache::tags(['messages'])->flush();
        $this->clearMessageCaches();

        return response()->json(['success' => true, 'message' => 'Cache cleared successfully']);
    }

    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        
        if ($message->attachment_path) {
            Storage::disk('public')->delete($message->attachment_path);
        }
        
        $replies = json_decode($message->admin_reply, true);
        if (is_array($replies)) {
            foreach ($replies as $reply) {
                if (isset($reply['attachment'])) {
                    Storage::disk('public')->delete($reply['attachment']);
                }
            }
        }

        $message->delete();
        $this->clearMessageCaches();

        return response()->json(['success' => true]);
    }

    public function destroyConversation($email)
    {
        $messages = Message::where('email', $email)->get();
        foreach ($messages as $message) {
            if ($message->attachment_path) {
                Storage::disk('public')->delete($message->attachment_path);
            }
            $replies = json_decode($message->admin_reply, true);
            if (is_array($replies)) {
                foreach ($replies as $reply) {
                    if (isset($reply['attachment'])) {
                        Storage::disk('public')->delete($reply['attachment']);
                    }
                }
            }
            $message->delete();
        }
        $this->clearMessageCaches();

        return response()->json(['success' => true]);
    }
}
