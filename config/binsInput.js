export {binsInput};

import {targetScale} from './config.js';

// Manual Bins - Linear Scale
//var binsInput = [{"low":10000,"high":20000},{"low":20000,"high":30000},{"low":30000,"high":40000},{"low":40000,"high":50000},{"low":50000,"high":60000},{"low":60000,"high":70000},{"low":70000,"high":80000},{"low":80000,"high":90000},{"low":90000,"high":100000},{"low":100000,"high":110000},{"low":110000,"high":120000},{"low":120000,"high":130000},{"low":130000,"high":140000},{"low":140000,"high":150000},{"low":150000,"high":160000},{"low":160000,"high":170000},{"low":170000,"high":180000},{"low":180000,"high":190000},{"low":190000,"high":200000},{"low":200000,"high":210000},{"low":210000,"high":220000},{"low":220000,"high":230000},{"low":230000,"high":240000},{"low":240000,"high":250000},{"low":250000,"high":260000},{"low":260000,"high":270000},{"low":270000,"high":280000},{"low":280000,"high":290000},{"low":290000,"high":300000},{"low":300000,"high":310000},{"low":310000,"high":320000},{"low":320000,"high":330000},{"low":330000,"high":340000},{"low":340000,"high":350000},{"low":350000,"high":360000},{"low":360000,"high":370000},{"low":370000,"high":380000},{"low":380000,"high":390000},{"low":390000,"high":400000},{"low":400000,"high":410000},{"low":410000,"high":420000},{"low":420000,"high":430000}];

// Manual Bins - Logarithmic at 1.2x coumpound
//var binsInput = [{"low":10000,"high":"12000"},{"low":"12000","high":"14400"},{"low":"14400","high":"17280"},{"low":"17280","high":"20736"},{"low":"20736","high":"24883"},{"low":"24883","high":"29860"},{"low":"29860","high":"35832"},{"low":"35832","high":"42998"},{"low":"42998","high":"51598"},{"low":"51598","high":"61918"},{"low":"61918","high":"74302"},{"low":"74302","high":"89162"},{"low":"89162","high":"106994"},{"low":"106994","high":"128393"},{"low":"128393","high":"154072"},{"low":"154072","high":"184886"},{"low":"184886","high":"221863"},{"low":"221863","high":"266236"},{"low":"266236","high":"319483"},{"low":"319483","high":"383380"},{"low":"383380","high":"460056"}];

// Manual Bins - Logarithmic at 1.5x compound
//var binsInput = [{"low":10000,"high":"15000"},{"low":"15000","high":"22500"},{"low":"22500","high":"33750"},{"low":"33750","high":"50625"},{"low":"50625","high":"75938"},{"low":"75938","high":"113907"},{"low":"113907","high":"170861"},{"low":"170861","high":"256292"},{"low":"256292","high":"384438"},{"low":"384438","high":"576657"}];

// Manual Bins - Logarithmic at 1.3x compound
var binsInput = [{"low":10000,"high":"13000"},{"low":"13000","high":"16900"},{"low":"16900","high":"21970"},{"low":"21970","high":"28561"},{"low":"28561","high":"37129"},{"low":"37129","high":"48268"},{"low":"48268","high":"62748"},{"low":"62748","high":"81572"},{"low":"81572","high":"106044"},{"low":"106044","high":"137857"},{"low":"137857","high":"179214"},{"low":"179214","high":"232978"},{"low":"232978","high":"302871"},{"low":"302871","high":"393732"},{"low":"393732","high":"511852"}];

// Freedman-Diaconis rule bins
//var binsInput = [{"low":11315,"high":38461.31},{"low":38461.31,"high":65607.62},{"low":65607.62,"high":92753.93},{"low":92753.93,"high":119900.23999999999},{"low":119900.23999999999,"high":147046.55},{"low":147046.55,"high":174192.86},{"low":174192.86,"high":201339.16999999998},{"low":201339.16999999998,"high":228485.47999999998},{"low":228485.47999999998,"high":255631.78999999998},{"low":255631.78999999998,"high":282778.1},{"low":282778.1,"high":309924.41},{"low":309924.41,"high":337070.72},{"low":337070.72,"high":364217.02999999997},{"low":364217.02999999997,"high":391363.33999999997},{"low":391363.33999999997,"high":418509.64999999997},{"low":418509.64999999997,"high":445655.95999999996}];

binsInput = binsInput.map(function(bin) {
    bin.low = (bin.low / targetScale).toFixed(0);
    bin.high = (bin.high / targetScale).toFixed(0);
    return bin;
});


function createMultiplicativeBins() {
    var min = 10000;
    var max = 425000;
    var scalingFactor = 1.2;
    var low;
    var high = min;
    var bins = [];

    while (high <= max) {
        low = high;
        high = (low * scalingFactor).toFixed(0);
        bins.push({ 'low': low, 'high': high });
    }

    console.log(JSON.stringify(bins));
}