<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('donations', function (Blueprint $table) {
        $table->id('DonationID');
        $table->string('DonorName');
        $table->enum('DonationType', ['Food', 'Money', 'Clothes']);
        $table->integer('Quantity');
        $table->dateTime('DateReceived');
        $table->unsignedBigInteger('AssociatedCenter');
        $table->foreign('AssociatedCenter')->references('CenterID')->on('relief_centers');
        $table->unsignedBigInteger('UserID');
        $table->foreign('UserID')->references('UserID')->on('users');
        $table->unsignedBigInteger('ResourceID');
        $table->foreign('ResourceID')->references('ResourceID')->on('resources');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('donations');
    }
};
