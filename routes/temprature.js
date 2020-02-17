const router=require('express').Router();
let Temprature=require('../model/temprature.model');
const joi =require('@hapi/joi');
//const logger=require('../logging/logger');
const Sensor=require('../model/sensor.component');
//const mongoose=require('mongoose');


//schema define for temprature

  const tempSchema=joi.object({
    userid:joi.string().required(),
    temp:joi.number()
  })
//const connection =mongoose.connection;

// update temprature

router.route('/update/:id').post(async (req,res)=>{
     const userid =req.params.id;
     const tempVal=req.body.temp;
     const date=new Date();
     const newDate =date.toDateString();
     const time=date.toLocaleTimeString();
     const timeDate =newDate+ '  '+ time;
                
     const tempFound=  await  Temprature.findOne({_id:userid})
  try{
           
            tempFound.temp=tempVal;
            //tempFound.logid=null
           let temptbl; 
            const tempUpdate= await tempFound.save();
            console.log('temp update');
            try{
               //res.status(200).json('temp-table is updated');
              //check that the log is created or not
                 const userid=tempUpdate.userid;
                 const temp=tempVal;
                 let logCreatedTime= tempUpdate.updatedAt.toLocaleTimeString();
                 let logCreatedDate=tempUpdate.updatedAt.toDateString();
                 let logDateTime=logCreatedDate+' '+logCreatedTime;
                     
                 //const collection = connection.collection('sensors');
              
                     
                 if(tempUpdate.logid==null || tempUpdate.logid===undefined) 
                {
                 
                 const sensor= new Sensor({
                 userid:userid,
                 temp:temp,
                 createdDate:logDateTime,
                 //updatedDate:null,
                
                })
                 const saveSensor  = await sensor.save()
                 try{
                //temprature logis is update  
                  tempUpdate.logid=saveSensor._id;
                   temptbl =await tempUpdate.save();
                  console.log(`update  ${temptbl}`);
                   res.status(200).json("1: sensor is saved "); 
                  }
                 catch(err){
                    res.status(400).json('1:sensor is not save');
                    }
                }

                
               else{
                    console.log(tempUpdate.logid);
                    const logid=tempUpdate.logid;
                    const sensorFound =await  Sensor.findById(logid)
                    console.log('type '+typeof(sensorFound));
                    console.log(`sensor is found  ${sensorFound}`);
                    const sensorDate=sensorFound.updatedDate;
                    console.log(sensorDate);
                //update the previous sensor updatedDate
                    if(sensorDate===null || sensorDate===undefined){
                              sensorFound.updatedDate =timeDate;
                              console.log(`sensor update date ${sensorFound.updatedDate}`);
                              sensorFound.save()
                             .then(()=>res.status(200).json("2: sensorDate is update"))
                             .catch((err)=>{res.status(400).json(`2: sensorDate is not update  ${err}`)});
                    }
                    
                                   //  add sensor

                  
                             const sensor= new Sensor({
                             userid:sensorFound.userid,
                             temp:tempVal,
                             createdDate:timeDate,
                             updatedDate:null,
                           })
                        const sensorSave = await sensor.save()
                           try{
                           //get the sensor logid 
                        const sensorLogid =sensorSave._id;
                        //save this log id into temp logid 
                        tempUpdate.logid=sensorLogid;
                        //update the temp table
                        tempUpdate.save()
                        .then(()=>res.status(200))
                        .catch((err)=>res.status(400).json(err));
                            res.status(200).json('sensor is saved');
                           }
                           catch(err){
                             res.status(400).json("sensor not save")
                           }
                    

                  }
                }
                catch(err){
                      res.status(400).json(`temp not found ${err}`);
            }
            
           
            
            
            
            //call a log  
            /*  
            try{
                logger.info({
                  'temp':tempVal,
                  'created_at':timeDate
                });
                res.status(200).json('data is updated');
              }
              catch(err){
               res.status(400).json(`not update : ${err}`);
              }
           */
           
                   
  }
  catch(err){
      res.status(200).send("temp not found")
  }  
   
   /*.then(
        temprature=>{
            temprature.temp=tempVal
           temprature.save()
           .then((mess)=>res.status(200).json("temprature is updated"))
           .catch((err)=>res.status(400).json("sorry! temprature istemp not found
    .catch((err)=>res.status(400).json("Temp not found"));
*/
});



// add temprature


router.route('/addtemp').post(async (req,res)=>{
      
    const{error} =await tempSchema.validateAsync(req.body);
      if(error){
        return res.status(400).send(error.details[0].message);
        }
        
    
   const newtemp=new Temprature({
      userid:req.body.userid,
      temp:req.body.temp
   })
   
   await newtemp.save()
    .then((mssg)=>res.status(200).json("temp is saved"))
    .catch((err)=>res.status(400).json(`sorry ${err}`));
});




// get temprature list

router.route('/').get(async (req,res)=>{
   const userid =req.body.userid;
   
    await Temprature.find({userid:userid})
    .then((temp)=>res.status(200).send(temp))
    .catch((err)=>res.status(400).json(`list not found ${err}`));

});

// get sigle temprature record

router.route('/:id').get(async (req,res)=>{
   const tempId =req.params.id;
        await Temprature.findOne({_id:tempId})
        .then((temp)=>{res.status(200).send({
             _id:temp.user_id,
             temprature:temp.temp            
        })})
        .catch((err)=>{res.status(400).send("temp not found",err)})
})

module.exports=router;