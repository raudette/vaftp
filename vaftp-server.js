const express = require('express')
const app = express()
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const Alexa = require('ask-sdk-core')
const skillBuilder = Alexa.SkillBuilders.custom();
const fs = require('fs');
var serveIndex = require('serve-index');

let filebuffer=[];
let filebuffername=[];

const LaunchRequestHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
      console.log("Launched")
      const speechText = 'Launching Upload File, the skill for sending verbally encoded files through Alexa.';

      return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .withSimpleCard('Hello World', speechText)
          .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
              || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
      const speechText = 'Goodbye!';

      return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard('Hello World', speechText)
          .withShouldEndSession(true)
          .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
      const speechText = 'Say addbyte and a number to send a byte.  Details on my website at articles.hotelexistence.ca.';

      return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .withSimpleCard('Hello World', speechText)
          .getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
      return true;
  },
  handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);

      return handlerInput.responseBuilder
          .speak('Sorry, I can\'t understand the command. Please say again.')
          .reprompt('Sorry, I can\'t understand the command. Please say again.')
          .getResponse();
  },
};

const AddByteIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'addbyte';
  },
  handle(handlerInput) {
      var asciival = Alexa.getSlotValue(handlerInput.requestEnvelope, 'number')
      var endsession=false
      console.log("Received "+ asciival)
      if (asciival == 2000) {
        speechText = 'Done.  Goodbye.';
        endsession=true
      }
      else {
        speechText = 'Next';
      }
      filebuilder(asciival)

      return handlerInput.responseBuilder
          .speak(speechText)
          //.withSimpleCard('Hello World', speechText)
          .withShouldEndSession(endsession)
          .getResponse();
  }
};


skillBuilder.addRequestHandlers(
  LaunchRequestHandler,
  CancelAndStopIntentHandler,
  HelpIntentHandler,
  AddByteIntentHandler
)

skillBuilder.addErrorHandler(
  ErrorHandler
)

const skill = skillBuilder.create();

const adapter = new ExpressAdapter(skill, false, false);

app.use('/files', express.static(__dirname + '/files'));
app.use('/files', serveIndex(__dirname + '/files'));

app.post('/', adapter.getRequestHandlers());
 

function filebuilder(asciival) {
    if ((asciival>=1000) && (asciival<2000)) {
        filebuffername.push(asciival-1000)
    }
    else if (asciival==2000) {
        writefile()
    }
    else {
        filebuffer.push(asciival)
    }
}

function writefile() {
    var filename="";
    for (var i = 0; i < filebuffername.length; i++) {
        filename = filename+String.fromCharCode(filebuffername[i])
    }
    var data = new Uint8Array(filebuffer.length)
    for (var i = 0; i < filebuffer.length; i++) {
        data[i]=filebuffer[i]
    }
    filepath="./files/"+filename

    if (fs.existsSync(filepath)) {
        var dupefileindex=0;
        while (fs.existsSync(filepath+dupefileindex)) {
            dupefileindex++;
        }
        filepath=filepath+dupefileindex
   
    }

    fs.writeFile(filepath,data,Uint8Array,  function (err) {
        if (err) return console.log(err.message);
        console.log("File '"+filename+"' received. Closing session.")
        //clear arrays
        filebuffer.length=0;
        filebuffername.length=0;
      });
}

app.listen(8080)