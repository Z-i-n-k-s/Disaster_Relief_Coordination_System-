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
        Schema::create('affected_areas', function (Blueprint $table) {
            $table->id('AreaID');
            $table->string('AreaName');
            $table->enum('AreaType', ['Flood', 'Earthquake', 'Fire']);
            $table->enum('SeverityLevel', ['Low', 'Medium', 'High']);
            $table->integer('Population');
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
        Schema::dropIfExists('affected_areas');
    }
};
