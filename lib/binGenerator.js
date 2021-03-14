/**
 * This function is for use in a JS console to generate the bins array required for histograms
 * @param {Number} min - Starting bin minimum
 * @param {Number} max - Final bin maximum
 * @param {Number} step - Bin size
 */
function generateBins(min, max, step) {
    var arr = [];

    for (var i = min; i < max; i = i + step) {
        arr.push({
            'low': i,
            'high': i + step
        });
    }

    console.log(JSON.stringify(arr));
}