const net = require('net');
const fs = require('fs');
let str = fs.readFileSync('./hl7data/test.hl7').toString();
console.log(str);

const client = new net.Socket();
client.connect(5121, 'localhost', () => {
    console.log('Connected to server');
    // Send an HL7v2 message to the server
   // const hl7v2_msg = 'MSH|^~\\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20220101120000||ADT^A01|MSG00001|P|2.3|\rEVN|A01|20220101120000|||\rPID|1||1234567890^^^MRN^MRN||Doe^John^||19700101|M|||123 Main St^^Anytown^CA^12345^USA|||||||\r';
    client.write(str);
});

client.on('data', (data) => {
    console.log('Ack',data.toString());
});

client.on('close', () => {
    console.log('Connection closed');
});