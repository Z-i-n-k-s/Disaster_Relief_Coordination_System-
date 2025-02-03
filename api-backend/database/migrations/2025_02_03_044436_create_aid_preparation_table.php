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
        Schema::create('aid_preparation', function (Blueprint $table) {
            $table->id('PreparationID');
            $table->unsignedBigInteger('RequestID');
            $table->foreign('RequestID')->references('RequestID')->on('aid_requests');
            $table->unsignedBigInteger('PreparedBy');
            $table->foreign('PreparedBy')->references('VolunteerID')->on('volunteers');
            $table->dateTime('DepartureTime');
            $table->dateTime('EstimatedArrival');
            $table->unsignedBigInteger('ResourceID');
            $table->foreign('ResourceID')->references('ResourceID')->on('resources');
            $table->integer('QuantityUsed');
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
        Schema::dropIfExists('aid_preparation');
    }
};
