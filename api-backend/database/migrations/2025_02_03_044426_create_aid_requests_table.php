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
        Schema::create('aid_requests', function (Blueprint $table) {
            $table->id('RequestID');
            $table->unsignedBigInteger('UserID');
            $table->foreign('UserID')->references('UserID')->on('users');
            $table->unsignedBigInteger('AreaID');
            $table->foreign('AreaID')->references('AreaID')->on('affected_areas');
            $table->string('RequesterName');
            $table->string('ContactInfo');
            $table->enum('RequestType', ['Aid', 'Rescue']);
            $table->text('Description');
            $table->enum('UrgencyLevel', ['Low', 'Medium', 'High']);
            $table->enum('Status', ['Pending', 'In Progress', 'Completed']);
            $table->integer('NumberOfPeople');
            $table->dateTime('RequestDate');
            $table->dateTime('ResponseTime');
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
        Schema::dropIfExists('aid_requests');
    }
};
