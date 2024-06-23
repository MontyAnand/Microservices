function randomNormal(mean = 0, stddev = 1) {
    let u1 = 0, u2 = 0;
    // Convert [0,1) to (0,1)
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    // Return the desired normal random value
    return z0 * stddev + mean;
}

function generateOHLCV(initialPrice, initialVolume, mu, sigma, muV, sigmaV, intervals) {
    let price = initialPrice;
    let volume = initialVolume;
    const deltaT = 1 / intervals;
    const epsilon = randomNormal();
    price = price * Math.exp((mu - 0.5 * sigma ** 2) * deltaT + sigma * Math.sqrt(deltaT) * epsilon);
    const epsilonV = randomNormal();
    volume = volume * Math.exp(muV + sigmaV * epsilonV);

    const ans = {
        open: price,
        high : price,
        low : price,
        close : price,
        volume : price
    }

    for (let i = 0; i < intervals; i++) {
        const epsilon = randomNormal();
        price = price * Math.exp((mu - 0.5 * sigma ** 2) * deltaT + sigma * Math.sqrt(deltaT) * epsilon);
        ans.high = Math.max(ans.high,price);
        ans.low = Math.min(ans.low,price);
        ans.close = price
    }

    return ans;

}


module.exports =  generateOHLCV;
