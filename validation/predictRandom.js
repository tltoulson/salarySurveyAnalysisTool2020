export { predictRandom }

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function predictRandom() {
    return getRandomArbitrary(1500, 571781); // For pure random model
    //return getRandomArbitrary(62748, 232978); // For educated random model
}