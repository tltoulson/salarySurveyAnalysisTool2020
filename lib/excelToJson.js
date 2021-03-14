
/**
 * This is a utility function for use in a JS console. To use it:
 *  1. Copy a contiguous group of Excel cells with headers
 *  2. Paste into a text file (should result in Tab separated values)
 *  3. Wrap the text in backticks to create a JS Template literal
 *      ie. var a = `<excel string here>`;
 *  4. Copy the resulting text from step 3 to a JS console like Chrome Web Inspector
 *  5. Hit Enter to execute the statement
 *  6. Copy the getJsonFromExcelString function into the JS console and hit enter
 *  7. In the JS console, type getJsonFromExcelString(a) and hit enter
 *  8. You can now copy the resulting array output in the JS console to the responses.js file in this repo
 * @param {String} str - Tab separated values string with newline representing rows 
 */
function getJsonFromExcelString(str) {
    // Get rows by splitting the string on newline character
    var rows = str.split(/\n/);

    // Get columns by splitting each row on the tab character
    rows = rows.map(function(row) {
        return row.split(/\t/);
    });

    // Convert array of arrays into an array of objects where the first row is the object keys
    var result = [];

    // Skip row zero, it has the keys
    for (var row = 1; row < rows.length; row++) {
        var obj= {};

        for (var col = 0; col <= rows[row].length; col++) {
            obj[rows[0][col]] = rows[row][col];
        }

        result.push(obj);
    }  

    console.log(JSON.stringify(result));
}