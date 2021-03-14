export { predictRandom }

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function predictRandom() {
    //return getRandomArbitrary(11315, 425000); // For pure random model
    return getRandomArbitrary(48268, 179214); // For educated random model
}