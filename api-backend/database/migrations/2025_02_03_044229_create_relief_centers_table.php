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
    Schema::create('relief_centers', function (Blueprint $table) {
        $table->id('CenterID');
        $table->string('CenterName');
        $table->string('Location');
        $table->integer('NumberOfVolunteersWorking');
        $table->integer('MaxVolunteersCapacity');
        $table->unsignedBigInteger('ManagerID');
        $table->foreign('ManagerID')->references('UserID')->on('users');
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
        Schema::dropIfExists('relief_centers');
    }
};
