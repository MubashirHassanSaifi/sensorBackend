const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const sensorSchema= new Schema({
   userid:{type:String,required:true},
   temp:{type:Number,required:true},
   createdDate:{type:String},
   updatedDate:{type:String,default:null}

})
let Sensor=mongoose.model("Sensor",sensorSchema);
module.exports=Sensor;
