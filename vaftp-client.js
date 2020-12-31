const fs = require('fs');
const path = require('path');
const { exit, send } = require('process');
var player = require('play-sound')(opts = {})

if (typeof process.argv[2] !== 'undefined') {
    file = process.argv[2]
}
else {
    console.log("Usage: vaftp-client.js <filename>")
    exit(0);
}

let filebuffer=[];

fs.readFile(file, (err, data) => {
    if (err) {
        console.log(err.message)
        exit(1)
    }
    filename = path.basename(file)
    for (i=0; i<filename.length;i++ ) {
        var tempval=0;
        tempval=filename.charCodeAt(i)
        //let's just use the Ascii characters
        if (tempval<256) {
            //encode filename as values between 1000 and 1255
            tempval=tempval+1000;
            filebuilder(tempval)
        }
    }
    for (i = 0; i < data.length; i++) {
        var tempval=0;
        tempval=data[i]
        filebuilder(tempval)
    }
    //end of file magic value is 2000
    var tempval=2000;
    filebuilder(tempval)
  });

function filebuilder(asciival) {
    console.log(asciival)
    filebuffer.push(asciival)
    if (asciival==2000) {
        launchuploadfileskill()
    }
}

var readytoplaysound = true;
var launched=false
var currentbyte=0;
var currentdigit=0;

function launchuploadfileskill() {
    var soundfiletoplay='';
    //console.log("ready:"+readytoplaysound+" current byte:"+currentbyte+" currentdigit:"+currentdigit)
    if (currentbyte<filebuffer.length) {
        if (readytoplaysound==true) {
            console.log("launched:"+launched+" ready:"+readytoplaysound+" current byte:"+currentbyte+" currentdigit:"+currentdigit)
            readytoplaysound=false
            if (launched==false) {
                launched=true;
                soundfiletoplay='./media/launch.mp3';
            }
            else {
                if (currentdigit==0) {
                    //seems like a waste, but the easiest way to pause 
                    soundfiletoplay='./media/pause.mp3'
                    currentdigit++;        
                }
                else if (currentdigit==1) {
                    soundfiletoplay='./media/addbyte.mp3'
                    currentdigit++;        
                }
                else if (currentdigit==2) {
                    if (filebuffer[currentbyte]>=1000) {
                        soundfiletoplay=getfilename(Math.floor(filebuffer[currentbyte]/1000)%10)
                    }
                    else {
                        readytoplaysound=true; //as there is no digit to be played here
                    }
                    currentdigit++;        
                }
                else if (currentdigit==3) {
                    if (filebuffer[currentbyte]>=100) {
                        soundfiletoplay=getfilename(Math.floor(filebuffer[currentbyte]/100)%10)        
                    }
                    else {
                        readytoplaysound=true; //as there is no digit to be played here
                    }
                    currentdigit++;        
                }
                else if (currentdigit==4) {
                    if (filebuffer[currentbyte]>=10) {
                        soundfiletoplay=getfilename(Math.floor(filebuffer[currentbyte]/10)%10)        
                    }
                    else {
                        readytoplaysound=true; //as there is no digit to be played here
                    }
                    currentdigit++;        
                }
                else if (currentdigit==5) {
                    if (filebuffer[currentbyte]>=0) {
                        soundfiletoplay=getfilename(filebuffer[currentbyte]%10)        
                        currentbyte++;        
                    }
                    currentdigit=0;
                }
            }
            if (soundfiletoplay.length>1) {
                console.log("Playing "+soundfiletoplay)
                player.play(soundfiletoplay, function(err){
                    if (err) throw err
                    readytoplaysound = true;
                })
            }
        }
    }
    if ((readytoplaysound==true)&&(currentbyte==filebuffer.length)) {
        console.log("Done!")
        exit(0)
    }
    else {
        setTimeout(launchuploadfileskill, 100)    
    }
}

function getfilename(number) {
    switch (number) {
        case 0: return './media/zero.mp3'
        case 1: return './media/one.mp3'
        case 2: return './media/two.mp3'
        case 3: return './media/three.mp3'
        case 4: return './media/four.mp3'
        case 5: return './media/five.mp3'
        case 6: return './media/six.mp3'
        case 7: return './media/seven.mp3'
        case 8: return './media/eight.mp3'
        case 9: return './media/nine.mp3'
        default:
          console.log('Error - no match');
          exit(1)  
      }
}