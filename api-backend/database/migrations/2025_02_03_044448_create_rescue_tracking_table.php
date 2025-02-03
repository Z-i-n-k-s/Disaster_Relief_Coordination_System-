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
    Schema::create('rescue_tracking', function (Blueprint $table) {
        $table->id('TrackingID');
        $table->unsignedBigInteger('RequestID');
        $table->foreign('RequestID')->references('RequestID')->on('aid_requests');
        $table->enum('TrackingStatus', ['In Progress', 'Completed']);
        $table->string('CurrentLocation');
        $table->dateTime('OperationStartTime');
        $table->integer('NumberOfPeopleHelped');
        $table->text('SuppliesDelivered');
        $table->dateTime('CompletionTime');
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
        Schema::dropIfExists('rescue_tracking');
    }
};
