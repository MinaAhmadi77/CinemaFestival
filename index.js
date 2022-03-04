const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app =express();
const fs = require('fs');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');

/* * * * *
 * IBM CLOUD: Use the following code only to
 * authenticate to IBM Cloud.
 * * * * */

const { IamAuthenticator } = require('ibm-watson/auth');
const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: 'D9wd7ur-TAJNTjocitJqjLIoCedsGB7zJsKRtMLHyWLd',
  }),
  serviceUrl: 'https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/7bf40b64-05cd-4672-ad42-570fc09c73fa',
});

app.use(
    bodyParser.urlencoded({
        extended: true,
        limit :"30mb"
    })
);
app.use(express.static("public"));
app.set("view engine","ejs");
app.listen(8080,function(){
    console.log("server started");
});
var movie = require(__dirname+"/movie");
var comment = require(__dirname+"/comment.js");
app.get("/showComments/:id",function(req,res){
    var id = req.params.id
    comment.find({movieid:id}).exec(function(error,comments){
        if(!error){
            res.render("comment",{comments:comments})
        }
    })

});
app.get("/",function(req,res){
    res.render("home")
});
app.get("/addMovie",function(req,res){
    const mov =new movie(
        {
            Id: 1,
            name:"Mina" ,
            director: "erfan",
            poster: "google.com"
        }
    );
    mov.save();   
    
});
app.post("/addComment/:id",function(req,res){
    console.log(req.params.id)
    const params = {
        objectMode: true,
        contentType: 'audio/mp3',
        model: 'en-US_BroadbandModel',
        
        maxAlternatives: 1,
      };
      
      // Create the stream.
      const recognizeStream = speechToText.recognizeUsingWebSocket(params);
      
      // Pipe in the audio.
      fs.createReadStream(__dirname+'/commentfile/'+req.body.text).pipe(recognizeStream);
      
      
      recognizeStream.on('data', function(event) { onEvent('Data:', event); });
      recognizeStream.on('error', function(event) { onEvent('Error:', event); });
      recognizeStream.on('close', function(event) { onEvent('Close:', event); });
      
      // Display events on the console.
      function onEvent(name, event) {
          
          console.log(name, JSON.stringify(event, null, 2));
          if(name=='Data:'){
            const com =new comment(
                {
                    Id: 1,
                    movieid:req.params.id,
                    text:event.results[0].alternatives[0].transcript,
                }
            );
            com.save();   
            res.redirect("/showMovie")
          }
         
      };
   
    
    
});
app.get("/addComments/:id",function(req,res){

    res.render("addComments",{id:req.params.id})
    console.log(req.params.id)

});

app.get("/showMovie",function(req,res){
    movie.find({}).exec(function(error,movies){
        if(!error){
            res.render("page",{movies:movies})
        }
    })
    
    
});




mongoose.connect(
    "mongodb+srv://mina412:minaahmadi77@project.itbja.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);