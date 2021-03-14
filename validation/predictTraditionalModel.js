export { predictTraditionalModel }

function predictTraditionalModel(response) {
    var lookup = {
        'United States ': {
            'ServiceNow Developer/Programmer': [
                [3, 107600],
                [7, 96512],
                [Infinity, 132000]
            ],
            'Technical Architect': [
                [3, 0],
                [7, 105000],
                [Infinity, 180400]
            ],
            'ServiceNow Administrator': [
                [3, 57300],
                [7, 112054],
                [Infinity, 118560]
            ],
            'Technical Analyst': [
                [3, 55000],
                [7, 0],
                [Infinity, 92000]
            ],
            'Project Manager': [
                [3, 0],
                [7, 0],
                [Infinity, 80000]
            ],
            'Business Analyst': [
                [3, 0],
                [7, 0],
                [Infinity, 95000]
            ],
            'Solutions Architect': [
                [3, 0],
                [7, 0],
                [Infinity, 143000]
            ],
            'Manager': [
                [3, 0],
                [7, 0],
                [Infinity, 150000]
            ],
            'Director': [
                [3, 0],
                [7, 0],
                [Infinity, 160000]
            ],
            'Process Owner': [
                [3, 0],
                [7, 0],
                [Infinity, 145200]
            ],
            'Practice Lead': [
                [3, 0],
                [7, 0],
                [Infinity, 152000]
            ],
            'Pre-Sales Consultant': [
                [3, 0],
                [7, 0],
                [Infinity, 170000]
            ],
            'Engagement Manager': [
                [3, 0],
                [7, 0],
                [Infinity, 225000]
            ],
            'CTO': [
                [3, 0],
                [7, 0],
                [Infinity, 250000]
            ],
            'Executive': [
                [3, 0],
                [7, 0],
                [Infinity, 250000]
            ],
            'All of the above': [
                [3, 0],
                [7, 0],
                [Infinity, 340000]
            ]
        },
        'India': {
            'ServiceNow Developer/Programmer': [
                [3, 19991],
                [7, 47148],
                [Infinity, 75436]
            ],
            'Technical Architect': [
                [3, 0],
                [7, 85809],
                [Infinity, 99010]
            ],
            'ServiceNow Administrator': [
                [3, 17916],
                [7, 27817],
                [Infinity, 27346]
            ],
            'Technical Analyst': [
                [3, 0],
                [7, 30646],
                [Infinity, 94295]
            ],
            'Project Manager': [
                [3, 0],
                [7, 0],
                [Infinity, 101367]
            ],
            'Business Analyst': [
                [3, 0],
                [7, 0],
                [Infinity, 89580]
            ],
            'Solutions Architect': [
                [3, 0],
                [7, 77793.5],
                [Infinity, 94531]
            ],
            'Manager': [
                [3, 0],
                [7, 0],
                [Infinity, 198020]
            ],
            'Director': [
                [3, 0],
                [7, 0],
                [Infinity, 141443]
            ]
        },
        'Canada': {
            'ServiceNow Developer/Programmer': [
                [3, 0],
                [7, 71428.5],
                [Infinity, 77731]
            ],
            'Solutions Architect': [
                [3, 0],
                [7, 0],
                [Infinity, 138655]
            ],
            'ServiceNow Administrator': [
                [3, 0],
                [7, 0],
                [Infinity, 100840]
            ],
            'Business Analyst': [
                [3, 0],
                [7, 105042],
                [Infinity, 0]
            ],
            'Project Manager': [
                [3, 0],
                [7, 0],
                [Infinity, 181513]
            ]
        },
        'Australia': {
            'ServiceNow Developer/Programmer': [
                [3, 0],
                [7, 56944],
                [Infinity, 90278]
            ],
            'Business Analyst': [
                [3, 0],
                [7, 0],
                [Infinity, 70139]
            ],
            'Engagement Manager': [
                [3, 0],
                [7, 0],
                [Infinity, 107639]
            ],
            'Solutions Architect': [
                [3, 0],
                [7, 0],
                [Infinity, 126736]
            ]
        },
        'United Kingdom': {
            'ServiceNow Developer/Programmer': [
                [3, 68014.5],
                [7, 73529.5],
                [Infinity, 73529]
            ],
            'Solutions Architect': [
                [3, 0],
                [7, 0],
                [Infinity, 117666]
            ],
            'Technical Architect': [
                [3, 0],
                [7, 0],
                [Infinity, 136029.5]
            ],
        },
        'Poland': { 'ALL': 19643 },
        'Ukraine': { 'ALL': 79210 },
        'Brazil ': { 'ALL': 72000 },
        'Italy': { 'ALL': 44776 },
        'Prefer not to disclose': { 'ALL': 69405.5 },
        'Netherlands': { 'ALL': 52308 },
        'Sweden': { 'ALL': 56857 },
        'Costa Rica ': { 'ALL': 60500},
        'Belgium': { 'ALL': 92171 },
        'Philippines': { 'ALL': 66837 },
        'Bulgaria': { 'ALL': 107899 },
        'Germany': { 'ALL': 81756.5 },
        'Spain': { 'ALL': 152381 },
        'Switzerland': { 'ALL': 195993 }
    };

    var country = response['Country'];
    var role = response['Current Job Role'];
    var exp = response['Years of Experience - Total'];

    var lookupCountry = lookup[country];
    var lookupRole;

    if (lookupCountry) {
        lookupRole = lookupCountry[role];

        if (lookupRole) {
            if (exp <= lookupRole[0][0]) {
                return lookupRole[0][1];
            }
            else if (exp <= lookupRole[1][0]) {
                return lookupRole[1][1];
            }
            else {
                return lookupRole[2][1];
            }
        }
        else {
            lookupRole = lookupCountry['ALL'];

            if (lookupRole) {
                return lookupRole;
            }
            else {
                console.log('Unable to find role: ' + country + ' ' + role);
                return 0;
            }
        }
    }
    else {
        console.log('Unable to find country in lookup: ' + country);
        return 0;
    }
}