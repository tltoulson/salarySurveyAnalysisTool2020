export { processedResponses, getProcessedResponses };

import {responseInput} from '../config/responseInput.js';
import * as config from '../config/config.js';

function adjustScale(responses, property, scale) {
    return responses.map(function(res) {
        res[property] = res[property] / scale;
        return res;
    });
}

function addTotalHoursWorked(responses) {
    return responses.map(function(response) {
        response['Total Hours Worked This Year'] = response['Hours Worked Per Day'] * response['Days Worked This Year'];
        return response;
    });
}

function addNonItExperience(responses) {
    return responses.map(function(response) {
        var totalExp = response['Years of Experience - Total'] * 1;
        var itExp = response['Years of Experience - IT'] * 1;

        if (isNaN(totalExp) || isNaN(itExp)) {
            response['Years of Experience - Non-IT'] = NaN;
        }
        else {
            response['Years of Experience - Non-IT'] = totalExp - itExp;
        }
        
        return response;
    });
}

function addContinuousCalculatedProperties(responses, properties) {
    var propSplits = {};

    // Setup propSplits with property objects
    properties.forEach(function(property) {
        propSplits[property] = {};
    });

    // Compute possible splits for each continuous property
    responses.forEach(function(res) {
        properties.forEach(function(property) {
            res[property] = res[property] * 1;
            var propValue = res[property];
            propSplits[property][propValue] = {
                'value': propValue,
                'gtLabel': `${property} > ${propValue}`,
                'ltLabel': `${property} < ${propValue}`
            };
        });
    });

    // Remove max value for each
    properties.forEach(function(property) {
        var max = -Infinity;

        Object.values(propSplits[property]).forEach(function(split) {
            if (max < split.value) {
                max = split.value;
            }
        });

        delete propSplits[property][max];
    });

    // Build Computed Properties for each response
    return responses.map(function(res) {
        properties.forEach(function(property) {
            Object.values(propSplits[property]).forEach(function(split) {
                if (Number.isNaN(res[property])) {
                    res[split.gtLabel] = '$$DISCARD';
                    return;
                }

                if ((res[property] * 1) > (split.value * 1)) {
                    res[split.gtLabel] = 'Yes';
                }
                else {
                    res[split.gtLabel] = 'No';
                }
            });
        });

        // Remove original continuous properties
        properties.forEach(function(property) {
            delete res[property];
        });

        return res;
    });
}

function addComputedProperties(responses) {
    var computedPropertyNames = Object.keys(config.computedProperties);
    return responses.map(function(response) {
        computedPropertyNames.forEach(function(name) {
            response[name] = config.computedProperties[name](response);
        });

        return response;
    });
}

function removeNonNumericTargetValues(responses, property, removeZero) {
    return responses.filter(function(response) {
        if (isNaN(response[property])) {
            return false;
        }

        if (removeZero && response[property] === 0) {
            return false;
        }

        return true;
    });
}

// When a numeric continuous field is a NaN value, replace it with the median value of the responding population
function inferNumericNanValuesAsMedian(responses) {
    return responses.map(function(response) {
        var property = 'Years of Experience - Total Continuous';
        if (isNaN(response[property])) {
            response[property] = 9;
        }

        property = 'Years of Experience - IT Continuous';
        if (isNaN(response[property])) {
            response[property] = 8;
        }

        property = 'Years of Experience - Non-IT Continuous';
        if (isNaN(response[property])) {
            response[property] = 0;
        }

        property = 'Years of Experience - Non-IT Continuous';
        if (isNaN(response[property])) {
            response[property] = 0;
        }

        property = 'Years of Experience - ServiceNow Continuous';
        if (isNaN(response[property])) {
            response[property] = 5;
        }

        property = 'Years of Experience - Current Employer Continuous';
        if (isNaN(response[property])) {
            response[property] = 2;
        }

        property = 'Years of Experience - Current Role Continuous';
        if (isNaN(response[property])) {
            response[property] = 2;
        }

        property = 'Number of Different Employers Continuous';
        if (isNaN(response[property])) {
            response[property] = 3;
        }

        property = 'Remote Work Percent Continuous';
        if (isNaN(response[property])) {
            response[property] = 40;
        }

        property = 'Hours Worked Per Day Continuous';
        if (isNaN(response[property])) {
            response[property] = 9;
        }

        property = 'Days Worked This Year Continuous';
        if (isNaN(response[property])) {
            response[property] = 243;
        }

        property = 'Years of Military Service Continuous';
        if (isNaN(response[property])) {
            response[property] = 0; // Not median in this case, substituted the most likely value since these individuals were not veterans
        }

        property = 'Total Hours Worked This Year Continuous';
        if (isNaN(response[property])) {
            response[property] = 2070;
        }

        return response;
    });
}


function getProcessedResponses(responseInput) {
    var processedResponses = responseInput;
    processedResponses = addTotalHoursWorked(processedResponses);
    processedResponses = addNonItExperience(processedResponses);
    processedResponses = addComputedProperties(processedResponses);
    processedResponses = inferNumericNanValuesAsMedian(processedResponses);
    processedResponses = addContinuousCalculatedProperties(processedResponses, config.continuousFields);
    processedResponses = adjustScale(processedResponses, config.targetProperty, config.targetScale);
    processedResponses = removeNonNumericTargetValues(processedResponses, config.targetProperty, true);
    return processedResponses;
}

var processedResponses = getProcessedResponses(responseInput);