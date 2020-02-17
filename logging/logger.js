const {createLogger,transports,format}=require('winston');
require('winston-mongodb');
require('dotenv').config();



//create logger 
const logger= createLogger({
  transports:[

    // show log on the console
    /*  new transports.Console({
          level:'info',
          format:format.simple()
      }),
      */
     
   /*   new transports.File({          //save log into info.log file
          filename:'./logging/loginfo.log',
          level:this.info,
          format:format.combine(format.timestamp(),format.simple())
      }),*/

      //save log to mongo db
      new transports.MongoDB({
          db:process.env.CONNECTION_STRING,
          options:{useUnifiedTopology:true,useNewUrlParser:true},
          format:format.combine(format.timestamp(),format.json()),
          collection:'Temprature_log'
          
      })

  ]


})

module.exports=logger;