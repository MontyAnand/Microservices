const {Server} = require('socket.io');
const http = require('node:http');

const server = http.createServer();

const io = new Server(server,{
    transports: ['polling', 'websocket'],
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
      }
});

io.on('connection',(socket)=>{
    console.log('Client Connected : ',socket.id);
});

const generateOHLCV = require('./Calculation');
let companyList = [
    {
        companyId : 'AAPL',
        price : 100,
        volume : 1000,
        count : -1,
        mu : 0.0002,
        sigma:0.01,
        muV : 0.0001,
        sigmaV : 0.01
    },
    {
        companyId : 'MSFT',
        price : 100,
        volume : 1000,
        count : -1,
        mu : 0.0002,
        sigma:0.01,
        muV : 0.0001,
        sigmaV : 0.01
    },
    {
        companyId : 'RS',
        price : 100,
        volume : 1000,
        count : -1,
        mu : 0.0002,
        sigma:0.01,
        muV : 0.0001,
        sigmaV : 0.01
    }
]

const distributeData = (data)=>{
    console.log(data);
    io.emit('incomingData',data);
}

for(let i=0;i<companyList.length;i++){
    setInterval(()=>{
        const result = generateOHLCV(companyList[i].price,companyList[i].volume,companyList[i].mu,companyList[i].sigma,companyList[i].muV,companyList[i].sigmaV,6000);
        const data = {
            companyId : companyList[i].companyId,
            timeStamp : Date.now(),
            timeFrame: companyList[i].count,
            open : result.open,
            high : result.high,
            low : result.low,
            close : result.close,
            volume : result.volume
        };
        distributeData(data);
        companyList[i].count+=1;
        companyList[i].price = result.close;
    },(i+1)*1000);
}


server.listen(54321,()=>{
    console.log('Simulator server is running on 54321...');
})