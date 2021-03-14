export { predictTop3IT }

function predictTop3IT(response) {
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
    var yearsOfExperience = response['Years of Experience - IT'];

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
            return (-76.873 * Math.pow(yearsOfExperience, 2)) + (2547.6 * yearsOfExperience) + 113592;
        }
        else {
            return (-531.99 * Math.pow(yearsOfExperience, 2)) + (20240 * yearsOfExperience) + 71087;
        }
    }
    else if (response['Country is India'] == 'Yes') {
        return (-385.23 * Math.pow(yearsOfExperience, 2)) + (15428 * yearsOfExperience) - 13856;
    }
    else if (response['Country is Australia'] == 'Yes') {
        return (73.29 * Math.pow(yearsOfExperience, 2)) + (2009.4 * yearsOfExperience) + 60724;
    }
    else if (response['Country is United Kingdom'] == 'Yes') {
        return (-44.909 * Math.pow(yearsOfExperience, 2)) + (4142 * yearsOfExperience) + 52243;
    }
    else if (response['Country is Canada'] == 'Yes') {
        return (-116.73 * Math.pow(yearsOfExperience, 2)) + (5600 * yearsOfExperience) + 58300;
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