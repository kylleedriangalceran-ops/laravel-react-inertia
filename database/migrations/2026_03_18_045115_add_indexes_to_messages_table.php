<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            // Add indexes for frequently queried columns
            $table->index('is_read'); // For filtering unread messages
            $table->index('created_at'); // For ordering by date
            $table->index(['is_read', 'created_at']); // Composite index for common queries
            $table->index('email'); // For searching by email
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['is_read']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['is_read', 'created_at']);
            $table->dropIndex(['email']);
        });
    }
};
