export { 
    calculateMean,
    calculateSum,
    calculateVariancePopulation, 
    calculateVarianceSample,
    calculateProbability,
    getValuesFromSamples,
    calculateQuartile,
    SplitCriteria,
    getSplitCriteria,
    calculateStDevPopulation,
    calculateAnovaEtaSquared,
    calculateAnovaF,
    calculateAnovaFCrit,
    calculateCohensD
}

import { lookupFCritical } from './ftable.js';

/**
 * Calculate the mean or average of a set of values
 * @param {Number[]} values - A set of values represented as an array of numbers
 * @returns {Number} - The mean or average of the sample data set
 */
function calculateMean(values) {
    var numberOfValues = values.length;
    var sumOfValues = values.reduce(function(sum, current) {
        return sum + current;
    }, 0);

    return sumOfValues / numberOfValues;
}

function calculateSum(values) {
    return values.reduce(function(sum, next) {
        return sum + next;
    }, 0);
}

/**
 * Calculate the population variance of a set of values
 * @param {Number[]} values - A set of values represented as an array of numbers
 * @returns {Number} - The population variance of the set of values
 */
function calculateVariancePopulation(values) {
    var numberOfValues = values.length;
    var sampleMean = calculateMean(values);
    var variance = values.reduce(function(sum, current) {
        return sum + (Math.pow(current - sampleMean, 2) / numberOfValues);
    }, 0);

    return variance;
}

function calculateStDevPopulation(values) {
    return Math.sqrt(calculateVariancePopulation(values));
}

/**
 * Calculate the sample variance of a set of values using Bessel's Correction
 * @param {Number[]} values - A set of values represented as an array of numbers
 * @returns {Number} - The sample variance of the set of values using Bessel's Correction
 */
function calculateVarianceSample(values) {
    var numberOfValues = values.length;
    var sampleMean = calculateMean(values);
    var variance = values.reduce(function(sum, current) {
        return sum + (Math.pow(current - sampleMean, 2) / (numberOfValues - 1));
    }, 0);

    return variance;
}

/**
 * Calculate the probability of an event occuring in a sample set of possible outcomes
 * @param {Number} numberOfEvents - Number of events in a sample of which to calculate the liklihood
 * @param {Number} numberOfPossibleOutcomes - Total number of possible outcomes including the number of events
 * @returns {Number} - Probability of the event occuring in the sample set
 */
function calculateProbability(numberOfEvents, numberOfPossibleOutcomes) {
    return numberOfEvents / numberOfPossibleOutcomes;
}

/**
 * Calculate the Quartile value given a set of numbers
 * @param {Number[]} values - A set of values represented as an array of numbers 
 * @param {Number} quartile - Decimal value representing the quartile value to reutrn Q1 - .25, Median - .5, Q3 - .75
 * @returns {Number} - The quartile value of the set
 */
function calculateQuartile(values, quartile) {
    var sortedValues = values.sort(function(a,b) {
        return a - b;
    });

    var pos = ((sortedValues.length) - 1) * quartile;
    var base = Math.floor(pos);
    var rest = pos - base;
    if( (sortedValues[base+1]!==undefined) ) {
      return sortedValues[base] + rest * (sortedValues[base+1] - sortedValues[base]);
    } else {
      return sortedValues[base];
    }
  }

/**
 * Utility function to extract an array of numbers from an array of objects
 * @param {Object[]} samples - Array of objects where each object represents a row in a sample data set 
 * @param {String} targetValueProperty - Name of the property on each sample data set to extract into the set of values
 * @returns {Number[]} - Set of values represented as an array of numbers
 */
function getValuesFromSamples(samples, targetValueProperty) {
    return samples.map(function (sample) {
        return sample[targetValueProperty];
    });
}

/**
 * Groups a sample data set into classes returned by a group function
 * @param {Object[]} samples - Array of objects where each object represents a row in a sample data set 
 * @param {String} attribute - Attribute on which to group a sample data set
 * @returns {Object} - Object where each property is a class name the data set has been split into and contains an array of the sample data in the group
 */
function groupSamplesByAttribute(samples, attribute, fn) {
    var groupedSamples = {};

    samples.forEach(function(sample) {
        var group;
        
        if (fn) {
            group = fn(sample, attribute);
        }
        else {
            group = sample[attribute];
        }

        groupedSamples[group] = groupedSamples[group] || [];
        groupedSamples[group].push(sample);
    });

    return groupedSamples;
}

/**
 * 
 * @param {*} samples - Array of objects where each object represents a row in a sample data set 
 * @param {*} predictorAttribute - Predictor attribute of a sample object
 * @param {*} targetAttribute - Target attribute of a sample object
 * @returns {Number} - Resulting variance calculated by splitting a data set on a given predictor property for a given target property
 */
function calculateTwoAttributeVariance(samples, predictorAttribute, targetAttribute) {
    var numberOfTotalSamples = samples.length;
    var sampleGroups = groupSamplesByAttribute(samples, predictorAttribute);

    return Object.values(sampleGroups).reduce(function(sum, sampleGroup) {
        var values = getValuesFromSamples(sampleGroup, targetAttribute);
        var numberOfGroupSamples = sampleGroup.length;
        var probabilityOfGroup = calculateProbability(numberOfGroupSamples, numberOfTotalSamples);
        var varianceOfGroup = calculateVariancePopulation(values);

        return sum + (probabilityOfGroup * varianceOfGroup);
    }, 0);
}

function calculateTwoAttributeStDev(samples, predictorAttribute, targetAttribute) {
    var numberOfTotalSamples = samples.length;
    var sampleGroups = groupSamplesByAttribute(samples, predictorAttribute);

    return Object.values(sampleGroups).reduce(function(sum, sampleGroup) {
        var values = getValuesFromSamples(sampleGroup, targetAttribute);
        var numberOfGroupSamples = sampleGroup.length;
        var probabilityOfGroup = calculateProbability(numberOfGroupSamples, numberOfTotalSamples);
        var varianceOfGroup = calculateVariancePopulation(values);

        return sum + (probabilityOfGroup * Math.sqrt(varianceOfGroup));
    }, 0);
}

function calculateTwoAttributeMeanShift(samples, predictorAttribute, targetAttribute) {
    var numberOfTotalSamples = samples.length;
    var sampleGroups = groupSamplesByAttribute(samples, predictorAttribute);
    var sampleMean = calculateMean(getValuesFromSamples(samples, targetAttribute));

    return Object.values(sampleGroups).reduce(function(sum, sampleGroup) {
        var values = getValuesFromSamples(sampleGroup, targetAttribute);
        var numberOfGroupSamples = sampleGroup.length;
        var probabilityOfGroup = calculateProbability(numberOfGroupSamples, numberOfTotalSamples);
        var meanShift = Math.abs(calculateMean(values) - sampleMean);

        return sum + (probabilityOfGroup * meanShift);
    }, 0);
}

function calculateTwoAttributeMedianShift(samples, predictorAttribute, targetAttribute) {
    var sampleGroups = groupSamplesByAttribute(samples, predictorAttribute);
    var numberOfTotalSamples = samples.length;
    var minMedian = Infinity;
    var maxMedian = -Infinity;
    var minProbability = Infinity;

    Object.values(sampleGroups).forEach(function(sampleGroup) {
        var values = getValuesFromSamples(sampleGroup, targetAttribute);
        var numberOfGroupSamples = sampleGroup.length;
        var probabilityOfGroup = calculateProbability(numberOfGroupSamples, numberOfTotalSamples);
        var median = calculateQuartile(values, 0.5);
        

        minMedian = Math.min(minMedian, median);
        maxMedian = Math.max(maxMedian, median);
        minProbability = Math.min(minProbability, probabilityOfGroup);
    }, 0);

    return  (maxMedian - minMedian) * minProbability;
}

function classifyByValueSplit(value) {
    return function(sample, attribute) {
        if (sample[attribute] > value) {
            return 'greaterThan';
        }
        else {
            return 'lessThanOrEqual';
        }
    }
}

function calculateGiniImpurity(sampleGroup, targetAttribute, splitValue) {
    var targetGroups = groupSamplesByAttribute(sampleGroup, targetAttribute, classifyByValueSplit(splitValue));
    var totalSamples = sampleGroup.length;

    return Object.values(targetGroups).reduce(function(total, targetGroup) {
        var classProbability = calculateProbability(targetGroup.length, totalSamples);

        return total - Math.pow(classProbability, 2);
    }, 1);
}

function calculateSplitGiniImpurity(samples, predictorAttribute, targetAttribute, splitValue) {
    var numberOfTotalSamples = samples.length;
    var sampleGroups = groupSamplesByAttribute(samples, predictorAttribute);

    return Object.values(sampleGroups).reduce(function(sum, sampleGroup) {
        var numberOfGroupSamples = sampleGroup.length;
        var probabilityOfGroup = calculateProbability(numberOfGroupSamples, numberOfTotalSamples);
        var giniImpurityOfGroup = calculateGiniImpurity(sampleGroup, targetAttribute, splitValue);

        return sum + (probabilityOfGroup * giniImpurityOfGroup);
    }, 0);
}

function calculateMedianSplitGiniImpurity(samples, predictorAttribute, targetAttribute) {
    var sampleValues = getValuesFromSamples(samples, targetAttribute);
    var median = calculateQuartile(sampleValues, 0.5);
    return calculateSplitGiniImpurity(samples, predictorAttribute, targetAttribute, median);
}

function calculateMeanSplitGiniImpurity(samples, predictorAttribute, targetAttribute) {
    var sampleValues = getValuesFromSamples(samples, targetAttribute);
    var mean = calculateMean(sampleValues);
    return calculateSplitGiniImpurity(samples, predictorAttribute, targetAttribute, mean);
}

function calculateBestSplitGiniImpurity(samples, predictorAttribute, targetAttribute) {
    var percentiles = [.25, .33, .5, .66, .75];
    //var percentiles = [.1, .2, .3, .4, .5, .6, .7, .8, .9];
    var bestGini = Infinity;
    var bestSplit = undefined;
    var sampleValues = getValuesFromSamples(samples, targetAttribute);

    percentiles.forEach(function(percentile) {
        var splitValue = calculateQuartile(sampleValues, percentile);
        var gini = calculateSplitGiniImpurity(samples, predictorAttribute, targetAttribute, splitValue);

        if (gini < bestGini) {
            bestGini = gini;
            bestSplit = splitValue;
        }
    });

    console.log(`${predictorAttribute}: ${bestSplit}`);
    return bestGini;
}

function getTrimmedRangeFunction(startPercentile, endPercentile) {
    return function calculateTrimmedRange(samples, predictorAttribute, targetAttribute) {
        var numberOfTotalSamples = samples.length;
        var sampleGroups = groupSamplesByAttribute(samples, predictorAttribute);

        return Object.values(sampleGroups).reduce(function(sum, sampleGroup) {
            var values = getValuesFromSamples(sampleGroup, targetAttribute);
            var numberOfGroupSamples = sampleGroup.length;
            var probabilityOfGroup = calculateProbability(numberOfGroupSamples, numberOfTotalSamples);
            var rangeOfGroup = calculateQuartile(values, endPercentile) - calculateQuartile(values, startPercentile);

            return sum + (probabilityOfGroup * rangeOfGroup);
        }, 0);

    }
}

function calculateAnovaF(samples, predictorAttribute, targetAttribute) {
    var valuesPop = getValuesFromSamples(samples, targetAttribute);
    var meanPop = calculateMean(valuesPop);
    var sampleGroups = Object.values(groupSamplesByAttribute(samples, predictorAttribute));

    var ssBetween = sampleGroups.reduce(function(sum, sampleGroup) {
        var values = getValuesFromSamples(sampleGroup, targetAttribute);
        var meanSample = calculateMean(values);
        var n = values.length;

        return sum + (n * Math.pow(meanSample - meanPop, 2));
    }, 0);

    var dfBetween = (sampleGroups.length - 1);
    var msBetween = ssBetween / dfBetween;

    var ssWithin = sampleGroups.reduce(function(sum, sampleGroup) {
        var values = getValuesFromSamples(sampleGroup, targetAttribute);
        var meanSample = calculateMean(values);
        return sum + values.reduce(function(sum, value) {
            return sum + Math.pow(value - meanSample, 2);
        }, 0);
    }, 0);

    var dfWithin = sampleGroups.reduce(function(sum, sampleGroup) {
        return sum + sampleGroup.length; 
    }, 0) - sampleGroups.length;

    var msWithin = ssWithin / dfWithin;

    var fStatistic = msBetween / msWithin;

    if (isNaN(fStatistic)) {
        return 0;
    }
    else {
        return fStatistic;
    }
}

function calculateAnovaEtaSquared(samples, predictorAttribute, targetAttribute) {
    var valuesPop = getValuesFromSamples(samples, targetAttribute);
    var meanPop = calculateMean(valuesPop);
    var sampleGroups = Object.values(groupSamplesByAttribute(samples, predictorAttribute));

    var ssWithin = sampleGroups.reduce(function(sum, sampleGroup) {
        var values = getValuesFromSamples(sampleGroup, targetAttribute);
        var meanSample = calculateMean(values);
        return sum + values.reduce(function(sum, value) {
            return sum + Math.pow(value - meanSample, 2);
        }, 0);
    }, 0);

    var ssTotal = valuesPop.reduce(function(sum, value) {
        return sum + Math.pow(value - meanPop, 2);
    }, 0);

    var etaSquared = ssWithin / ssTotal;

    return etaSquared;
}

function calculateAnovaFCrit(samples, predictorAttribute, targetAttribute) {
    var valuesPop = getValuesFromSamples(samples, targetAttribute);
    var sampleGroups = Object.values(groupSamplesByAttribute(samples, predictorAttribute));

    var dfBetween = (sampleGroups.length - 1);

    var dfWithin = sampleGroups.reduce(function(sum, sampleGroup) {
        return sum + sampleGroup.length; 
    }, 0) - sampleGroups.length;

    return lookupFCritical(dfBetween, dfWithin);
}

function calculateCohensD(samples, predictorAttribute, targetAttribute) {
    var sampleGroups = Object.values(groupSamplesByAttribute(samples, predictorAttribute));

    if (sampleGroups.length != 2) {
        return 'N/A';
    }
    else {
        var sampleValues1 = getValuesFromSamples(sampleGroups[0], targetAttribute);
        var sampleValues2 = getValuesFromSamples(sampleGroups[1], targetAttribute);
        var mean1 = calculateMean(sampleValues1);
        var mean2 = calculateMean(sampleValues2);
        var stDev1 = calculateStDevPopulation(sampleValues1);
        var stDev2 = calculateStDevPopulation(sampleValues2);

        return (mean1 - mean2) / (Math.sqrt((Math.pow(stDev1,2) + Math.pow(stDev2,2)) / 2));
    }
}

function calculateBoxPlotModelResidualSumOfSquares(samples, predictorAttribute, targetAttribute) {
    var sampleValues = getValuesFromSamples(samples, targetAttribute);
    var parentMin = Math.min.apply(null, sampleValues);
    var parentMax = Math.max.apply(null, sampleValues);
    var parentQ2 = calculateQuartile(sampleValues, 0.25);
    var parentMedian = calculateQuartile(sampleValues, 0.5);
    var parentQ3 = calculateQuartile(sampleValues, 0.75);
    var parentAvg = calculateMean(sampleValues);
    var sampleGroups = groupSamplesByAttribute(samples, predictorAttribute);
    var numberOfTotalSamples = samples.length;

    var a = Object.values(sampleGroups).reduce(function(sum, sampleGroup) {
        var numberOfGroupSamples = sampleGroup.length;
        var probabilityOfGroup = calculateProbability(numberOfGroupSamples, numberOfTotalSamples);
        var values = getValuesFromSamples(sampleGroup, targetAttribute);
        var minSquareError = Math.pow(Math.min.apply(null, values) - parentMin, 2);
        var maxSquareError = Math.pow(Math.max.apply(null, values) - parentMax, 2);
        var q2SquareError = Math.pow(calculateQuartile(values, 0.25) - parentQ2, 2);
        var medianSquareError = Math.pow(calculateQuartile(values, 0.5) - parentQ3, 2);
        var q3SquareError = Math.pow(calculateQuartile(values, 0.75) - parentMedian, 2);
        var avgSquareError = Math.pow(calculateMean(values) - parentAvg, 2);

        return sum + (probabilityOfGroup * (minSquareError + maxSquareError + q2SquareError + medianSquareError + q3SquareError + avgSquareError));
    }, 0);
    return a;
}

var SplitCriteria = {
    VARIANCE: 'Variance',
    STDEV: 'Standard Deviation',
    MEANSHIFT: 'Mean Shift',
    MEDIANSHIFT: 'Median Shift',
    GINIMEDIAN: 'Gini Impurity Split on Median',
    GINIMEAN: 'Gini Impurity Split on Mean',
    GINIBEST: 'Gini Impurtiy Split on Best Found Value',
    IQR: 'Interquartile Range',
    IDR: 'Interdecile Range',
    Range80pct: '80th percentile range',
    BOXPLOTSSE: 'Box Plot Sum of Squared Error',
    ANOVAF: 'One Way Anova F Statistic'
};

function getSplitCriteria(fnName) {
    if (fnName == SplitCriteria.VARIANCE) {
        return calculateTwoAttributeVariance;
    }
    else if (fnName == SplitCriteria.STDEV) {
        return calculateTwoAttributeStDev;
    }
    else if (fnName == SplitCriteria.MEANSHIFT) {
        return calculateTwoAttributeMeanShift;
    }
    else if (fnName == SplitCriteria.MEDIANSHIFT) {
        return calculateTwoAttributeMedianShift;
    }
    else if (fnName == SplitCriteria.GINIMEDIAN) {
        return calculateMedianSplitGiniImpurity;
    }
    else if (fnName == SplitCriteria.GINIBEST) {
        return calculateBestSplitGiniImpurity;
    }
    else if (fnName == SplitCriteria.GINIMEAN) {
        return calculateMeanSplitGiniImpurity;
    }
    else if (fnName == SplitCriteria.IQR) {
        return getTrimmedRangeFunction(.25,.75);
    }
    else if (fnName == SplitCriteria.IDR) {
        return getTrimmedRangeFunction(.1,.9);
    }
    else if (fnName == SplitCriteria.Range80pct) {
        return getTrimmedRangeFunction(.2,.8);
    }
    else if (fnName == SplitCriteria.BOXPLOTSSE) {
        return calculateBoxPlotModelResidualSumOfSquares;
    }
    else if (fnName == SplitCriteria.ANOVAF) {
        return calculateAnovaF;
    }

    return calculateTwoAttributeVariance;
}