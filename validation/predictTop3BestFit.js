export { predictTop3BestFit }

// Updated the model with the field names used in the 2021 survey
// to test the 2020 model against 2021 data
function getExp(response, field) {
    var yearsOfExperience = response[field];

    if (yearsOfExperience == 'Prefer not to disclose') {
        yearsOfExperience = 3; // Mode value
    }
    else {
        yearsOfExperience = yearsOfExperience * 1;
    }

    if (isNaN(yearsOfExperience)) {
        console.log('Error predicting');
        console.log(response);
        return 0;
    }

    return yearsOfExperience;
}

function predictTop3BestFit(response) {
    var otherCountry = {
        'Belgium': 89929,
        'Brazil ': 72000,
        'Bulgaria': 107899,
        'Costa Rica ': 60500,
        'Germany': 81756.5,
        'Italy': 44776,
        'Netherlands': 52308,
        'Philippines': 66837,
        'Poland': 19643,
        'Prefer not to disclose': 69405.5,
        'Spain': 152381,
        'Sweden': 56857,
        'Switzerland': 195993,
        'Ukraine': 79210
    };
    var predictedValue;
    var yearsOfExperience;

    if (response['Country is United States'] == 'Yes') {
        yearsOfExperience = getExp(response, 'ServiceNow Experience');
        if (response['Percent Salary > 0.85'] == 'Yes') {
            return (-1194.7 * Math.pow(yearsOfExperience, 2)) + (21463 * yearsOfExperience) + 53175;
        }
        else {
            return (323.47 * Math.pow(yearsOfExperience, 2)) + (21009 * yearsOfExperience) + 73412;
        }
    }
    else if (response['Country is India'] == 'Yes') {
        yearsOfExperience = getExp(response, 'IT Experience');
        return (-117.17 * Math.pow(yearsOfExperience, 2)) + (10096 * yearsOfExperience) - 710.51;
    }
    else if (response['Country is Australia'] == 'Yes') {
        yearsOfExperience = getExp(response, 'ServiceNow Experience');
        return (-11329 * Math.pow(yearsOfExperience, 2)) + (144172 * yearsOfExperience) - 321820;
    }
    else if (response['Country is United Kingdom'] == 'Yes') {
        yearsOfExperience = getExp(response, 'Total Experience');
        return (-39.47 * Math.pow(yearsOfExperience, 2)) + (3900 * yearsOfExperience) + 53424;
    }
    else if (response['Country is Canada'] == 'Yes') {
        yearsOfExperience = getExp(response, 'Total Experience');
        return (-157.32 * Math.pow(yearsOfExperience, 2)) + (7145.4 * yearsOfExperience) + 44526;
    }
    else {
        predictedValue = otherCountry[response['Country']];
        if (predictedValue) {
            return predictedValue;
        }
        else {
            console.log('Error predicting: ' + response['Country']);
            console.log(response);
            return 0;
        }
    }
}