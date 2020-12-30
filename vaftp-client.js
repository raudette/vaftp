const fs = require('fs');
const path = require('path');
const { exit } = require('process');

if (typeof process.argv[2] !== 'undefined') {
    file = process.argv[2]
}
else {
    console.log("Usage: vaftp-client.js <filename>")
    exit(0);
}

let filebuffer=[];
let filebuffername=[];

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
        console.log('Done');
      });
}

function done() {
    exit(0);
}