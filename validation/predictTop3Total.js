export { predictTop3Total }

function predictTop3Total(response) {
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
    var yearsOfExperience = response['Years of Experience - Total'];

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
            return (-82.264 * Math.pow(yearsOfExperience, 2)) + (4171.2 * yearsOfExperience) + 89117;
        }
        else {
            return (-554.2 * Math.pow(yearsOfExperience, 2)) + (22182 * yearsOfExperience) + 26304;
        }
    }
    else if (response['Country is India'] == 'Yes') {
        return (-232.65 * Math.pow(yearsOfExperience, 2)) + (12144 * yearsOfExperience) - 5105.2;
    }
    else if (response['Country is Australia'] == 'Yes') {
        return (-109.09 * Math.pow(yearsOfExperience, 2)) + (7465.2 * yearsOfExperience) + 19733;
    }
    else if (response['Country is United Kingdom'] == 'Yes') {
        return (-42.971 * Math.pow(yearsOfExperience, 2)) + (4090.7 * yearsOfExperience) + 51434;
    }
    else if (response['Country is Canada'] == 'Yes') {
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