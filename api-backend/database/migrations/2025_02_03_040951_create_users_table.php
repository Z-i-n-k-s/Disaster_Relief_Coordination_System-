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
        Schema::create('users', function (Blueprint $table) {
            $table->id('UserID'); // Primary key
            $table->string('Email')->unique(); // Unique email
            $table->string('Name');
            $table->string('Password');
            $table->enum('Role', ['Admin', 'User', 'Volunteer']); // Enum for role
            $table->string('PhoneNo')->nullable(); // Optional phone number
            $table->timestamps(); // Created at and Updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};