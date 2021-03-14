export { predictTop3SN }

function predictTop3SN(response) {
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
    var yearsOfExperience = response['Years of Experience - ServiceNow'];

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

    if (response['Country is United States'] == 'Yes') {
        if (response['Compensation - Percent Fixed Continuous > 85'] == 'Yes') {
            return (-1401.3 * Math.pow(yearsOfExperience, 2)) + (24558 * yearsOfExperience) + 45424;
        }
        else {
            return (-809.66 * Math.pow(yearsOfExperience, 2)) + (28821 * yearsOfExperience) + 66326;
        }
    }
    else if (response['Country is India'] == 'Yes') {
        return (1260.9 * Math.pow(yearsOfExperience, 2)) + (1433.5 * yearsOfExperience) + 33658;
    }
    else if (response['Country is Australia'] == 'Yes') {
        return (-11332 * Math.pow(yearsOfExperience, 2)) + (144210 * yearsOfExperience) - 321942;
    }
    else if (response['Country is United Kingdom'] == 'Yes') {
        return (152.15 * Math.pow(yearsOfExperience, 2)) + (8679.7 * yearsOfExperience) + 44660;
    }
    else if (response['Country is Canada'] == 'Yes') {
        return (-3492.1 * Math.pow(yearsOfExperience, 2)) + (18948 * yearsOfExperience) + 107512;
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