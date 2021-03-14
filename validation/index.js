export { calculatePermutationImportance, calculateModelMAPE };
import { targetProperty } from '../data/responses.js';
import { getProcessedResponses } from '../data/responseProcessing.js';
import {responseInput} from '../config/responseInput.js';
import { predictModel1 } from './predictModel1.js';

var significantProperties = [
    'Age',
    'Benefits - Cross Training Opportunity',
    'Benefits - Dental',
    'Benefits - Free Food / Drink',
    'Benefits - Remote Work',
    'Benefits - Tuition Reimbursement',
    'Benefits - Work From Home Days',
    'Certs - Asset Model Management',
    'Certs - Has No Certs',
    'Certs - Has No CIS',
    'Certs - HR Integrations',
    'Certs - Service Portal',
    'Certs - ServiceNow CIS - IT Service Management',
    'Certs - Total',
    'Certs - Total CIS',
    'Certs - Total Mainline + CIS',
    'Compensation - Percent Fixed',
    'Continent',
    'Country',
    'Country GNI Per Capita',
    'Cultural Majority Self-Identity',
    'Current Job Level',
    'Current Job Role',
    'Days Worked This Year',
    'Ethnic Majority Self-Identity',
    'Gender',
    'Gender Majority Self-Identity',
    'Hours Worked Per Day',
    'Number of Different Employers',
    'Product Score - Applications',
    'Product Score - Applications Continuous',
    'Product Score - Overall',
    'Product Score - Platform Capabilities',
    'Remote Work Percent',
    'Remote Work Percent Continuous',
    'Salary / Hourly',
    'Satisfaction Score',
    'Satisfaction with - Current Employer',
    'Satisfaction with - Current Pay',
    'Satisfaction with - Future Career Prospects',
    'Satisfaction with Current Pay',
    'Skill Score - Dev Overall',
    'Skills - Architectural Design',
    'Skills - Business Rule Development',
    'Skills - Change Management',
    'Skills - Documentation',
    'Skills - Drive and Enthusiasm',
    'Skills - Flexibility / Adaptability',
    'Skills - Front End Development',
    'Skills - Integration Development',
    'Skills - Jelly',
    'Skills - MultiLingual',
    'Skills - Process Design',
    'Skills - Product Demo',
    'Skills - Sales',
    'Skills - Service Catalog Design',
    'Skills - UI Policy Configuration',
    'Skills Score - Architectural',
    'Skills Score - Dev Integration',
    'Skills Score - Dev Overall',
    'Skills Score - Dev Overall Continuous',
    'Skills Score - Management',
    'Skills Score - Sales and Marketing',
    'Skills Score - Soft Skill',
    'Skills Score - Total',
    'Skills Score - Total High Frequency Skills',
    'SN Product - CSM',
    'SN Product - Custom App / ITBM',
    'SN Product - Custom Applications',
    'SN Product - GRC',
    'SN Product - HR Service Delivery',
    'SN Product - ITSM',
    'SN Product - ITSM / Custom App',
    'SN Product - ITSM / ITOM',
    'SN Product - Now Mobile',
    'SN Product - Performance Analytics',
    'SN Product - Predictive Intelligence',
    'SN Product - Service Catalog',
    'SN Product - Virtual Agent',
    'SN Product - Workflow Editor',
    'Statements - My org would be negatively impacted if I left',
    'Total Hours Worked This Year',
    'Years of Experience - IT',
    'Years of Experience - ServiceNow',
    'Years of Experience - Total'
];

function generatePredict(predictionModel) {
    function predict(response, ix) {
        var responseIx = 1,
            idIx = 2, 
            parentIx = 3,
            predictIx = 4,
            curProperty,
            left,
            right,
            selectedNode;
        
        if (!ix) {
            ix = 0;
        }

        left = predictionModel[ix];
        right = predictionModel[ix + 1];
        curProperty = predictionModel[ix][0];

        if (response[curProperty] == left[responseIx]) {
            selectedNode = left;
        }
        else if (response[curProperty] == right[responseIx]) {
            selectedNode = right;
        }
        else {
            console.log(left);
            console.log(right);
            console.log(response[curProperty]);
            console.log(left[responseIx]);
            console.log(right[responseIx]);
            console.log(response);
            throw 'Prediction Model Tree found no matching branch';
        }
        
        // Find next ix from nextId
        for (let i = 0; i < predictionModel.length; i++) {
            if (predictionModel[i][parentIx] == selectedNode[idIx]) {
                return predict(response, i);
            }
        }

        return selectedNode[predictIx];
    };

    if (typeof predictionModel == 'function') {
        return predictionModel;
    }
    else {
        return predict;
    }
}

function calculateRMSE(responses, predict) {
    var squaredErrors = [];
    var sse;

    responses.forEach(function(response) {
        squaredErrors.push(Math.pow(predict(response) - response[targetProperty], 2));
    });

    sse = squaredErrors.reduce(function(sum, next) {
        return sum + next;
    }, 0);

    return Math.sqrt(sse / squaredErrors.length);
}

function calculateMAPE(responses, predict) {
    var absolutePercentErrors = [];
    var sumAPE;

    responses.forEach(function(response) {
        //console.log(response[targetProperty] + '        ' + predict(response) + '       ' + response['Country'] + '       ' + response['Years of Experience - IT']);
        absolutePercentErrors.push({
            'value': Math.abs(response[targetProperty] - predict(response)) / response[targetProperty],
            'country': response['Country'],
            'exp': response['Years of Experience - Total']
        });
    });

    //console.log(absolutePercentErrors.map(function(item) { return item.country + '\t' + item.exp + '\t' + item.value; }).join('\n'));

    sumAPE = absolutePercentErrors.reduce(function(sum, next) {
        return sum + next.value;
    }, 0);

    return sumAPE / absolutePercentErrors.length;
}

function shuffle(responses, property) {
    var randomIndex;
    var temporaryValue;
    var shuffledResponses = responses.map(function(response) {
        return Object.assign({}, response);
    });

    for (var i = 0; i < shuffledResponses.length; i++) {
        randomIndex = Math.floor(Math.random() * i);

        temporaryValue = shuffledResponses[i][property];
        shuffledResponses[i][property] = shuffledResponses[randomIndex][property];
        shuffledResponses[randomIndex][property] = temporaryValue;
    }

    return shuffledResponses;
}

function calculatePermutationImportance(predictionModel) {
    var shuffleResults = {};
    var shuffledResponses;
    var predict = generatePredict(predictionModel);
    var responses = getProcessedResponses(responseInput);

    var modelResult = calculateRMSE(responses, predict);

    significantProperties.forEach(function(property) {
        shuffledResponses = getProcessedResponses(shuffle(responseInput, property));
        shuffleResults[property] = shuffleResults[property] || 0;
        shuffleResults[property] = shuffleResults[property] + calculateRMSE(shuffledResponses, predict);
        shuffleResults[property] = shuffleResults[property] - modelResult;
    });
    console.log('Model RMSE: ' + modelResult);
    console.log(shuffleResults);
}

function calculateModelMAPE(predictionModel) {
    var predict = generatePredict(predictionModel);
    var responses = getProcessedResponses(responseInput);

    return calculateMAPE(responses, predict);
}