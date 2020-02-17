const mongoose =require ('mongoose');

const Schmea=mongoose.Schema;

const temp_Schema= new Schmea({
    userid:{
        type:String,
        required:true
    },
    temp:{
        type:Number, 
        default:0
    },
    logid:{
        type:String,
        default:null
    }

         
},{timestamps:true});

let Temprature=mongoose.model("Temprature",temp_Schema);
module.exports =Temprature;