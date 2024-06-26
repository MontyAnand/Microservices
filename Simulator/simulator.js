const fs = require('fs');
const readline = require('readline');

// Create a read stream from the file
const fileStream = fs.createReadStream('./TSLA/TSLA.csv');

const processLine = (data)=>{
    const datalist = data.split(',');
    return {
        open:parseFloat(datalist[1]),
        high: parseFloat(datalist[2]),
        low: parseFloat(datalist[3]),
        close: parseFloat(datalist[4]),
        volume: parseFloat(datalist[5])
    }
}

const list = [];
// Create an interface to read the file line by line
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

// Event listener for when a line is read
rl.on('line', (line) => {
    list.push(processLine(line));
});

// Event listener for when the file is completely read

let i=0;

rl.on('close', () => {
    console.log('File reading completed.');
    (()=>{
        const interval = setInterval(()=>{
            if(i == list.length){
                clearInterval(interval);
                return;
            }
            list[i].timeStamp = Date.now();
            console.log(list[i]);
            i++;
        },3000);
    })();
});




