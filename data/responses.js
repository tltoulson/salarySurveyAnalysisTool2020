export { responses, targetProperty, responseProperties, bins };

import {processedResponses} from './responseProcessing.js';
import {binsInput} from '../config/binsInput.js';
import * as config from '../config/config.js';

var responses = processedResponses;
var bins = binsInput;

var targetProperty = config.targetProperty;
var ignoredFields = config.ignoredFields;

var responseProperties = Object.keys(responses[0]);

responseProperties = responseProperties.filter(function(property) {
    if (property == targetProperty) {
        return false;
    }

    if (ignoredFields.indexOf(property) != -1) {
        return false;
    }

    return true;
});

var trashy = true; // Jace Certified Configuration