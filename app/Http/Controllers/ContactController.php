<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ContactController extends Controller
{
    public function sendContactEmail(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string|max:5000',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        try {
            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $attachmentPath = $request->file('attachment')->store('attachments', 'public');
            }

            // Save message to database
            $contactMessage = Message::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'message' => $validated['message'],
                'attachment_path' => $attachmentPath,
            ]);

            // Clear admin dashboard caches
            Cache::forget('admin:messages:all');
            Cache::forget('admin:messages:unread_count');

            return response()->json(['success' => true, 'message' => $contactMessage]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send message. Please try again.', 'error' => $e->getMessage()], 500);
        }
    }

    public function adminStatus()
    {
        return response()->json([
            'admin_online' => Cache::get('admin_online', false)
        ]);
    }

    public function messageStatus($id)
    {
        $message = Message::find($id);
        if (!$message || !$message->admin_reply) {
            return response()->json(['admin_reply' => null, 'admin_replies' => []]);
        }

        // Parse JSON replies or fallback to legacy string
        $replies = json_decode($message->admin_reply, true);
        if (!is_array($replies)) {
            $replies = [['text' => $message->admin_reply, 'created_at' => $message->replied_at]];
        }
        
        return response()->json([
            'admin_reply' => $message->admin_reply, // legacy
            'admin_replies' => $replies
        ]);
    }
}
