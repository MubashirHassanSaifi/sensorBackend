const express =require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const tempRouter=require('./routes/temprature');
require('dotenv').config();




// create server object

const app = express();

app.use(express.json());
app.use(cors());
app.use('/temprature',tempRouter);

//database connectivity

const connectionString=process.env.CONNECTION_STRING;
mongoose.connect(connectionString,{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("mongo db connection is established")});
    global.connection=connection;

   //------------------------------------------------------------------
  /*
   const collection = connection.collection('Temprature_log')
   collection.find()
   .then((log)=> {
    log.forEach(l => {
        if(l.message.includes(',')) {
            const x = l.message.split(',');
            console.log(x[1].toString());
        }
    })
   })
   
   .catch((err)=>console.log(err));
------------------------------------------------------------------------*/
// connect to the port
   const port=process.env.PORT || 5002;

app.listen(port,console.log(`server is running on ${port}`));
