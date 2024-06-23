const express = require('express');
const app = express();
const {metaData,cachedData} = require('./CachedData/data');
const io = require('socket.io-client');
const loadBalancerServerURL = 'http://localhost:7777';

const socket = io(loadBalancerServerURL, {
  transports: ['websocket'] ,
  reconnectionAttempts: 5,
  timeout: 10000
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from server:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});

socket.on('reconnect_attempt', (attempt) => {
  console.log(`Reconnection attempt #${attempt}`);
});

socket.on('reconnect', (attempt) => {
  console.log(`Successfully reconnected after ${attempt} attempts`);
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection error:', error.message);
});

socket.on('reconnect_failed', () => {
  console.error('Reconnection failed');
});


socket.on('dataFromEngine',(data)=>{
  try {
    if(metaData.has(data.companyId)){
      prev = metaData.get(data.companyId);
      prev['endTime'] = data.timeStamp;
      const list = cachedData.get(data.companyId);
      list.push(data);
      //cachedData.set(companyId,list);
    }
    else{
      metaData.set(data.companyId,{startTime:data.timeStamp,endTime:data.timeStamp});
      cachedData.set(data.companyId,[data]);
    }
    
  } catch (error) {
    //console.log(error);
  }
});

setInterval(()=>{
  console.log('=======================================================');
  metaData.forEach((value,key) => {
    console.log(key," : ",value);
  });
  cachedData.forEach((value,key)=>{
    console.log(key," : ",value);
  });
  const key = metaData.keys().next().value;
  metaData.delete(key);
  cachedData.delete(key);
},60000)

// Example endpoint to handle incoming requests
app.use('/api/:companyId',(req,res)=>{
  const {startTime , endTime } = req.query;
  const companyId  = req.params.companyId;
  if(!metaData.has(companyId)){
    console.log(companyId, metaData.has(companyId))
    return res.status(200).send('Not cached');
  }
  const storedData = metaData.get(companyId);
  if(storedData.startTime > endTime){
    return res.status(200).send('You are requested data is not in cache');
  }
  if(storedData.startTime <= startTime && storedData.endTime >= endTime){
    list  = [];
    const storedList = cachedData.get(companyId); 
    storedList.forEach((data)=>{
      if(startTime<= data.timeStamp && endTime>=data.timeStamp)
      list.push(data);
    })
    return res.status(200).send(list);
  }
  if(storedData.startTime > startTime){
    return res.status(200).send('database Query required');
  }
  return res.status(200).send('let me check'); 
});

// Start the target server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Target server is running on port ${PORT}`);
});
