import {histogramMaxY} from '../config/config.js';

class Histogram extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <style>
            salary-histogram {
                display: block;
            }

            salary-histogram .histogramTitle {
                text-align: center;
                cursor: pointer;
            }

            salary-histogram .histogramTitle:hover {
                background-color: #eee;
            }

            salary-histogram .histogramStats {
                padding-left: 1em;
                padding-bottom: 2em;
            }
        </style>
        <div class="histogramTitle" propertyValue=""></div>
        <canvas id="chart" width="400" height="400"></canvas>
        <table class="histogramStats"></tabl>
        `;
        var ctx = this.querySelector('canvas').getContext('2d');
        this._titleEl = this.querySelector('.histogramTitle');
        this._statsEl = this.querySelector('.histogramStats');
        
        this.chart = new Chart(ctx, {
            'type': 'bar',
            'data': {
                'labels': ['25-30', '30-35', '35-40'],
                'datasets': [{
                    'label': 'Salary',
                    'data': [25, 30, 35]
                }]
            },
            'options': {
                'scales': {
                    'yAxes': [
                        {
                            'ticks': {
                                'beginAtZero': true,
                                'suggestedMax': histogramMaxY
                            }
                        }
                    ]
                }
            }
        });
    }

    get data() {
        return this.chart.data.datasets[0].data;
    }

    set data(newValue) {
        //console.log(newValue);
        this.chart.data.datasets[0].data = newValue.histogram;
        this._stats = newValue.stats;
    }

    get bins() {
        return this.chart.data.labels;
    }

    set bins(newValue) {
        this.chart.data.labels = newValue.map(function(bin) {
            return bin.low + '-' + bin.high;
        })
    }

    get title() {
        return this._title;
    }

    set title(newValue) {
        this._title = newValue;
    }

    render() {
        var html = `
            <tr><td><b>Min:</b></td><td>${this._stats.min}</td></tr>
            <tr><td><b>Q1:</b></td><td>${this._stats.Q1}</td></tr>
            <tr><td><b>Median:</b></td><td>${this._stats.median}</td></tr>
            <tr><td><b>Q3:</b></td><td>${this._stats.Q3}</td></tr>
            <tr><td><b>Max:</b></td><td>${this._stats.max}</td></tr>
            <tr><td><b>Average:</b></td><td>${this._stats.mean}</td></tr>
            <tr><td><b>Stdev:</b></td><td>${this._stats.stdev}</td></tr>
            <tr><td><b>Count:</b></td><td>${this._stats.count}</td></tr>
            <tr><td><b>Within Salary Range (50%):</b></td><td>${this._stats.withinSalaryRange}</td></tr>
        `;

        if (this._stats.fStatistic) {
            html += `
            <tr><td><b>F Statistic:</b></td><td>${this._stats.fStatistic.toFixed(2)}</td></tr>
            `
        }

        if (this._stats.fCritical) {
            html += `
            <tr><td><b>F Critical:</b></td><td>${this._stats.fCritical}</td></tr>
            `
        }

        /*if (this._stats.etaSquared) {
            html += `
            <tr><b>Eta Squared: </b> ${this._stats.etaSquared.toFixed(4)}</tr>
            `
        }*/

        if (this._stats.cohensD) {
            html += `
            <tr><td><b>Cohen's D:</b></td><td>${Math.abs(this._stats.cohensD)}</td></tr>
            `
        }

        this._titleEl.innerText = this._title;
        this._titleEl.setAttribute('propertyValue', this._title);
        this._statsEl.innerHTML = html;
        this.chart.update();
    }
}
      
customElements.define('salary-histogram', Histogram);