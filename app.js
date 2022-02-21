import { createStore } from './lib/store.js';
import * as Actions from './app/actions.js';
import { responsesReducer } from './app/responses.js';
import { filterReducer } from './app/filter.js';
import { getSplitVariances, getHistograms } from './app/selectors.js';
import { histogramSelectedPropertyReducer, histogramConfigReducer } from './app/histogram.js';

import { bins } from './data/responses.js';

import * as Histogram from './components/histogram.js';
import * as PropertyTree from './components/propertyTree.js';
import * as Filter from './components/filter.js';
import * as SalaryTable from './components/salaryTable.js';

import { calculatePermutationImportance, calculateModelMAPE, calculateModelMdAPE } from './validation/index.js';
import { predictModel1 } from './validation/predictModel1.js';
import { predictModel2 } from './validation/predictModel2.js';
import { predictTop3SN } from './validation/predictTop3SN.js';
import { predictTop3IT } from './validation/predictTop3IT.js';
import { predictTop3Total } from './validation/predictTop3Total.js';
import { predictTop3BestFit } from './validation/predictTop3BestFit.js';
import { predictRandom } from './validation/predictRandom.js';
import { predictPostAnalysis } from './validation/predictPostAnalysis.js';
import { predictTraditionalModel } from './validation/predictTraditionalModel.js';

var store = createStore(function(prevState, action) {
    if (!prevState) {
        prevState = {};
    }

    return {
        'responses': responsesReducer(prevState.responses, action),
        'filter': filterReducer(prevState.filter, action),
        'histogramSelectedProperty': histogramSelectedPropertyReducer(prevState.histogramSelectedProperty, action),
        'histogramConfig': histogramConfigReducer(prevState.histogramConfig, action)
    };
});

function getHtmlKey(key) {
    return key.replace(/[^a-zA-Z1-9]/g, "_");
}

class SalaryApp extends HTMLElement {
    connectedCallback() {
        var self = this;

        this.innerHTML = `
            <style>
                .sidebar {
                    width: 33.33%;
                }

                main {
                    width: 66.66%
                }

                .flexRow {
                    display: flex;
                    flex-direction: row;
                }

                .childrenHistograms {
                    flex-wrap: wrap;
                }
            </style>
            <div>
                <salary-filter></salary-filter>
            </div>
            <div class="flexRow">
                <div class="sidebar">
                    <salary-property-tree></salary-property-tree>
                </div>
                <main>
                    <salary-histogram></salary-histogram>
                    <salary-table></salary-table>
                    <div class="flexRow childrenHistograms"></div>
                </main>
            </div>
        `
        this.histogram = this.querySelector('salary-histogram');
        this.childrenHistograms = this.querySelector('.childrenHistograms');
        this.propertyTree = this.querySelector('salary-property-tree');
        this.salaryFilter = this.querySelector('salary-filter');
        this.salaryTable = this.querySelector('salary-table');

        this.propertyTree.onclick = function(evt) {
            store.dispatch(Actions.histogramPropertySelected(evt.target.getAttribute('propertyName')));
        }

        this.childrenHistograms.onclick = function(evt) {
            store.dispatch(Actions.filterAdded(store.getState().histogramSelectedProperty, evt.target.getAttribute('propertyValue')))
        }

        this.salaryFilter.onclick = function(evt) {
            store.dispatch(Actions.filterRemoved(evt.target.getAttribute('propertyName')));
        }

        store.subscribe(function(state, action) {
            self.render(state);
        });
    }

    render(state) {
        if (state.histogramSelectedProperty) {
            // Render parent histogram
            this.histogram.style.display = 'block';
            var self = this;
            var histogramData = getHistograms(state);
            this.histogram.data = histogramData.parent;
            this.histogram.bins = bins;
            this.histogram.title = state.histogramSelectedProperty;
            this.histogram.render();

            // Render children histogram
            this.childrenHistograms.innerHTML = '';
            self.childrenHistograms.insertAdjacentHTML('beforeend', '<h2 style="width: 100%;">Split Histograms</h2>');
            Object.keys(histogramData.children).forEach(function(key) {
                self.childrenHistograms.insertAdjacentHTML('beforeend', `<salary-histogram id="histogram-${getHtmlKey(key)}"></salary-histogram`);
                var histogram = self.childrenHistograms.querySelector(`#histogram-${getHtmlKey(key)}`);
                histogram.data = histogramData.children[key];
                histogram.bins = bins;
                histogram.title = key;
                histogram.render();
            });

            // Render Salary Table
            this.salaryTable.sampleGroups = histogramData.children;
            this.salaryTable.render();
        }
        else {
            this.histogram.style.display = 'none';
        }

        // Render Property Tree
        this.propertyTree.variances = getSplitVariances(store.getState());
        this.propertyTree.render(state);

        // Render Salary Filter
        this.salaryFilter.render(state);
    }
    
}
      
customElements.define('salary-app', SalaryApp);

store.dispatch(Actions.appLoaded());

window.store = store;
window.calculatePermutationImportance = calculatePermutationImportance;
window.calculateModelMAPE = calculateModelMAPE;
window.calculateModelMdAPE = calculateModelMdAPE;
window.predictModel1 = predictModel1;
window.predictModel2 = predictModel2;
window.predictTop3SN = predictTop3SN;
window.predictTop3IT = predictTop3IT;
window.predictTop3Total = predictTop3Total;
window.predictTop3BestFit = predictTop3BestFit;
window.predictRandom = predictRandom;
window.predictPostAnalysis = predictPostAnalysis;
window.predictTraditionalModel = predictTraditionalModel;

window.getAvgRandomMAPE = function() {
    var total = 0;
    var iterations = 100;

    for (var i = 0; i < iterations; i++) {
        total = total + calculateModelMAPE(predictRandom);
    }

    return total / iterations;
}