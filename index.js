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
/**
 * speech to text
 */
const { IamAuthenticator } = require('ibm-watson/auth');
const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: 'D9wd7ur-TAJNTjocitJqjLIoCedsGB7zJsKRtMLHyWLd',
  }),
  serviceUrl: 'https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/7bf40b64-05cd-4672-ad42-570fc09c73fa',
});
/**
 * natural language understanding
 */
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2021-08-01',
  authenticator: new IamAuthenticator({
    apikey: 'nLmydTwLDwW9M0RrzN1FoAajfhO-MoQ454HBRf2-iPAt',
  }),
  serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/dd5dd53e-0925-4772-945a-e5f7eeb18eba',
});
/**
 * language translator
 */
 const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
 
 const languageTranslator = new LanguageTranslatorV3({
   version: '2018-05-01',
   authenticator: new IamAuthenticator({
     apikey: 'KnaSJk4AiMuNwldvuoWOJFMmClDFODj0gZX1N4E-xb2i',
   }),
   serviceUrl: 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/1a6ea051-f892-4b6e-9c00-51e638f97b53',
 });


app.use(
    bodyParser.urlencoded({
        extended: true,
        limit :"30mb"
    })
);
app.use(express.static("public"));
app.set("view engine","ejs");
app.listen(5000,function(){
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
            
            const analyzeParams = {
                'features': {
                    'keywords': {
                        'sentiment': true,
                        'emotion': true,
                        'limit': 3}
                },
                'text': event.results[0].alternatives[0].transcript
              };
              naturalLanguageUnderstanding.analyze(analyzeParams)
              .then(analysisResults => {
                console.log(JSON.stringify(analysisResults, null, 2));
                if(analysisResults.result.keywords[0].emotion.anger<0.4){
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
                
              })
              .catch(err => {
                console.log('error:', err);
              });
            
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