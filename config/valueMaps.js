export {valueMaps};

var valueMaps = {
    'Age': {
        '18-24': 24,
        '25-34': 34,
        '35-44': 44,
        '45-54': 54,
        '55+': 55,
        'Prefer not to disclose': 24 // Highest probability is 25-34 age group
    },

    'YesNo': {
        'Yes': 'Yes',
        'No': 'No',
        'N/A': 'No',
        'Prefer not to disclose': '$$DISCARD',
        'Not Sure': '$$DISCARD'
    },

    'YesNoNumeric': {
        'Yes': 1,
        'No': 0,
        'N/A': 0,
        'Prefer not to disclose': 0,
        'Not Sure': 0
    },

    'Education': {
        'High School Diploma, GCSEs or equivalent': 1,
        'Some College': 2,
        'Trade or Vocational Degree or Certificate or equivalent': 2.5,
        'Associates Degree or Certificate or equivalent': 3,
        'Bachelor\'s Degree or equivalent': 5,
        'Master’s Degree or equivalent': 7,
        'Prefer not to disclose': 5 // Highest probability is Bachelors
    },

    'JobLevel': {
        'Entry level': 1,
        'Intermediate or experienced level': 2,
        'Senior experienced level': 3,
        'First-level management': 4,
        'Middle-level management': 5,
        'Senior, executive or top-level management': 6,
        'Prefer not to disclose': 2 // Highest probability is Intermediate or Experienced
    },

    'EmployerSize': {
        '2-10 employees': 1,
        '11-50 employees': 2,
        '51-200 employees': 3,
        '201-500 employees': 4,
        '501-1,000 employees': 5,
        '1,001-5,000 employees': 6,
        '5,001-10,000 employees': 7,
        'More than 10,000 employees': 8,
        'Not sure': 8, // Highest probability is More than 10,000
        'Prefer not to disclose': 8 // Highest probability is More than 10,000
    },

    'CurrentJobRole': {
        'ServiceNow Developer/Programmer': 'ServiceNow Developer/Programmer',
        'Solutions Architect': 'Architect',
        'Technical Architect': 'Architect',
        'ServiceNow Administrator': 'ServiceNow Administrator',
        'Technical Analyst': 'Business Analyst / Technical Anlayst',
        'Reporting/PA Admin': 'ServiceNow Administrator',
        'Project Manager': 'Project Manager',
        'Business Analyst': 'Business Analyst / Technical Anlayst',
        'Fullstack Developer': 'ServiceNow Developer/Programmer',
        'Pre-Sales Consultant': 'Pre-Sales Consultant',
        'Engagement Manager': 'Management',
        'Manager': 'Management',
        'Director': 'Management',
        'Process Owner': 'Management',
        'Practice Lead': 'Management',
        'CTO': 'Management',
        'Executive': 'Management',
        'All of the above': 'Technical Architect'
    },

    'Frequency': {
        'Daily': 7,
        'Weekly': 6,
        'Monthly': 5,
        'Quarterly': 4,
        'Yearly': 3,
        'Less than Yearly': 2,
        'Prefer not to disclose': 1 // Assume lowest possible if no response
    },

    'FrequencyCoarse': {
        'Always': 5,
        'Often': 4,
        'Sometimes': 3,
        'Rarely': 2,
        'Never': 1,
        'Prefer not to disclose': 1 // Assume lowest possible if no response
    },

    'AgreeDisagree': {
        'Strongly Agree': 5,
        'Agree': 4,
        'Neutral': 3,
        'Prefer not to disclose': 3, // Assume neutral for these question types
        'Disagree': 2,
        'Strongly Disagree': 1
    },

    'Satisfaction': {
        'Very Satisfied': 5,
        'Satisfied': 4,
        'Neither satisfied nor dissatisfied': 3,
        'Prefer not to disclose': 3, // Assume neutral for these question types
        'Dissatisfied': 2,
        'Very dissatisfied': 1
    },

    'Importance': {
        'Extremely important': 5,
        'Very important': 4,
        'Moderately important': 3,
        'Slightly important': 2,
        'Not at all important': 1,
        'Prefer not to disclose': 3 // Assume neutral for these question types
    },

    'FieldOfStudy': {
        'Accounting': 'Non-Technology Degree',
        'Anthropology': 'Non-Technology Degree',
        'Arts': 'Non-Technology Degree',
        'Business Administration': 'Non-Technology Degree',
        'Communications': 'Non-Technology Degree',
        'Computer Science': 'Technology Degree',
        'Did not attend college': 'Non-Technology Degree',
        'Economics': 'Non-Technology Degree',
        'Electrical Engineering': 'Technology Degree',
        'Electronics': 'Technology Degree',
        'Electronics and Communication': 'Technology Degree',
        'Electronics and Communication Engineering': 'Technology Degree',
        'Engineering': 'Technology Degree',
        'English Literature': 'Non-Technology Degree',
        'Fine Arts': 'Non-Technology Degree',
        'History': 'Non-Technology Degree',
        'Industrial / Systems Engineering': 'Technology Degree',
        'Information Technology': 'Technology Degree',
        'Interactive Entertainment': 'Non-Technology Degree',
        'Interdisciplinary': 'Non-Technology Degree',
        'Liberal Arts': 'Non-Technology Degree',
        'Mathematics': 'Non-Technology Degree',
        'Mechanical Engineering': 'Technology Degree',
        'Multimedia and Web Design': 'Non-Technology Degree',
        'Music': 'Non-Technology Degree',
        'Non-science major': 'Non-Technology Degree',
        'Nursing': 'Non-Technology Degree',
        'Philosophy': 'Non-Technology Degree',
        'Political Science': 'Non-Technology Degree',
        'Prefer not to disclose': '$$DISCARD',
        'Psychology': 'Non-Technology Degree',
        'Religious Studies': 'Non-Technology Degree',
        'Science': 'Non-Technology Degree',
        'Sociology/Anthropology': 'Non-Technology Degree',
        'Software Engineering': 'Technology Degree'
    },

    /* GNI Dollars / capita using Atlas method as of 2019
    https://blogs.worldbank.org/opendata/new-country-classifications-income-level-2019-2020#:~:text=The%20classification%20of%20countries%20is,also%20influence%20GNI%20per%20capita.
   */
    'Country': {
        'Australia': 54910,
        'Belgium': 47350,
        'Brazil ': 9130,
        'Bulgaria': 9410,
        'Canada': 46370,
        'Costa Rica ': 11700,
        'Germany': 48520,
        'India': 2130,
        'Italy': 34460,
        'Netherlands': 53200,
        'Philippines': 3850,
        'Poland': 15200,
        'Prefer not to disclose': 25163, // Used value for Europe & Central Asia
        'Spain': 30390,
        'Sweden': 55840,
        'Switzerland': 85500,
        'Ukraine': 3370,
        'United Kingdom': 42370,
        'United States ': 65760
    },

    /* GDP Dollars / capita
    https://data.oecd.org/gdp/gross-domestic-product-gdp.htm
    lowest variance: 3091648951
    'Country': {
        'Australia': 55961.9,
        'Belgium': 54897,
        'Brazil ': 14592.1,
        'Bulgaria': 24505.9,
        'Canada': 51341.7,
        'Costa Rica ': 20403.4,
        'Germany': 56305.2,
        'India': 5901.6,
        'Italy': 44217.7,
        'Netherlands': 59512.5,
        'Philippines': NaN,
        'Poland': 33844.1,
        'Prefer not to disclose': NaN,
        'Spain': 42170.6,
        'Sweden': 55855.5,
        'Switzerland': 70985.5,
        'Ukraine': NaN,
        'United Kingdom': 48745.1,
        'United States ': 65143.4
    }*/

    /* Labor Productivity Per Hour measured as GDP per hour of Work
    https://ourworldindata.org/grapher/labor-productivity-per-hour-pennworldtable
    lowest variance: 3115144834
    'Country': {
        'Australia': 54.59,
        'Belgium': 59.65,
        'Brazil ': 16.34,
        'Bulgaria': 23.26,
        'Canada': 49.53,
        'Costa Rica ': 16.57,
        'Germany': 66.71,
        'India': 7.55,
        'Italy': 53.29,
        'Netherlands': 61.43,
        'Philippines': 9.64,
        'Poland': 31.06,
        'Prefer not to disclose': NaN,
        'Spain': 51.17,
        'Sweden': 54.10,
        'Switzerland': 69.26,
        'Ukraine': NaN,
        'United Kingdom': 48.48,
        'United States ': 65.51
    }*/

    /* GDP Million US Dollars
    https://data.oecd.org/gdp/gross-domestic-product-gdp.htm
    lowest variance: 3217094845
    'Country': {
        'Australia': 1419808,
        'Belgium': 630528,
        'Brazil ': 3017716,
        'Bulgaria': 171333,
        'Canada': 1929897,
        'Costa Rica ': 103144,
        'Germany': 4678568,
        'India': 8123457,
        'Italy': 2668052,
        'Netherlands': 1032244,
        'Philippines': NaN,
        'Poland': 1299277,
        'Prefer not to disclose': NaN,
        'Spain': 1986415,
        'Sweden': 574133,
        'Switzerland': 608721,
        'Ukraine': NaN,
        'United Kingdom': 3257782,
        'United States ': 21433226
    }*/

    /* Anglosphere vs Non-Anglosphere Countries - variance: 3271315300
    'Country': {
        'Australia': 'Anglosphere',
        'Belgium': 'Non-Anglosphere',
        'Brazil ': 'Non-Anglosphere',
        'Bulgaria': 'Non-Anglosphere',
        'Canada': 'Anglosphere',
        'Costa Rica ': 'Non-Anglosphere',
        'Germany': 'Non-Anglosphere',
        'India': 'Non-Anglosphere',
        'Italy': 'Non-Anglosphere',
        'Netherlands': 'Non-Anglosphere',
        'Philippines': 'Non-Anglosphere',
        'Poland': 'Non-Anglosphere',
        'Prefer not to disclose': '$$DISCARD',
        'Spain': 'Non-Anglosphere',
        'Sweden': 'Non-Anglosphere',
        'Switzerland': 'Non-Anglosphere',
        'Ukraine': 'Non-Anglosphere',
        'United Kingdom': 'Anglosphere',
        'United States ': 'Anglosphere'
    }*/

    /* G7 vs Non-G7 - variance: 3316191998
    'Country': {
        'Australia': 'Non-G7',
        'Belgium': 'Non-G7',
        'Brazil ': 'Non-G7',
        'Bulgaria': 'Non-G7',
        'Canada': 'G7',
        'Costa Rica ': 'Non-G7',
        'Germany': 'G7',
        'India': 'Non-G7',
        'Italy': 'G7',
        'Netherlands': 'Non-G7',
        'Philippines': 'Non-G7',
        'Poland': 'Non-G7',
        'Prefer not to disclose': '$$DISCARD',
        'Spain': 'Non-G7',
        'Sweden': 'Non-G7',
        'Switzerland': 'Non-G7',
        'Ukraine': 'Non-G7',
        'United Kingdom': 'G7',
        'United States ': 'G7'
    }*/

    /* Western World Classification - variance: 3460266961
    'Country': {
        'Australia': 'Occidental',
        'Belgium': 'Occidental',
        'Brazil ': 'Occidental',
        'Bulgaria': 'Non-Occidental',
        'Canada': 'Occidental',
        'Costa Rica ': 'Occidental',
        'Germany': 'Occidental',
        'India': 'Non-Occidental',
        'Italy': 'Occidental',
        'Netherlands': 'Occidental',
        'Philippines': 'Non-Occidental',
        'Poland': 'Occidental',
        'Prefer not to disclose': '$$DISCARD',
        'Spain': 'Occidental',
        'Sweden': 'Occidental',
        'Switzerland': 'Occidental',
        'Ukraine': 'Non-Occidental',
        'United Kingdom': 'Occidental',
        'United States ': 'Occidental'
    }*/
};