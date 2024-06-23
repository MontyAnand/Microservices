const net = require('node:net');
class LoadBalancer {
    constructor(configuration){
        /*
        configuration = {
            servers:[
                {
                    host:127.0.0.1,
                    port : 12345
                }
            ]
        }
        */
        this.servers = configuration.servers;
        this.curr = -1;
    }

    getServerInfo(){
        this.curr = (this.curr+1)%((this.servers).length);
        return this.servers[this.curr];
    }
    handleData(data){
        return new Promise((resolve,reject)=>{
            const client = net.createConnection(this.getServerInfo(),()=>{
                client.write(JSON.stringify(data));
            });
            client.on('data',(data)=>{
                resolve(JSON.parse(data.toString()));
                client.end();
            });
            client.on('error',(err)=>{
                reject(err.message);
                client.end();
            });
            client.on('timeout',()=>{
                reject({Error : 'Connection Timed Out'});
                client.end();
            });
            client.on('close',(err)=>{});
        });
    }
}

module.exports = {LoadBalancer};