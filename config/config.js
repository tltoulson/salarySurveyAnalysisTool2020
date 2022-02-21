export { 
    targetProperty, 
    targetScale, 
    ignoredFields, 
    continuousFields , 
    varianceDecimalPlaces, 
    histogramMaxY,
    countDiscard,
    splitCriteria,
    splitSortOrder,
    computedProperties
};

import {valueMaps} from './valueMaps.js';
import {SplitCriteria, calculateSum, calculateStDevPopulation, calculateMean} from '../lib/variance.js';

/*******
 * ANOVA Help
 * https://www.analyticsvidhya.com/blog/2018/01/anova-analysis-of-variance/
 */

/* Property that contains the target numeric value (ie. Salary) that you are attempting to predict*/
//var targetProperty = 'Compensation - Total Annual PPP USD';
var targetProperty = 'PPP Adjusted Compensation';
var targetScale = 1;
var countDiscard = true;
var splitCriteria = SplitCriteria.ANOVAF;
var splitSortOrder = -1; // 1 is smallest to largest, -1 is largest to smallest

var varianceDecimalPlaces = 4;

var histogramMaxY = 50;

/* Fields to ignore, no histograms or variance calculations will be performed for these */
var ignoredFields = [
    "Submitted At",
    "Confirm",
    "Salary",
    "Hourly",
    "Expected Bonus",
    "Expected Commission",
    "Other",
    "Total Expected Compensation this year",
    "PPP Adjustment",
    "PDFs",
    "Total Amount",
    "Customer ID",
    "IP Address",
    "ID",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "UTM Term",
    "UTM Content",
    "Notes",

    // Replaced with Continuous Variables
    'Which of the following best describes your current job level?',
    "Which of the following best describes how many people currently work for your current employer?",
    "Which of the following best describes how many people currently work for your current employer?",
    "I have a close professional relationship with peers within my current employer's organization", 
    "I have a close professional relationship with peers around the ServiceNow industry",
    "I have a close professional relationship with my immediate supervisor", 
    "I have a close professional relationship with my senior management", 
    "I have a close professional relationship with my executive management", 
    "I negotiate for higher pay after a potential employer makes an initial offer", 
    "I negotiate for higher pay from my employer at predetermined intervals specified by my employer", 
    "I negotiate for higher pay from my employer when I receive a promotion", 
    "I negotiate for higher pay from my employer when I feel I deserve it", 
    "My professional network is involved in potential employers making me a job offer", 
    "How important is a pay increase to you when considering future job opportunities?", 
    "How important have pay increases been to you when considering past job opportunities up until now?", 

    // Non-Binary Splits
    "Currency",
    "What is your current employment status?",
    "Which of the following best describes your current job role?",
    "Which of the following best describes your current job level?",
    "Age",
    "Gender",
    "Ethnicity",
    "Country",
    "Which of the following best describes your current employer?",
    "Which of the following best describes the Industry in which your current employer operates?",
    "Which of the following best describes your current employer's primary business model?",
    "Which of the following best describes how many people currently work for your current employer?",
    "Is your current employer a for profit or non-profit organization?",
    "Current Employer's Name",
    "Device Type"
];

/* Numeric fields that have continuous values as opposed to categorical values.  These properties will be replaced with calculated properties that map the original value to logically split categorical values */
var continuousFields = [
     "Percent Salary",
     "Percent Hourly",
     "Percent Bonus",
     "Percent Commission",
     "Percent Other",
    "Country GNI per Capita",
    "Total Experience",
    "IT Experience",
    "ServiceNow Experience",

    'Job Level Continuous',
    'Age Continuous',
    'Employer Size Continuous',
    'Close relationship with peers in the same company',
    'Close relationship with peers in the SN Industry',
    'Close relationship with immediate supervisor',
    'Close relationship with senior management',
    'Close relationship with executive management',
    'Negotiate after initial offer',
    'Negotiate at predetermined intervals specified by employer',
    'Negotiate when promoted',
    'Negotiate when I feel I deserve it',
    'Professional network helps with job offers',
    'Pay increase importance in future',
    'Pay increase importance in past',

    'Negotiation Score',
    'Relationship Score'
];

function getComputedProperty(property, value, valueMap) {
    return function(response) {
        var propValue = response[property];

        if (valueMap) {
            propValue = valueMap[response[property]];
        }

        if (propValue == value) {
            return 'Yes';
        }
        else { 
            return 'No'
        }
    }
}

function getComputedValue(propertyList, calculation, valueMap) {
    return function(response) {
        var values = propertyList.map(function(property) {
            if (property.startsWith('Certs')) {
                if(response[property] == undefined) {
                    console.log(property);
                }
            }

            if (valueMap) {
                return valueMap[response[property]];
            }
            else {
                return response[property];
            }
        });

        return calculation(values).toFixed(2);
    }
}

function getFromValueMap(property, map) {
    return function(response) {
        if (map[response[property]]) {
            return map[response[property]];
        }
        else { 
            console.log('Error getFromValueMap: ' + response[property]);
        }
    }
}

var relationshipProperties = [
    "I have a close professional relationship with peers within my current employer's organization",
    "I have a close professional relationship with peers around the ServiceNow industry",
    "I have a close professional relationship with my immediate supervisor",
    "I have a close professional relationship with my senior management",
    "I have a close professional relationship with my executive management"
];

var negotiatingProperties = [
    "I negotiate for higher pay after a potential employer makes an initial offer",
    "I negotiate for higher pay from my employer at predetermined intervals specified by my employer",
    "I negotiate for higher pay from my employer when I receive a promotion",
    "I negotiate for higher pay from my employer when I feel I deserve it"
];

var computedProperties = {
    'Job Level Continuous': getFromValueMap('Which of the following best describes your current job level?', valueMaps.JobLevel),
    'Age Continuous': getFromValueMap('Age', valueMaps.Age),
    'Employer Size Continuous': getFromValueMap("Which of the following best describes how many people currently work for your current employer?", valueMaps.EmployerSize),
    'Close relationship with peers in the same company': getFromValueMap("I have a close professional relationship with peers within my current employer's organization", valueMaps.AgreeDisagree),
    'Close relationship with peers in the SN Industry': getFromValueMap("I have a close professional relationship with peers around the ServiceNow industry", valueMaps.AgreeDisagree),
    'Close relationship with immediate supervisor': getFromValueMap("I have a close professional relationship with my immediate supervisor", valueMaps.AgreeDisagree),
    'Close relationship with senior management': getFromValueMap("I have a close professional relationship with my senior management", valueMaps.AgreeDisagree),
    'Close relationship with executive management': getFromValueMap("I have a close professional relationship with my executive management", valueMaps.AgreeDisagree),
    'Negotiate after initial offer': getFromValueMap("I negotiate for higher pay after a potential employer makes an initial offer", valueMaps.FrequencyCoarse),
    'Negotiate at predetermined intervals specified by employer': getFromValueMap("I negotiate for higher pay from my employer at predetermined intervals specified by my employer", valueMaps.FrequencyCoarse),
    'Negotiate when promoted': getFromValueMap("I negotiate for higher pay from my employer when I receive a promotion", valueMaps.FrequencyCoarse),
    'Negotiate when I feel I deserve it': getFromValueMap("I negotiate for higher pay from my employer when I feel I deserve it", valueMaps.FrequencyCoarse),
    'Professional network helps with job offers': getFromValueMap("My professional network is involved in potential employers making me a job offer", valueMaps.FrequencyCoarse),
    'Pay increase importance in future': getFromValueMap("How important is a pay increase to you when considering future job opportunities?", valueMaps.Importance),
    'Pay increase importance in past': getFromValueMap("How important have pay increases been to you when considering past job opportunities up until now?", valueMaps.Importance),

    'Currency is Australian Dollar (AUD)': getComputedProperty('Currency', 'Australian Dollar (AUD)'),
    'Currency is British Pound (GBP)': getComputedProperty('Currency', 'British Pound (GBP)'),
    'Currency is Bulgarian Lev (BGN)': getComputedProperty('Currency', 'Bulgarian Lev (BGN)'),
    'Currency is Canadian Dollar (CAD)': getComputedProperty('Currency', 'Canadian Dollar (CAD)'),
    'Currency is Euro (EUR)': getComputedProperty('Currency', 'Euro (EUR)'),
    'Currency is Indian Rupee (INR)': getComputedProperty('Currency', 'Indian Rupee (INR)'),
    'Currency is Moroccan Dirham (MAD)': getComputedProperty('Currency', 'Moroccan Dirham (MAD)'),
    'Currency is Pakistani Rupee (PKR)': getComputedProperty('Currency', 'Pakistani Rupee (PKR)'),
    'Currency is Philippine Peso (PHP)': getComputedProperty('Currency', 'Philippine Peso (PHP)'),
    'Currency is Tunisian Dinar (TND)': getComputedProperty('Currency', 'Tunisian Dinar (TND)'),
    'Currency is US Dollar (USD)': getComputedProperty('Currency', 'US Dollar (USD)'),

    'Employment Status is Freelance / Contractor': getComputedProperty("What is your current employment status?", 'Freelance / Contractor'),
    'Employment Status is Permanent - Full Time': getComputedProperty("What is your current employment status?", 'Permanent - Full Time'),
    'Employment Status is Prefer not to disclose': getComputedProperty("What is your current employment status?", 'Prefer not to disclose'),
    'Employment Status is Unemployed': getComputedProperty("What is your current employment status?", 'Unemployed'),

    'Job Role is Business Analyst': getComputedProperty("Which of the following best describes your current job role?", 'Business Analyst'),
    'Job Role is Director': getComputedProperty("Which of the following best describes your current job role?", 'Director'),
    'Job Role is Engagement Manager': getComputedProperty("Which of the following best describes your current job role?", 'Engagement Manager'),
    'Job Role is Manager': getComputedProperty("Which of the following best describes your current job role?", 'Manager'),
    'Job Role is Prefer not to disclose': getComputedProperty("Which of the following best describes your current job role?", 'Prefer not to disclose'),
    'Job Role is Pre-Sales Consultant': getComputedProperty("Which of the following best describes your current job role?", 'Pre-Sales Consultant'),
    'Job Role is Project Manager': getComputedProperty("Which of the following best describes your current job role?", 'Project Manager'),
    'Job Role is ServiceNow Administrator': getComputedProperty("Which of the following best describes your current job role?", 'ServiceNow Administrator'),
    'Job Role is ServiceNow Developer/Programmer': getComputedProperty("Which of the following best describes your current job role?", 'ServiceNow Developer/Programmer'),
    'Job Role is Solutions Architect': getComputedProperty("Which of the following best describes your current job role?", 'Solutions Architect'),
    'Job Role is Technical Analyst': getComputedProperty("Which of the following best describes your current job role?", 'Technical Analyst'),
    'Job Role is Technical Architect': getComputedProperty("Which of the following best describes your current job role?", 'Technical Architect'),

    'Job Level is Entry level': getComputedProperty("Which of the following best describes your current job level?", 'Entry level'),
    'Job Level is First-level management': getComputedProperty("Which of the following best describes your current job level?", 'First-level management'),
    'Job Level is Intermediate or experienced level': getComputedProperty("Which of the following best describes your current job level?", 'Intermediate or experienced level'),
    'Job Level is Middle-level management': getComputedProperty("Which of the following best describes your current job level?", 'Middle-level management'),
    'Job Level is Prefer not to disclose': getComputedProperty("Which of the following best describes your current job level?", 'Prefer not to disclose'),
    'Job Level is Senior experienced level': getComputedProperty("Which of the following best describes your current job level?", 'Senior experienced level'),
    'Job Level is Senior, executive or top-level management': getComputedProperty("Which of the following best describes your current job level?", 'Senior, executive or top-level management'),

    'Age is 18-24': getComputedProperty('Age', '18-24'),
    'Age is 25-34': getComputedProperty('Age', '25-34'),
    'Age is 35-44': getComputedProperty('Age', '35-44'),
    'Age is 45-54': getComputedProperty('Age', '45-54'),
    'Age is 55+': getComputedProperty('Age', '55+'),
    'Age is Prefer not to disclose': getComputedProperty('Age', 'Prefer not to disclose'),

    'Gender is Female': getComputedProperty('Gender', 'Female'),
    'Gender is Male': getComputedProperty('Gender', 'Male'),
    'Gender is Non-binary': getComputedProperty('Gender', 'Non-binary'),
    'Gender is Prefer not to disclose': getComputedProperty('Gender', 'Prefer not to disclose'),

    'Ethnicity is Arab': getComputedProperty('Ethnicity', 'Arab'),
    'Ethnicity is Asian': getComputedProperty('Ethnicity', 'Asian'),
    'Ethnicity is Black, African or Caribbean': getComputedProperty('Ethnicity', 'Black, African or Caribbean'),
    'Ethnicity is Hispanic or Latino': getComputedProperty('Ethnicity', 'Hispanic or Latino'),
    'Ethnicity is Mixed / multiple ethnic groups': getComputedProperty('Ethnicity', 'Mixed / multiple ethnic groups'),
    'Ethnicity is Prefer not to disclose': getComputedProperty('Ethnicity', 'Prefer not to disclose'),
    'Ethnicity is White / Caucasian': getComputedProperty('Ethnicity', 'White / Caucasian'),

    'Country is Australia': getComputedProperty('Country', 'Australia'),
    'Country is Belgium': getComputedProperty('Country', 'Belgium'),
    'Country is Bulgaria': getComputedProperty('Country', 'Bulgaria'),
    'Country is Canada': getComputedProperty('Country', 'Canada'),
    'Country is Germany': getComputedProperty('Country', 'Germany'),
    'Country is India': getComputedProperty('Country', 'India'),
    'Country is Luxembourg': getComputedProperty('Country', 'Luxembourg'),
    'Country is Morocco': getComputedProperty('Country', 'Morocoo'),
    'Country is Netherlands': getComputedProperty('Country', 'Netherlands'),
    'Country is New Zealand': getComputedProperty('Country', 'New Zealand'),
    'Country is Pakistan': getComputedProperty('Country', 'Pakistan'),
    'Country is Philippines': getComputedProperty('Country', 'Philippines'),
    'Country is Prefer not to disclose': getComputedProperty('Country', 'Prefer not to disclose'),
    'Country is Russia': getComputedProperty('Country', 'Russia'),
    'Country is Tunisia': getComputedProperty('Country', 'Tunisia'),
    'Country is United Kingdom': getComputedProperty('Country', 'United Kingdom'),
    'Country is United States': getComputedProperty('Country', 'United States'),

    'Current Employer Type is Prefer not to disclose': getComputedProperty("Which of the following best describes your current employer?", 'Prefer not to disclose'),
    'Current Employer Type is Independent Consultant / Contractor': getComputedProperty("Which of the following best describes your current employer?", 'Independent Consultant / Contractor'),
    'Current Employer Type is ServiceNow Customer / End User': getComputedProperty("Which of the following best describes your current employer?", 'ServiceNow Customer / End User'),
    'Current Employer Type is ServiceNow Employee': getComputedProperty("Which of the following best describes your current employer?", 'ServiceNow Employee'),
    'Current Employer Type is ServiceNow ISV (Independent Software Vendor)': getComputedProperty("Which of the following best describes your current employer?", 'ServiceNow ISV (Independent Software Vendor)'),
    'Current Employer Type is ServiceNow Services Partner / Consultancy': getComputedProperty("Which of the following best describes your current employer?", 'ServiceNow Services Partner / Consultancy'),
    'Current Employer Type is Unemployment ': getComputedProperty("Which of the following best describes your current employer?", 'Unemployment '),

    'Employers Industry is All': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'All'),
    'Employers Industry is All the above': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'All the above'),
    'Employers Industry is Banking and Finance': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Banking and Finance'),
    'Employers Industry is Consultancy/Agency': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Consultancy/Agency'),
    'Employers Industry is Education': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Education'),
    'Employers Industry is Energy': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Energy'),
    'Employers Industry is Federal': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Federal '),
    'Employers Industry is Financial Services': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Financial Services'),
    'Employers Industry is Government': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Government'),
    'Employers Industry is Health and Life Sciences': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Health and Life Sciences'),
    'Employers Industry is Identity governance administration': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Identity governance administration'),
    'Employers Industry is Insurance': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Insurance'),
    'Employers Industry is IT Services': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'IT Services'),
    'Employers Industry is Logistics': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Logistics'),
    'Employers Industry is Manufacturing': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Manufacturing'),
    'Employers Industry is Many of the above': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Many of the above'),
    'Employers Industry is Multi-facet depending on each client\'s industry': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Multi-facet depending on each client\'s industry'),
    'Employers Industry is Prefer not to disclose': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Prefer not to disclose'),
    'Employers Industry is Professional Services': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Professional Services'),
    'Employers Industry is Retail': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Retail'),
    'Employers Industry is Software/Internet': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Software/Internet'),
    'Employers Industry is Very large industry-agnostic consultancy': getComputedProperty("Which of the following best describes the Industry in which your current employer operates?", 'Very large industry-agnostic consultancy'),
    
    'Employers Business Model is B2B (business-to-business)': getComputedProperty("Which of the following best describes your current employer's primary business model?", 'B2B (business-to-business)'),
    'Employers Business Model is B2B2C (business-to-business-to-consumer)': getComputedProperty("Which of the following best describes your current employer's primary business model?", 'B2B2C (business-to-business-to-consumer)'),
    'Employers Business Model is B2C (business-to-consumer)': getComputedProperty("Which of the following best describes your current employer's primary business model?", 'B2C (business-to-consumer)'),
    'Employers Business Model is Not applicable': getComputedProperty("Which of the following best describes your current employer's primary business model?", 'Not applicable'),
    'Employers Business Model is Not sure': getComputedProperty("Which of the following best describes your current employer's primary business model?", 'Not sure'),
    'Employers Business Model is Prefer not to disclose': getComputedProperty("Which of the following best describes your current employer's primary business model?", 'Prefer not to disclose'),

    'Number of Employees is 1,001-5,000 employees': getComputedProperty("Which of the following best describes how many people currently work for your current employer?", '1,001-5,000 employees'),
    'Number of Employees is 11-50 employees': getComputedProperty("Which of the following best describes how many people currently work for your current employer?", '11-50 employees'),
    'Number of Employees is 201-500 employees': getComputedProperty("Which of the following best describes how many people currently work for your current employer?", '201-500 employees'),
    'Number of Employees is 2-10 employees': getComputedProperty("Which of the following best describes how many people currently work for your current employer?", '2-10 employees'),
    'Number of Employees is 5,001-10,000 employees': getComputedProperty("Which of the following best describes how many people currently work for your current employer?", '5,001-10,000 employees'),
    'Number of Employees is 501-1,000 employees': getComputedProperty("Which of the following best describes how many people currently work for your current employer?", '501-1,000 employees'),
    'Number of Employees is 51-200 employees': getComputedProperty("Which of the following best describes how many people currently work for your current employer?", '51-200 employees'),
    'Number of Employees is More than 10,000 employees': getComputedProperty("Which of the following best describes how many people currently work for your current employer?", 'More than 10,000 employees'),
    'Number of Employees is Not sure': getComputedProperty("Which of the following best describes how many people currently work for your current employer?", 'Not sure'),
    'Number of Employees is Prefer not to disclose': getComputedProperty("Which of the following best describes how many people currently work for your current employer?", 'Prefer not to disclose'),

    'Employer is For Profit': getComputedProperty("Is your current employer a for profit or non-profit organization?", 'For Profit'),
    'Employer is Non-Profit': getComputedProperty("Is your current employer a for profit or non-profit organization?", 'Non-Profit'),
    'Employer is Not Sure': getComputedProperty("Is your current employer a for profit or non-profit organization?", 'Not Sure'),
    'Employer is Prefer not to disclose': getComputedProperty("Is your current employer a for profit or non-profit organization?", 'Prefer not to disclose'), 

    'Device Type is Mobile': getComputedProperty('Device Type', 'mobile'),
    'Device Type is Desktop': getComputedProperty('Device Type', 'desktop'),
    'Device Type is Tablet': getComputedProperty('Device Type', 'tablet'),

    // Add computations for Relationship Score and Negotiation Score
    
    'Negotiation Score': getComputedValue(negotiatingProperties, calculateSum, valueMaps.FrequencyCoarse),
    'Relationship Score': getComputedValue(relationshipProperties, calculateSum, valueMaps.AgreeDisagree)
}