export { getFilteredResponses, getSplitVariances, getHistograms };

import { responseProperties, targetProperty, responses, bins } from '../data/responses.js';
import { getSplitCriteria, getValuesFromSamples, calculateMean, calculateVariancePopulation, calculateQuartile, calculateAnovaEtaSquared, calculateAnovaF, calculateAnovaFCrit, calculateCohensD } from '../lib/variance.js';
import { countDiscard, splitCriteria, splitSortOrder } from '../config/config.js';

function getFilteredResponses(state, filterOverride) {
    let filter = filterOverride || state.filter;

    function filterResponse(response) {
        for (let i in filter) {
            if (response[i] != filter[i]) {
                return false;
            }
        }

        return true;
    }

    return state.responses.filter(filterResponse);
}

function getSplitVariances(state) {
    let filteredResponses = getFilteredResponses(state);

    let variances = responseProperties.map(function(property) {
        var filteredResponsesLessDiscard = filteredResponses.filter(function(response) {
            if (response[property] == '$$DISCARD') { console.log(property + ': $$DISCARD')}
            return (response[property] != '$$DISCARD') || countDiscard;
        });
        return { 'propertyName': property, 'variance': getSplitCriteria(splitCriteria)(filteredResponsesLessDiscard, property, targetProperty) }
    });

    variances.sort(function(a, b) {
        if (a.variance < b.variance) {
            return -1 * splitSortOrder;
        }
        else if (a.variance > b.variance) {
            return 1 * splitSortOrder;
        }
        else {
            return 0;
        }
    });

    return variances;
}


function _getHistogramResponses(bins, responses, targetProperty) {
    return bins.map(function(bin) {
        return responses.reduce(function(sum, response) {
            if (response[targetProperty] >= bin.low && response[targetProperty] < bin.high) {
                return sum + 1;
            }
            else {
                return sum;
            }
        }, 0);
    });
}

function _getHistogramStats(filteredResponses, targetProperty, selectedProperty) {
    var values = getValuesFromSamples(filteredResponses, targetProperty);
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    var median = calculateQuartile(values, 0.5);

    var stats = {
        'mean': calculateMean(values).toFixed(0),
        'stdev': Math.sqrt(calculateVariancePopulation(values)).toFixed(0),
        'min': min,
        'max': max,
        'median': median,
        'Q1': calculateQuartile(values, 0.25),
        'Q3': calculateQuartile(values, 0.75),
        'count': values.length,
        'withinSalaryRange': 'No'
    };

    var salaryRangeMin = median * .75;
    var salaryRangeMax = median * 1.25;

    if (salaryRangeMin <= min && salaryRangeMax >= max) {
        stats.withinSalaryRange = 'Yes';
    }

    if (selectedProperty) {
        stats.fStatistic = calculateAnovaF(filteredResponses, selectedProperty, targetProperty);
        stats.etaSquared = calculateAnovaEtaSquared(filteredResponses, selectedProperty, targetProperty);
        stats.cohensD = calculateCohensD(filteredResponses, selectedProperty, targetProperty);
        stats.fCritical = calculateAnovaFCrit(filteredResponses, selectedProperty, targetProperty);
    }

    return stats;
}

function getHistograms(state) {
    let filteredResponses = getFilteredResponses(state);
    let parent = {
        'histogram': _getHistogramResponses(bins, filteredResponses, targetProperty),
        'stats': _getHistogramStats(filteredResponses, targetProperty, state.histogramSelectedProperty)
    }
    let children = {};

    filteredResponses.forEach(function(response) {
        let selectedPropertyValue = response[state.histogramSelectedProperty];
        children[selectedPropertyValue] = [];
    });

    Object.keys(children).forEach(function(propertyValue) {
        let filter = Object.assign({
            [state.histogramSelectedProperty]: propertyValue
        }, state.filter);
        filteredResponses = getFilteredResponses(state, filter);
        children[propertyValue] = {
            'histogram': _getHistogramResponses(bins, filteredResponses, targetProperty),
            'stats': _getHistogramStats(filteredResponses, targetProperty)
        };
    });

    return {
        'parent': parent,
        'children': children
    };
}