# vaftp
Voice Assistant File Transfer Protocol: Encodes files verbally and transfer them through the Alexa voice assistant

For more information about this project, see [https://articles.hotelexistence.ca/posts/voiceassistantfiletransferprotocol/](https://articles.hotelexistence.ca/posts/voiceassistantfiletransferprotocol/)

## Introduction

I have created a Voice Assistant File Transfer Protocol for Alexa-powered voice assistants, like the Amazon Echo.  The protocol uses verbal encoding to transfer the file through Alexa - it is not the control an external file transfer application.  I have developed a proof of concept, which includes a client application, a server application, and an Alexa Skill.  The client encodes a binary file as English words, launches an Alexa Skill and verbally sends the data through the PC's speakers to an Amazon Echo device.  The server decodes the words, saves the binary file, and makes it available on the Internet.

## Code

### AWS Skill

The code in this proof of concept requires the creation of a custom AWS skill with the following properties:
- invocation: upload file
- utterance: addbyte {number}
- slot type for number: AMAZON.NUMBER
- end point: The HTTPS endpoint running the *vaftp-server.js* code 

For complete details on creating a skill, see [Amazon's documentation](https://developer.amazon.com/en-US/docs/alexa/custom-skills/steps-to-build-a-custom-skill.html).

### Server

The server application is *vaftp-server.js*.  The server is configured to run on port 8080.  I suggest running on a server, with port 443 exposed to the Internet, running [Apache 2 with a valid certificate](https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-20-04), [configured to proxy port 443 to 8080](https://blog.cloudboost.io/get-apache-and-node-working-together-on-the-same-domain-with-javascript-ajax-requests-39db51959b79).  On an appropriately configured server, run 'npm install' to install the dependencies and launch the server application as follows:

```
node vaftp-server.js
```

The server makes all uploaded files available in the '/files/' subfolder:
https://{yourserver's domain}/files/

### Client

The client application is *vaftp-client.js*.  It uses the [play-sound](https://github.com/shime/play-sound) Node library, which required a command line audio player.  I suggest installing [mpg123](https://www.mpg123.de/).  Run 'npm install' to install the remaining dependencies.

To send a file to the server, place the client computer near an Amazon Echo, ensure the volume is turned up, and run as follows, where filename is the file to be sent:
```
node vaftp-client.js <filename>
```
