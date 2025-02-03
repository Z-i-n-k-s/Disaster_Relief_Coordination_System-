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
    Schema::create('rescue_tracking_volunteers', function (Blueprint $table) {
        $table->id('ID');
        $table->unsignedBigInteger('TrackingID');
        $table->foreign('TrackingID')->references('TrackingID')->on('rescue_tracking');
        $table->unsignedBigInteger('VolunteerID');
        $table->foreign('VolunteerID')->references('VolunteerID')->on('volunteers');
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
        Schema::dropIfExists('rescue_tracking_volunteers');
    }
};
