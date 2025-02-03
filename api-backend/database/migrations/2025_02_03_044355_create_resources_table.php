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
        Schema::create('resources', function (Blueprint $table) {
            $table->id('ResourceID');
            $table->string('ResourceType');
            $table->integer('Quantity');
            $table->dateTime('ExpirationDate');
            $table->unsignedBigInteger('ReliefCenterID');
            $table->foreign('ReliefCenterID')->references('CenterID')->on('relief_centers');
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
        Schema::dropIfExists('resources');
    }
};
