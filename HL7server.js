const net = require('net');

class HL7Server {
    
    constructor(host, port, onHL7v2DataReceive,onServerEnd,onServerConnected) {
        this._onHL7v2DataReceive = onHL7v2DataReceive;
        this._onServerEnd =onServerEnd;
        this._onServerConnect = onServerConnected;
        this._host = host;
        this._port = port;
    };

    start() {
       

        const server = net.createServer((socket) => {
            console.log('Client connected');
            let buffer = '';
            socket.on('data', (data) => {
                // console.log('Received data:', data.toString());
                // Add the data to the buffer
                buffer += data.toString().replace(/\n/g, '\r'); // Replace LF with CR
                // Split the buffer into individual messages
                const messages = buffer.split('\r');
                if(messages.length > 1){
                    let hl7Segments =messages.slice(0,messages.length-1);
                    let msghl7v2 = hl7Segments.join('\r');
                    if(this._onHL7v2DataReceive){
                        let fnContext = {socket};
                        this._onHL7v2DataReceive(null, fnContext, msghl7v2);
                    }
                }

                buffer = messages[messages.length - 1];  // Remove the parsed messages from the buffer               
            });
            socket.on('end', () => {
                console.log('Client disconnected');
                if(this._onServerEnd){
                    this._onServerEnd();
                }
            });
        });

        server.listen(this._port, this._host, () => {
            console.log(`Server listening on port ${this._host}:${this._port}`);
            if(this._onServerEnd){
                this._onServerEnd();
            }
        });
    };
}
module.exports = HL7Server;