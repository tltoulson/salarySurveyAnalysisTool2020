function getTableCell(it) {
    return `<td>${it}</td>`;
}

function getTableRow(array) {
    var row = array.reduce(function(row, it) {
        return row + getTableCell(it);
    }, '');
    return row;
}

class SalaryTable extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <table class="salaryTable" propertyValue=""></table>
        `;
        this._table = this.querySelector('.salaryTable');
    }

    get sampleGroups() {
        return this._sampleGroups;
    }

    set sampleGroups(newValue) {
        this._sampleGroups = newValue;
    }

    render() {
        var rows = {
            'min': [],
            'q1': [],
            'median': [],
            'q3': [],
            'max': [],
            'average': [],
            'count': [],
            'stdev': [],
            'cv': [],
            'isWithinSalaryRange': []
        };

        var properties = Object.keys(this._sampleGroups);

        properties.forEach(function(property) {
            var stdev = this._sampleGroups[property].stats.stdev;
            var mean = this._sampleGroups[property].stats.mean;
            var cv = ((stdev / mean) * 100).toFixed(0);
            rows.min.push(this._sampleGroups[property].stats.min);
            rows.q1.push(this._sampleGroups[property].stats.Q1);
            rows.median.push(this._sampleGroups[property].stats.median);
            rows.q3.push(this._sampleGroups[property].stats.Q3);
            rows.max.push(this._sampleGroups[property].stats.max);
            rows.average.push(mean);
            rows.count.push(this._sampleGroups[property].stats.count);
            rows.stdev.push(stdev);
            rows.cv.push(cv);
            rows.isWithinSalaryRange.push(this._sampleGroups[property].stats.withinSalaryRange);
        }, this);

        this._table.innerHTML = `
            <h2>Summary Data</h2>
            <tr><td></td> ${ getTableRow(properties) }</tr>
            <tr><td>Min</td> ${ getTableRow(rows.min) }</tr>
            <tr><td>Q1</td> ${ getTableRow(rows.q1) }</tr>
            <tr><td>Median</td> ${ getTableRow(rows.median) }</tr>
            <tr><td>Q3</td> ${ getTableRow(rows.q3) }</tr>
            <tr><td>Max</td> ${ getTableRow(rows.max) }</tr>
            <tr><td>Average</td> ${ getTableRow(rows.average) }</tr>
            <tr><td>Count</td> ${ getTableRow(rows.count) }</tr>
            <tr><td>StDev</td> ${ getTableRow(rows.stdev) }</tr>
            <tr><td>Coefficient of Variation</td> ${ getTableRow(rows.cv) }</tr>
            <tr><td>Within Salary Range (50%)</td> ${ getTableRow(rows.isWithinSalaryRange) }</tr>
        `;
    }
}
      
customElements.define('salary-table', SalaryTable);