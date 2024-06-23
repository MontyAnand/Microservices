/*
    structure of entries in metaData :
    key  = companyId
    value = {
        startTime,
        endTime
    }

    structure of entries in cachedData :
    key = companyId
    value = [
    ... ,
    {
        companyId,
        timeStamp, .....
    }
    ]
*/

const metaData = new Map();
const cachedData = new Map();

module.exports = {metaData , cachedData};