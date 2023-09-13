// const net = require('net');
// // const hl7 = require('hl7');
const HL7server = require('./HL7server');
const { HL7Message } = require("hl7v2");
const util = require("util");
const fs = require('fs');

const PORT = 5121;
const HOST = '0.0.0.0';

const hl7Parser = new HL7Message();

const filePath = 'log.hl7.txt'
fs.appendFileSync(filePath,`\n \n ========> New Session ${new Date(Date.now()).toLocaleString()}: \n \n`);

const ackPath = './hl7data/ack'
const ack = fs.readFileSync(ackPath,'utf8');

const nackPath = './hl7data/nack'
const nack = fs.readFileSync(ackPath,'utf8');

const logData = (data) => {
    const now = Date.now();
    const localString = new Date(now).toLocaleString();
    let date = `--------------------------------RX-->, ${now} , ${localString} , `;
    console.log(date);
    let str = data.split('\r').join('\n');
    fs.appendFileSync(filePath,['\n',str,'\n'].join('') );
    console.log(str);
}

// Define the template for the callback function
function onHL7v2MsgReceive(err, ctx, hl7v2_msg) {
    if (err) {
        console.error(err);
        return;
    }
    let socket = ctx.socket;
    logData(hl7v2_msg);

    // let hl7 = HL7Message.parse(hl7v2_msg, {
    //     version: '2.4'
    // });
    try {
        let hl7 = hl7Parser.parse(hl7v2_msg);
        let json=hl7Parser.view();
        console.log(util.inspect(json));
        socket.write(ack);  
    } catch (error) {
        console.log(error);
        socket.write(nack);  
    }
}

// Create an instance of the HL7Server class and start the server

const server = new HL7server(HOST, PORT, onHL7v2MsgReceive);
server.start();
