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
}

import {valueMaps} from './valueMaps.js';
import {SplitCriteria, calculateSum, calculateStDevPopulation, calculateMean} from '../lib/variance.js';

/*******
 * ANOVA Help
 * https://www.analyticsvidhya.com/blog/2018/01/anova-analysis-of-variance/
 */

/* Property that contains the target numeric value (ie. Salary) that you are attempting to predict*/
//var targetProperty = 'Compensation - Total Annual PPP USD';
var targetProperty = 'Compensation - Total Annual PPP USD';
var targetScale = 1;
var countDiscard = true;
var splitCriteria = SplitCriteria.ANOVAF;
var splitSortOrder = -1; // 1 is smallest to largest, -1 is largest to smallest

var varianceDecimalPlaces = 4;

var histogramMaxY = 50;

/* Fields to ignore, no histograms or variance calculations will be performed for these */
var ignoredFields = [
    // Irrelevant fields
    'ID', 
    'Submitted Date', 
    'Last Page Completed', 
    'Start Language', 
    'Seed',
    'Salary Anomaly', 
    'Currency',
    // Alternative Target Values
    'Compensation - Fixed Annual', 
    'Compensation - Variable Annual', 
    'Compensation - Total Annual Local Currency', 
    'Compensation - Hourly Equiv PPD USD',
    'Compensation - Total Annual PPP USD', 
    'Compensation - Fixed Annual PPP',

    // Data spread over too many splits
    'City',

    // Same response for all users
    'Served in Unspecified Branch',
    'Served in Coast Guard',
    'Served in Space Force',
    'Served in National Guard2',
    'Served in Unspecified Military Component',

    // Non-Binary Splits
    'State',
    'Total Hours Worked This Year',
    'Compensation - Percent Fixed',
    //'Country',
    //'Years of Experience - Total', 
    //'Years of Experience - IT',
    'Years of Experience - Non-IT', 
    //'Years of Experience - ServiceNow', 
    'Years of Experience - Current Employer', 
    'Years of Experience - Current Role', 
    'Years of Military Service',
    'US Census Bureau Division',
    'US Bureau of Economic Analysis Region',
    'US Census Bureau Region',
    //'Current Job Role',
    'Continent',
    'Number of Different Employers',
    'Satisfaction with - Current Employer',
    'Satisfaction with - Current Role',
    'Satisfaction with - Current Pay',
    'Satisfaction with - Future Career Prospects',
    'Certs - Total'
];

/* Numeric fields that have continuous values as opposed to categorical values.  These properties will be replaced with calculated properties that map the original value to logically split categorical values */
var continuousFields = [
    'Age Continuous',
    'Highest Level of Education Continuous',
    'Current Job Level Continuous',
    'Skills - Communication and Presentation Skills Continuous',
    'Skills - MultiLingual Continuous',
    'Skills - Flexibility / Adaptability Continuous',
    'Skills - Teamwork Continuous',
    'Skills - Drive and Enthusiasm Continuous',
    'Skills - Project Management Continuous',
    'Skills - Change Management Continuous',
    'Skills - Sales Continuous',
    'Skills - Lead Generation / Marketing Continuous',
    'Skills - Product Demo Continuous',
    'Skills - Process Design Continuous',
    'Skills - Architectural Design Continuous',
    'Skills - Documentation Continuous',
    'Skills - Service Catalog Design Continuous',
    'Skills - Javascript Continuous',
    'Skills - HTML Continuous',
    'Skills - CSS Continuous',
    'Skills - Jelly Continuous',
    'Skills - Other Programming Languages Continuous',
    'Skills - Integration Development Continuous',
    'Skills - Scripted REST API Development Continuous',
    'Skills - Front End Development Continuous',
    'Skills - Service Catalog Configuration Continuous',
    'Skills - Business Rule Development Continuous',
    'Skills - Client Script Development Continuous',
    'Skills - UI Policy Configuration Continuous',
    'Skills - Workspaces Configuration Continuous',
    'Skills Score - Soft Skill Continuous',
    'Skills Score - Total Continuous',
    'Skills Score - Soft Skill Continuous',
    'Skills Score - Management Continuous',
    'Skills Score - Sales and Marketing Continuous',
    'Skills Score - Architectural Continuous',
    'Skills Score - Dev Overall Continuous',
    'Skills Score - Dev Basic Continuous',
    'Skills Score - Dev Front End Continuous',
    'Skills Score - Dev Integration Continuous',
    'Skills Score - Dev Config Continuous',
    'Skills Score - Total High Frequency Skills Continuous',
    'SN Product - ITSM Continuous',
    'SN Product - ITOM Continuous',
    'SN Product - ITBM Continuous',
    'SN Product - Software Asset Management Continuous',
    'SN Product - Security Operations Continuous',
    'SN Product - GRC Continuous',
    'SN Product - HR Service Delivery Continuous',
    'SN Product - CSM Continuous',
    'SN Product - Custom Applications Continuous',
    'SN Product - Virtual Agent Continuous',
    'SN Product - Predictive Intelligence Continuous',
    'SN Product - Integration Hub Continuous',
    'SN Product - Now Mobile Continuous',
    'SN Product - Service Portal / UX / Front End Continuous',
    'SN Product - ATF Continuous',
    'SN Product - Flow Designer Continuous',
    'SN Product - Workflow Editor Continuous',
    'SN Product - Performance Analytics Continuous',
    'SN Product - Service Catalog Continuous',
    'Product Score - Applications Continuous',
    'Product Score - Platform Capabilities Continuous',
    'Product Score - Overall Continuous',
    'Statements - I contribute directly to revenue Continuous',
    'Statements - I contribute directly to reducing costs Continuous',
    'Statements - I contribute directly to maintaining and improving quality Continuous',
    'Statements - My org would be negatively impacted if I left Continuous',
    'Statements - My org would find it challenging to replace me Continuous',
    'Statement Score Continuous',
    'Satisfaction Score Continuous',
    'Satisfaction with - Current Employer Continuous',
    'Satisfaction with - Current Role Continuous',
    'Satisfaction with - Current Pay Continuous',
    'Satisfaction with - Future Career Prospects Continuous',
    'Country GNI Per Capita',
    'Years of Experience - Total Continuous', 
    'Years of Experience - IT Continuous',
    'Years of Experience - Non-IT Continuous', 
    'Years of Experience - ServiceNow Continuous', 
    'Years of Experience - Current Employer Continuous', 
    'Years of Experience - Current Role Continuous', 
    'Years of Military Service Continuous',
    'Number of Different Employers Continuous',
    'Certs - Total Continuous', 
    'Certs - Total Mainline + CIS Continuous', 
    'Certs - Total Micro Continuous', 
    'Certs - Total Major Continuous',
    'Certs - Total CIS Continuous',
    'Certs - Total Professional Continuous',
    'Remote Work Percent Continuous',
    'Hours Worked Per Day Continuous', 
    'Days Worked This Year Continuous', 
    'Total Hours Worked This Year Continuous',
    'Benefits - Total Count Continuous',
    'Compensation - Percent Fixed Continuous'
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

var softSkills = ['Skills - Communication and Presentation Skills', 'Skills - MultiLingual', 'Skills - Flexibility / Adaptability', 'Skills - Teamwork', 'Skills - Drive and Enthusiasm'];
var managementSkills = ['Skills - Project Management','Skills - Change Management'];
var salesAndMarketingSkills = ['Skills - Sales','Skills - Lead Generation / Marketing','Skills - Product Demo']
var architectureSkills = ['Skills - Process Design','Skills - Architectural Design','Skills - Documentation','Skills - Service Catalog Design'];
var devOverallSkills = ['Skills - Javascript','Skills - HTML','Skills - CSS','Skills - Jelly','Skills - Other Programming Languages','Skills - Integration Development','Skills - Scripted REST API Development','Skills - Front End Development','Skills - Service Catalog Configuration','Skills - Business Rule Development','Skills - Client Script Development','Skills - UI Policy Configuration','Skills - Workspaces Configuration'];
var devBasicSkills = ['Skills - Javascript','Skills - Business Rule Development','Skills - Client Script Development']
var devFrontedSkills = ['Skills - HTML','Skills - CSS','Skills - Jelly','Skills - Front End Development']
var devIntegrationSkills = ['Skills - Other Programming Languages','Skills - Integration Development','Skills - Scripted REST API Development'];
var devConfig = ['Skills - Service Catalog Configuration','Skills - UI Policy Configuration','Skills - Workspaces Configuration'];
var allSkills = [].concat(softSkills, managementSkills, salesAndMarketingSkills, architectureSkills, devOverallSkills);

var appProducts = ['SN Product - ITSM','SN Product - ITOM','SN Product - ITBM','SN Product - Software Asset Management','SN Product - Security Operations','SN Product - GRC','SN Product - HR Service Delivery','SN Product - CSM','SN Product - Custom Applications'];
var capabilityProducts = ['SN Product - Virtual Agent','SN Product - Predictive Intelligence','SN Product - Integration Hub','SN Product - Now Mobile','SN Product - Service Portal / UX / Front End','SN Product - ATF','SN Product - Flow Designer','SN Product - Workflow Editor','SN Product - Performance Analytics','SN Product - Service Catalog'];
var allProducts = [].concat(appProducts,capabilityProducts);

var majorCerts = ['Certs - ServiceNow Certified Master Architect','Certs - ServiceNow Certified System Administrator','Certs - ServiceNow Certified Application Developer'];
var cisCerts = ['Certs - ServiceNow CAS - Performance Analytics','Certs - ServiceNow CIS - Application Portfolio Management','Certs- ServiceNow CIS - Cloud Management ','Certs - ServiceNow CIS - Customer Service Management','Certs - ServiceNow CIS - Discovery','Certs - ServiceNow CIS - Event Management','Certs - ServiceNow CIS - Field Service Management','Certs - ServiceNow CIS - Human Resources','Certs - ServiceNow CIS - IT Service Management','Certs - ServiceNow CIS - Project Portfolio Management','Certs - ServiceNow CIS - Risk and Compliance','Certs - ServiceNow CIS - Security Incident Response','Certs - ServiceNow CIS - Service Mapping','Certs - ServiceNow CIS - Software Asset Management','Certs - ServiceNow CIS - Vulnerability Response','Certs - ServiceNow CIS - Vendor Risk Management'];
var microCerts = ['Certs - Agile Development and Test Management','Certs - Application Portfolio Management','Certs - Asset Model Management','Certs - Automated Test Framework (ATF)','Certs - CMDB Health','Certs - Configure the CDMB','Certs - CSM with Service Management for Implementers','Certs - Enterprise Onboarding and Transitions','Certs - Flow Designer','Certs - HR Integrations','Certs - IntegrationHub','Certs - Performance Analytics','Certs - Predictive Intelligence','Certs - Service Portal','Certs - Virtual Agent'];
var professionalCerts = ['Certs - ITIL Foundation','Certs - ITIL Above Foundation','Certs - Six Sigma','Certs - Professional Scrum Master','Certs - Certified Scrum Master','Certs - PMP'];
var allCerts = [].concat(majorCerts, cisCerts, microCerts, professionalCerts);
var allMainlineCerts = [].concat(majorCerts,cisCerts);
var allSNCerts = [].concat(majorCerts,cisCerts,microCerts);


var statementProperties = [
    'Statements - I contribute directly to revenue',
    'Statements - I contribute directly to reducing costs',
    'Statements - I contribute directly to maintaining and improving quality',
    'Statements - My org would be negatively impacted if I left',
    'Statements - My org would find it challenging to replace me'
];

var satisfactionProperties = [
    'Satisfaction with - Current Employer',
    'Satisfaction with - Current Role',
    'Satisfaction with - Current Pay',
    'Satisfaction with - Future Career Prospects'
];

function isHighFrequency(val) {
    return val >= 5;
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

function totalHighFrequencyUsage(values) {
    return values.reduce(function(total, current) {
        if (isHighFrequency(current)) {
            return total + 1;
        }
        else {
            return total;
        }
    }, 0);
}

function createGroupFromConcatPropsIf(propertyList, condition, valueMap) {
    return function(response) {
        var result = [];

        propertyList.forEach(function(property) {
            var val = response[property];
            
            if (valueMap) {
                val = valueMap[response[property]];
            }

            if (condition(val)) {
                result.push(property);
            }
        });

        return result.join(',');
    };
}

function isYes(val) {
    return val == 'Yes';
}

function isNotYes(val) {
    return val != 'Yes';
}

function isDailyOrWeekly(val) {
    return val == 'Daily' || val == 'Weekly';
}

function allValuesMatch(propertyList, condition) {
    return function(response) {
        var match = propertyList.reduce(function (accum, property) {
            return accum && condition(response[property]);
        }, true);

        if (match) {
            return 'Yes';
        }
        else {
            return 'No';
        }
    }
}

function hasItsmCertOnly() {
    return function(response) {
        var hasITSM = response['Certs - ServiceNow CIS - IT Service Management'] == 'Yes';
        var certCount = cisCerts.reduce(function(sum, certName) {
            if (response[certName] == 'Yes') {
                return sum + 1;
            }
            else {
                return sum;
            }
        }, 0);

        if (hasITSM && certCount == 1) {
            return 'Yes';
        }
        else {
            return 'No';
        }
    };
}

function worksOnOnlyOneProduct(productProp, productGroup) {
    return function(response) {
        var worksOnITSM = (response[productProp] == 'Daily' || response[productProp] == 'Weekly');
        var highFrequencyCount = productGroup.reduce(function(sum, property) {
            if (response[property] == 'Daily' || response[property] == 'Weekly') {
                return sum + 1;
            }
            else {
                return sum;
            }
        }, 0);

        if (worksOnITSM && highFrequencyCount == 1) {
            return 'Yes';
        }
        else {
            return 'No';
        }
    }
}

function getFixedAnnual(response) {
    return response['Compensation - Total Annual PPP USD'] * (response['Compensation - Percent Fixed'] / 100);
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

function identity(property) {
    return function(response) {
        return response[property];
    }
}


var computedProperties = {
    //'Age': identity('Age'),
    'Age Continuous': getFromValueMap('Age', valueMaps.Age),

    //'Gender': identity('Gender'),
    'Gender is Male': getComputedProperty('Gender', 'Male'),
    'Gender is Female': getComputedProperty('Gender', 'Female'),
    'Gender is Non-binary': getComputedProperty('Gender', 'Non-binary'),
    'Gender is Not specified': getComputedProperty('Gender', 'Prefer not to disclose'),

    //'Ethnicity': identity('Ethnicity'),
    'Ethnicity is White / Caucasian': getComputedProperty('Ethnicity', 'White / Caucasian'),
    'Ethnicity is Asian': getComputedProperty('Ethnicity', 'Asian'),
    'Ethnicity is Unknown': getComputedProperty('Ethnicity', 'Prefer not to disclose'),
    'Ethnicity is Black, African or Caribbean': getComputedProperty('Ethnicity', 'Black, African or Caribbean'),
    'Ethnicity is Hispanic or Latino': getComputedProperty('Ethnicity', 'Hispanic or Latino'),
    'Ethnicity is Arab': getComputedProperty('Ethnicity', 'Arab'),
    'Ethnicity is Native American': getComputedProperty('Ethnicity', 'Native American'),
    'Ethnicity is Mixed / multiple ethnic groups': getComputedProperty('Ethnicity', 'Mixed / multiple ethnic groups'),

    //'Disability Status': identity('Disability Status'),
    'Disability Status is Yes': getComputedProperty('Disability Status', 'Yes, I have a disability (or previously had a disability)'), // Groups prefer not to disclose with No
    'Disability Status is No': getComputedProperty('Disability Status', 'No, I do not I have a disability'), // Groups prefer not to disclose with Yes
    
    //'State': identity('State'),

    //'Country': identity('Country'),
    'Country GNI Per Capita': getFromValueMap('Country', valueMaps.Country),
    'Country is Poland': getComputedProperty('Country', 'Poland'),
    'Country is Ukraine': getComputedProperty('Country', 'Ukraine'),
    'Country is India': getComputedProperty('Country', 'India'),
    'Country is Brazil': getComputedProperty('Country', 'Brazil '),
    'Country is United States': getComputedProperty('Country', 'United States '),
    'Country is Italy': getComputedProperty('Country', 'Italy'),
    'Country is Prefer not to disclose': getComputedProperty('Country', 'Prefer not to disclose'),
    'Country is United Kingdom': getComputedProperty('Country', 'United Kingdom'),
    'Country is Netherlands': getComputedProperty('Country', 'Netherlands'),
    'Country is Sweden': getComputedProperty('Country', 'Sweden'),
    'Country is Australia': getComputedProperty('Country', 'Australia'),
    'Country is Costa Rica': getComputedProperty('Country', 'Costa Rica '),
    'Country is Belgium': getComputedProperty('Country', 'Belgium'),
    'Country is Philippines': getComputedProperty('Country', 'Philippines'),
    'Country is Canada': getComputedProperty('Country', 'Canada'),
    'Country is Bulgaria': getComputedProperty('Country', 'Bulgaria'),
    'Country is Germany': getComputedProperty('Country', 'Germany'),
    'Country is Spain': getComputedProperty('Country', 'Spain'),
    'Country is Switzerland': getComputedProperty('Country', 'Switzerland'),

    //'Continent': identity('Continent'),
    'Continent is Europe': getComputedProperty('Continent', 'Europe'),
    'Continent is Asia': getComputedProperty('Continent', 'Asia'),
    'Continent is South America': getComputedProperty('Continent', 'South America'),
    'Continent is North America': getComputedProperty('Continent', 'North America'),
    'Continent is Australia': getComputedProperty('Continent', 'Australia'),

    //'US Census Bureau Division': identity('US Census Bureau Division'),
    'US Census Bureau Division is West North Central': getComputedProperty('US Census Bureau Division', 'West North Central'),
    'US Census Bureau Division is South Atlantic': getComputedProperty('US Census Bureau Division', 'South Atlantic'),
    'US Census Bureau Division is West South Central': getComputedProperty('US Census Bureau Division', 'West South Central'),
    'US Census Bureau Division is Mountain': getComputedProperty('US Census Bureau Division', 'Mountain'),
    'US Census Bureau Division is Mid-Atlantic': getComputedProperty('US Census Bureau Division', 'Mid-Atlantic'),
    'US Census Bureau Division is East South Central': getComputedProperty('US Census Bureau Division', 'East South Central'),
    'US Census Bureau Division is East North Central': getComputedProperty('US Census Bureau Division', 'East North Central'),
    'US Census Bureau Division is Pacific': getComputedProperty('US Census Bureau Division', 'Pacific'),
    'US Census Bureau Division is New England': getComputedProperty('US Census Bureau Division', 'New England'),
    'US Census Bureau Division is Prefer not to disclose': getComputedProperty('US Census Bureau Division', 'Prefer not to disclose'),
    'US Census Bureau Division is Not-US': getComputedProperty('US Census Bureau Division', ''),
    
    //'US BEA Region': identity('US Bureau of Economic Analysis Region'),
    'US BEA Region is Not-US': getComputedProperty('US Bureau of Economic Analysis Region', ''),
    'US BEA Region is Plains': getComputedProperty('US Bureau of Economic Analysis Region', 'Plains'),
    'US BEA Region is Southeast': getComputedProperty('US Bureau of Economic Analysis Region', 'Southeast'),
    'US BEA Region is Rocky Mountain': getComputedProperty('US Bureau of Economic Analysis Region', 'Rocky Mountain'),
    'US BEA Region is Southwest': getComputedProperty('US Bureau of Economic Analysis Region', 'Southwest'),
    'US BEA Region is Mideast': getComputedProperty('US Bureau of Economic Analysis Region', 'Mideast'),
    'US BEA Region is Great Lakes': getComputedProperty('US Bureau of Economic Analysis Region', 'Great Lakes'),
    'US BEA Region is Far West': getComputedProperty('US Bureau of Economic Analysis Region', 'Far West'),
    'US BEA Region is New England': getComputedProperty('US Bureau of Economic Analysis Region', 'New England'),
    'US BEA Region is Prefer not to disclose': getComputedProperty('US Bureau of Economic Analysis Region', 'Prefer not to disclose'),
    
    //'US Census Bureau Region': identity('US Census Bureau Region'),
    'US Census Bureau Region is Not-US': getComputedProperty('US Census Bureau Region', ''),
    'US Census Bureau Region is Midwest': getComputedProperty('US Census Bureau Region', 'Midwest'),
    'US Census Bureau Region is South': getComputedProperty('US Census Bureau Region', 'South'),
    'US Census Bureau Region is West': getComputedProperty('US Census Bureau Region', 'West'),
    'US Census Bureau Region is Northeast': getComputedProperty('US Census Bureau Region', 'Northeast'),
    'US Census Bureau Region is Prefer not to disclose': getComputedProperty('US Census Bureau Region', 'Prefer not to disclose'),

    //'Is Veteran': identity('Is Veteran'),
    'Is Veteran is Yes': getComputedProperty('Is Veteran', 'Yes'), // Groups prefer not to disclose with No
    'Is Veteran is No': getComputedProperty('Is Veteran', 'No'), // Groups prefer not to disclose with Yes
    
    //'Served in Air Force': identity('Served in Air Force'),
    'Served in Air Force is Yes': getComputedProperty('Served in Air Force', 'Yes'), // Groups prefer not to disclose with No
    'Served in Air Force is No': getComputedProperty('Served in Air Force', 'No'), // Groups prefer not to disclose with Yes

    //'Served in Army': identity('Served in Army'),
    'Served in Army is Yes': getComputedProperty('Served in Army', 'Yes'), // Groups prefer not to disclose with No
    'Served in Army is No': getComputedProperty('Served in Army', 'No'), // Groups prefer not to disclose with Yes

    //'Served in Coast Guard': identity('Served in Coast Guard'),
    //'Served in Coast Guard is Yes': getComputedProperty('Served in Coast Guard', 'Yes'), // Groups prefer not to disclose with No
    //'Served in Coast Guard is No': getComputedProperty('Served in Coast Guard', 'No'), // Groups prefer not to disclose with Yes

    //'Served in National Guard': identity('Served in National Guard'),
    'Served in National Guard is Yes': getComputedProperty('Served in National Guard', 'Yes'), // Groups prefer not to disclose with No
    'Served in National Guard is No': getComputedProperty('Served in National Guard', 'No'), // Groups prefer not to disclose with Yes

    //'Served in Navy': identity('Served in Navy'),
    'Served in Navy is Yes': getComputedProperty('Served in Navy', 'Yes'), // Groups prefer not to disclose with No
    'Served in Navy is No': getComputedProperty('Served in Navy', 'No'), // Groups prefer not to disclose with Yes

    //'Served in Marine Corps': identity('Served in Marine Corps'),
    'Served in Marine Corps is Yes': getComputedProperty('Served in Marine Corps', 'Yes'), // Groups prefer not to disclose with No
    'Served in Marine Corps is No': getComputedProperty('Served in Marine Corps', 'No'), // Groups prefer not to disclose with Yes

    //'Served in Space Force': identity('Served in Space Force'),
    //'Served in Space Force is Yes': getComputedProperty('Served in Space Force', 'Yes'), // Groups prefer not to disclose with No
    //'Served in Space Force is No': getComputedProperty('Served in Space Force', 'No'), // Groups prefer not to disclose with Yes

    //'Served in Unspecified Branch': identity('Served in Unspecified Branch'),
    //'Served in Unspecified Branch is Yes': getComputedProperty('Served in Unspecified Branch', 'Yes'), // Groups prefer not to disclose with No
    //'Served in Unspecified Branch is No': getComputedProperty('Served in Unspecified Branch', 'No'), // Groups prefer not to disclose with Yes

    //'Served in Active Duty': identity('Served in Active Duty'),
    'Served in Active Duty is Yes': getComputedProperty('Served in Active Duty', 'Yes'), // Groups prefer not to disclose with No
    //'Served in Active Duty is No': getComputedProperty('Served in Active Duty', 'No'), // Groups prefer not to disclose with Yes

    //'Served in Reserve': identity('Served in Reserve'),
    'Served in Reserve is Yes': getComputedProperty('Served in Reserve', 'Yes'), // Groups prefer not to disclose with No
    'Served in Reserve is No': getComputedProperty('Served in Reserve', 'No'), // Groups prefer not to disclose with Yes

    //'Served in National Guard2': identity('Served in National Guard2'),
    //'Served in National Guard2 is Yes': getComputedProperty('Served in National Guard2', 'Yes'), // Groups prefer not to disclose with No
    //'Served in National Guard2 is No': getComputedProperty('Served in National Guard2', 'No'), // Groups prefer not to disclose with Yes

    //'Served in Unspecified Military Component': identity('Served in Unspecified Military Component'),
    //'Served in Unspecified Military Component is Yes': getComputedProperty('Served in Unspecified Military Component', 'Yes'), // Groups prefer not to disclose with No
    //'Served in Unspecified Military Component is No': getComputedProperty('Served in Unspecified Military Component', 'No'), // Groups prefer not to disclose with Yes

    //'Served as Enlisted': identity('Served as Enlisted'),
    'Served as Enlisted is Yes': getComputedProperty('Served as Enlisted', 'Yes'), // Groups prefer not to disclose with No
    'Served as Enlisted is No': getComputedProperty('Served as Enlisted', 'Prefer not to disclose'), // Groups prefer not to disclose with Yes

    //'Served as Officer': identity('Served as Officer'),
    'Served as Officer is Yes': getComputedProperty('Served as Officer', 'Yes'), // Groups prefer not to disclose with No
    'Served as Officer is No': getComputedProperty('Served as Officer', 'No'), // Groups prefer not to disclose with Yes

    //'Years of Military Service': identity('Years of Military Service'),
    'Years of Military Service Continuous': identity('Years of Military Service'),

    //'Gender Majority Self-Identity': identity('Gender Majority Self-Identity'),
    'Gender Majority Self-Identity is Yes': getComputedProperty('Gender Majority Self-Identity', 'Yes'), // Groups prefer not to disclose with No
    'Gender Majority Self-Identity is No': getComputedProperty('Gender Majority Self-Identity', 'No'), // Groups prefer not to disclose with Yes
    
    //'Ethnic Majority Self-Identity': identity('Ethnic  Majority Self-Identity'),
    'Ethnic Majority Self-Identity is Yes': getComputedProperty('Ethnic  Majority Self-Identity', 'Yes'), // Groups prefer not to disclose with No
    'Ethnic Majority Self-Identity is No': getComputedProperty('Ethnic  Majority Self-Identity', 'No'), // Groups prefer not to disclose with Yes

    //'Cultural Majority Self-Identity': identity('Cultural Majority Self-Identity'),
    'Cultural Majority Self-Identity is Yes': getComputedProperty('Cultural Majority Self-Identity', 'Yes'), // Groups prefer not to disclose with No
    'Cultural Majority Self-Identity is No': getComputedProperty('Cultural Majority Self-Identity', 'No'), // Groups prefer not to disclose with Yes

    //'Socioeconomic Majority Self-Identity': identity('Socioeconomic Majority Self-Identity'),
    'Socioeconomic Majority Self-Identity is Yes': getComputedProperty('Socioeconomic Majority Self-Identity', 'Yes'), // Groups prefer not to disclose with No
    'Socioeconomic Majority Self-Identity is No': getComputedProperty('Socioeconomic Majority Self-Identity', 'No'), // Groups prefer not to disclose with Yes

    //'Religious Majority Self-Identity': identity('Religious Majority Self-Identity'),
    'Religious Majority Self-Identity is Yes': getComputedProperty('Religious Majority Self-Identity', 'Yes'), // Groups prefer not to disclose with No
    'Religious Majority Self-Identity is No': getComputedProperty('Religious Majority Self-Identity', 'No'), // Groups prefer not to disclose with Yes

    //'Language Majority Self-Identity': identity('Language Majority Self-Identity'),
    'Language Majority Self-Identity is Yes': getComputedProperty('Language Majority Self-Identity', 'Yes'), // Groups prefer not to disclose with No
    'Language Majority Self-Identity is No': getComputedProperty('Language Majority Self-Identity', 'No'), // Groups prefer not to disclose with Yes

    'Highest Level of Education Continuous': getFromValueMap('Highest Level of Education', valueMaps.Education),
    //'Highest Level of Education': identity('Highest Level of Education'),

    //'College Field of Study': identity('College Field of Study'),
    'College Field of Study Accounting': getComputedProperty('College Field of Study', 'Accounting'),
    'College Field of Study Anthropology': getComputedProperty('College Field of Study', 'Anthropology'),
    'College Field of Study Arts': getComputedProperty('College Field of Study', 'Arts'),
    'College Field of Study Business Administration': getComputedProperty('College Field of Study', 'Business Administration'),
    'College Field of Study Communications': getComputedProperty('College Field of Study', 'Communications'),
    'College Field of Study Computer Science': getComputedProperty('College Field of Study', 'Computer Science'),
    'College Field of Study Did not attend college': getComputedProperty('College Field of Study', 'Did not attend college'),
    'College Field of Study Economics': getComputedProperty('College Field of Study', 'Economics'),
    'College Field of Study Electrical Engineering': getComputedProperty('College Field of Study', 'Electrical Engineering'),
    'College Field of Study Electronics': getComputedProperty('College Field of Study', 'Electronics'),
    'College Field of Study Electronics and Communication': getComputedProperty('College Field of Study', 'Electronics and Communication'),
    'College Field of Study Electronics and Communication Engineering': getComputedProperty('College Field of Study', 'Electronics and Communication Engineering'),
    'College Field of Study Engineering': getComputedProperty('College Field of Study', 'Engineering'),
    'College Field of Study English Literature': getComputedProperty('College Field of Study', 'English Literature'),
    'College Field of Study Fine Arts': getComputedProperty('College Field of Study', 'Fine Arts'),
    'College Field of Study History': getComputedProperty('College Field of Study', 'History'),
    'College Field of Study Industrial / Systems Engineering': getComputedProperty('College Field of Study', 'Industrial / Systems Engineering'),
    'College Field of Study Information Technology': getComputedProperty('College Field of Study', 'Information Technology'),
    'College Field of Study Interactive Entertainment': getComputedProperty('College Field of Study', 'Interactive Entertainment'),
    'College Field of Study Interdisciplinary': getComputedProperty('College Field of Study', 'Interdisciplinary'),
    'College Field of Study Liberal Arts': getComputedProperty('College Field of Study', 'Liberal Arts'),
    'College Field of Study Mathematics': getComputedProperty('College Field of Study', 'Mathematics'),
    'College Field of Study Mechanical Engineering': getComputedProperty('College Field of Study', 'Mechanical Engineering'),
    'College Field of Study Multimedia and Web Design': getComputedProperty('College Field of Study', 'Multimedia and Web Design'),
    'College Field of Study Music': getComputedProperty('College Field of Study', 'Music'),
    'College Field of Study Non-science major': getComputedProperty('College Field of Study', 'Non-science major'),
    'College Field of Study Nursing': getComputedProperty('College Field of Study', 'Nursing'),
    'College Field of Study Philosophy': getComputedProperty('College Field of Study', 'Philosophy'),
    'College Field of Study Political Science': getComputedProperty('College Field of Study', 'Political Science'),
    'College Field of Study Prefer not to disclose': getComputedProperty('College Field of Study', 'Prefer not to disclose'),
    'College Field of Study Psychology': getComputedProperty('College Field of Study', 'Psychology'),
    'College Field of Study Religious Studies': getComputedProperty('College Field of Study', 'Religious Studies'),
    'College Field of Study Science': getComputedProperty('College Field of Study', 'Science'),
    'College Field of Study Sociology/Anthropology': getComputedProperty('College Field of Study', 'Sociology/Anthropology'),
    'College Field of Study Software Engineering': getComputedProperty('College Field of Study', 'Software Engineering'),

    /*
    'Years of Experience - Total': identity('Years of Experience - Total'), 
    'Years of Experience - IT': identity('Years of Experience - IT'),
    'Years of Experience - Non-IT': identity('Years of Experience - Non-IT'), 
    'Years of Experience - ServiceNow': identity('Years of Experience - ServiceNow'), 
    'Years of Experience - Current Employer': identity('Years of Experience - Current Employer'), 
    'Years of Experience - Current Role': identity('Years of Experience - Current Role'),
    */
    'Years of Experience - Total Continuous': identity('Years of Experience - Total'), 
    'Years of Experience - IT Continuous': identity('Years of Experience - IT'),
    'Years of Experience - Non-IT Continuous': identity('Years of Experience - Non-IT'), 
    'Years of Experience - ServiceNow Continuous': identity('Years of Experience - ServiceNow'), 
    'Years of Experience - Current Employer Continuous': identity('Years of Experience - Current Employer'), 
    'Years of Experience - Current Role Continuous': identity('Years of Experience - Current Role'),

    'Number of Different Employers Continuous': identity('Number of Different Employers',),
    //'Number of Different Employers': identity('Number of Different Employers',),

    'Certs - ServiceNow Certified Master Architect': identity('Certs - ServiceNow Certified Master Architect'),
    'Certs - ServiceNow Certified System Administrator': identity('Certs - ServiceNow Certified System Administrator'),
    'Certs - ServiceNow Certified Application Developer': identity('Certs - ServiceNow Certified Application Developer'),

    'Certs - ServiceNow CAS - Performance Analytics': identity('Certs - ServiceNow CAS - Performance Analytics'),
    'Certs - ServiceNow CIS - Application Portfolio Management': identity('Certs - ServiceNow CIS - Application Portfolio Management'),
    'Certs- ServiceNow CIS - Cloud Management ': identity('Certs- ServiceNow CIS - Cloud Management '),
    'Certs - ServiceNow CIS - Customer Service Management': identity('Certs - ServiceNow CIS - Customer Service Management'),
    'Certs - ServiceNow CIS - Discovery': identity('Certs - ServiceNow CIS - Discovery'),
    'Certs - ServiceNow CIS - Event Management': identity('Certs - ServiceNow CIS - Event Management'),
    'Certs - ServiceNow CIS - Field Service Management': identity('Certs - ServiceNow CIS - Field Service Management'),
    'Certs - ServiceNow CIS - Human Resources': identity('Certs - ServiceNow CIS - Human Resources'),
    'Certs - ServiceNow CIS - IT Service Management': identity('Certs - ServiceNow CIS - IT Service Management'),
    'Certs - ServiceNow CIS - Project Portfolio Management': identity('Certs - ServiceNow CIS - Project Portfolio Management'),
    'Certs - ServiceNow CIS - Risk and Compliance': identity('Certs - ServiceNow CIS - Risk and Compliance'),
    'Certs - ServiceNow CIS - Security Incident Response': identity('Certs - ServiceNow CIS - Security Incident Response'),
    'Certs - ServiceNow CIS - Service Mapping': identity('Certs - ServiceNow CIS - Service Mapping'),
    'Certs - ServiceNow CIS - Software Asset Management': identity('Certs - ServiceNow CIS - Software Asset Management'),
    'Certs - ServiceNow CIS - Vulnerability Response': identity('Certs - ServiceNow CIS - Vulnerability Response'),
    'Certs - ServiceNow CIS - Vendor Risk Management': identity('Certs - ServiceNow CIS - Vendor Risk Management'),
    
    'Certs - Micro - Agile Development and Test Management': identity('Certs - Agile Development and Test Management'),
    'Certs - Micro - Application Portfolio Management': identity('Certs - Application Portfolio Management'),
    'Certs - Micro - Asset Model Management': identity('Certs - Asset Model Management'),
    'Certs - Micro - Automated Test Framework (ATF)': identity('Certs - Automated Test Framework (ATF)'),
    'Certs - Micro - CMDB Health': identity('Certs - CMDB Health'),
    'Certs - Micro - Configure the CDMB': identity('Certs - Configure the CDMB'),
    'Certs - Micro - CSM with Service Management for Implementers': identity('Certs - CSM with Service Management for Implementers'),
    'Certs - Micro - Enterprise Onboarding and Transitions': identity('Certs - Enterprise Onboarding and Transitions'),
    'Certs - Micro - Flow Designer': identity('Certs - Flow Designer'),
    'Certs - Micro - HR Integrations': identity('Certs - HR Integrations'),
    'Certs - Micro - HR Integrations': identity('Certs - HR Integrations'),
    'Certs - Micro - IntegrationHub': identity('Certs - IntegrationHub'),
    'Certs - Micro - Performance Analytics': identity('Certs - Performance Analytics'),
    'Certs - Micro - Predictive Intelligence': identity('Certs - Predictive Intelligence'),
    'Certs - Micro - Service Portal': identity('Certs - Service Portal'),
    'Certs - Micro - Virtual Agent': identity('Certs - Virtual Agent'),
    'Certs - Micro - ITIL Foundation': identity('Certs - ITIL Foundation'),
    'Certs - Micro - ITIL Above Foundation': identity('Certs - ITIL Above Foundation'),
    
    'Certs - Six Sigma': identity('Certs - Six Sigma'),
    'Certs - Professional Scrum Master': identity('Certs - Professional Scrum Master'),
    'Certs - Certified Scrum Master': identity('Certs - Certified Scrum Master'),
    'Certs - PMP': identity('Certs - PMP'),

    'Certs - Total': identity('Certs - Total'),
    'Certs - Total Continuous': identity('Certs - Total'),

    'Certs - Total Mainline + CIS': identity('Certs - Total Mainline'),
    'Certs - Total Mainline + CIS Continuous': identity('Certs - Total Mainline'),

    'Certs - Total Micro': identity('Certs - Total'),
    'Certs - Total Micro Continuous': identity('Certs - Total'),

    'Certs - Total Major': getComputedValue(majorCerts, calculateSum, valueMaps.YesNoNumeric),
    'Certs - Total Major Continuous': getComputedValue(majorCerts, calculateSum, valueMaps.YesNoNumeric),

    'Certs - Total CIS': getComputedValue(cisCerts, calculateSum, valueMaps.YesNoNumeric),
    'Certs - Total CIS Continuous': getComputedValue(cisCerts, calculateSum, valueMaps.YesNoNumeric),

    'Certs - Total Professional': getComputedValue(professionalCerts, calculateSum, valueMaps.YesNoNumeric),
    'Certs - Total Professional Continuous': getComputedValue(professionalCerts, calculateSum, valueMaps.YesNoNumeric),

    'Certs - Has ITSM Only': hasItsmCertOnly(),
    'Certs - Has No CIS': allValuesMatch(cisCerts, isNotYes),
    'Certs - Has No Certs': allValuesMatch(allCerts, isNotYes),
    'Certs - Has No Mainline Certs': allValuesMatch(allMainlineCerts, isNotYes),
    'Certs - Has No SN Certs': allValuesMatch(allSNCerts, isNotYes),
    'Certs - ITSM / CSM': allValuesMatch(['Certs - ServiceNow CIS - IT Service Management','Certs - ServiceNow CIS - Customer Service Management'], isYes),
    'Certs - ITSM / PPM': allValuesMatch(['Certs - ServiceNow CIS - IT Service Management','Certs - ServiceNow CIS - Project Portfolio Management'], isYes),
    'Certs - ITSM / Discovery': allValuesMatch(['Certs - ServiceNow CIS - IT Service Management','Certs - ServiceNow CIS - Discovery'], isYes),
    'Certs - ITSM / Event Management': allValuesMatch(['Certs - ServiceNow CIS - IT Service Management','Certs - ServiceNow CIS - Event Management'], isYes),
    'Certs - ITSM / HR': allValuesMatch(['Certs - ServiceNow CIS - IT Service Management','Certs - ServiceNow CIS - Human Resources'], isYes),
    'Certs - ITSM / Service Mapping': allValuesMatch(['Certs - ServiceNow CIS - IT Service Management','Certs - ServiceNow CIS - Service Mapping'], isYes),
    'Certs - ITSM / Software Asset Mapping': allValuesMatch(['Certs - ServiceNow CIS - IT Service Management','Certs - ServiceNow CIS - Software Asset Management'], isYes),
    'Certs - Discovery / APM': allValuesMatch(['Certs - ServiceNow CIS - Discovery','Certs - ServiceNow CIS - Application Portfolio Management'], isYes),
    'Certs - Discovery / CSM': allValuesMatch(['Certs - ServiceNow CIS - Discovery','Certs - ServiceNow CIS - Customer Service Management'], isYes),
    'Certs - Discovery / Event Management': allValuesMatch(['Certs - ServiceNow CIS - Discovery','Certs - ServiceNow CIS - Event Management'], isYes),
    'Certs - Discovery / HR': allValuesMatch(['Certs - ServiceNow CIS - Discovery','Certs - ServiceNow CIS - Human Resources'], isYes),
    'Certs - Discovery / PPM': allValuesMatch(['Certs - ServiceNow CIS - Discovery','Certs - ServiceNow CIS - Project Portfolio Management'], isYes),
    'Certs - Discovery / Service Mapping': allValuesMatch(['Certs - ServiceNow CIS - Discovery','Certs - ServiceNow CIS - Service Mapping'], isYes),
    'Certs - Discovery / SAM': allValuesMatch(['Certs - ServiceNow CIS - Discovery','Certs - ServiceNow CIS - Software Asset Management'], isYes),
    'Certs - Discovery / Vulnerability': allValuesMatch(['Certs - ServiceNow CIS - Discovery','Certs - ServiceNow CIS - Vulnerability Response'], isYes),
    'Certs - Event Management / APM': allValuesMatch(['Certs - ServiceNow CIS - Event Management','Certs - ServiceNow CIS - Application Portfolio Management'], isYes),
    'Certs - Event Management / CSM': allValuesMatch(['Certs - ServiceNow CIS - Event Management','Certs - ServiceNow CIS - Customer Service Management'], isYes),
    'Certs - Event Management / HR': allValuesMatch(['Certs - ServiceNow CIS - Event Management','Certs - ServiceNow CIS - Human Resources'], isYes),
    'Certs - Event Management / PPM': allValuesMatch(['Certs - ServiceNow CIS - Event Management','Certs - ServiceNow CIS - Project Portfolio Management'], isYes),
    'Certs - Event Management / Service Mapping': allValuesMatch(['Certs - ServiceNow CIS - Event Management','Certs - ServiceNow CIS - Service Mapping'], isYes),
    'Certs - Event Management / SAM': allValuesMatch(['Certs - ServiceNow CIS - Event Management','Certs - ServiceNow CIS - Software Asset Management'], isYes),
    'Certs - Event Management / Vulnerability': allValuesMatch(['Certs - ServiceNow CIS - Event Management','Certs - ServiceNow CIS - Vulnerability Response'], isYes),
    'Certs - HR / APM': allValuesMatch(['Certs - ServiceNow CIS - Human Resources','Certs - ServiceNow CIS - Application Portfolio Management'], isYes),
    'Certs - HR / CSM': allValuesMatch(['Certs - ServiceNow CIS - Human Resources','Certs - ServiceNow CIS - Customer Service Management'], isYes),
    'Certs - CSM / PPM': allValuesMatch(['Certs - ServiceNow CIS - Customer Service Management','Certs - ServiceNow CIS - Project Portfolio Management'], isYes),
    'Certs - CSM / Service Mapping': allValuesMatch(['Certs - ServiceNow CIS - Customer Service Management','Certs - ServiceNow CIS - Service Mapping'], isYes),
    'Certs - Vulnerability / Security Inc': allValuesMatch(['Certs - ServiceNow CIS - Vulnerability Response','Certs - ServiceNow CIS - Security Incident Response'], isYes),
/*TODO: Eta Squared*/

    //'Employment Status': identity('Employment Status'),
    'Employment Status is Permanent - Full Time': getComputedProperty('Employment Status', 'Permanent - Full Time'),
    'Employment Status is Freelance / Contractor': getComputedProperty('Employment Status', 'Freelance / Contractor'),
    'Employment Status is Unemployed': getComputedProperty('Employment Status', 'Unemployed'),
    'Employment Status is Permanent - Part Time': getComputedProperty('Employment Status', 'Permanent - Part Time'),

    //'Current Job Role': identity('Current Job Role'),
    'Current Job Role is Technical Architect': getComputedProperty('Current Job Role', 'Technical Architect'),
    'Current Job Role is ServiceNow Developer/Programmer': getComputedProperty('Current Job Role', 'ServiceNow Developer/Programmer'),
    'Current Job Role is ServiceNow Administrator': getComputedProperty('Current Job Role', 'ServiceNow Administrator'),
    'Current Job Role is Technical Analyst': getComputedProperty('Current Job Role', 'Technical Analyst'),
    'Current Job Role is Project Manager': getComputedProperty('Current Job Role', 'Project Manager'),
    'Current Job Role is Business Analyst': getComputedProperty('Current Job Role', 'Business Analyst'),
    'Current Job Role is Solutions Architect': getComputedProperty('Current Job Role', 'Solutions Architect'),
    'Current Job Role is Manager': getComputedProperty('Current Job Role', 'Manager'),
    'Current Job Role is Director': getComputedProperty('Current Job Role', 'Director'),
    'Current Job Role is Process Owner': getComputedProperty('Current Job Role', 'Process Owner'),
    'Current Job Role is Practice Lead': getComputedProperty('Current Job Role', 'Practice Lead'),
    'Current Job Role is Engagement Manager': getComputedProperty('Current Job Role', 'Engagement Manager'),
    'Current Job Role is Management': getComputedProperty('Current Job Role', 'Management', valueMaps.CurrentJobRole),
    'Current Job Role is Architect': getComputedProperty('Current Job Role', 'Architect', valueMaps.CurrentJobRole),
    'Current Job Role is Pre-Sales Consultant': getComputedProperty('Current Job Role', 'Pre-Sales Consultant'),
    'Current Job Role is Technical Analyst / Business Analyst': getComputedProperty('Current Job Role', 'Business Analyst / Technical Anlayst', valueMaps.CurrentJobRole),

    'Current Job Level Continuous': getFromValueMap('Current Job Level', valueMaps.JobLevel),
    //'Current Job Level': identity('Current Job Level'),
    'Current Job Level is Entry level': getComputedProperty('Current Job Level', 'Entry level'),
    'Current Job Level is Intermediate or experienced level': getComputedProperty('Current Job Level', 'Intermediate or experienced level'),
    'Current Job Level is Senior experienced level': getComputedProperty('Current Job Level', 'Senior experienced level'),
    'Current Job Level is First-level management': getComputedProperty('Current Job Level', 'First-level management'),
    'Current Job Level is Middle-level management': getComputedProperty('Current Job Level', 'Middle-level management'),
    'Current Job Level is Senior, executive or top-level management': getComputedProperty('Current Job Level', 'Senior, executive or top-level management'),

    //'Remote Work Percent': identity('Remote Work Percent'),
    'Remote Work Percent Continuous': identity('Remote Work Percent'),

    //'Hours Worked Per Day': identity('Hours Worked Per Day'), 
    'Hours Worked Per Day Continuous': identity('Hours Worked Per Day'), 

    //'Days Worked This Year': identity('Days Worked This Year'),
    'Days Worked This Year Continuous': identity('Days Worked This Year'),

    //'Total Hours Worked This Year': identity('Total Hours Worked This Year'),
    'Total Hours Worked This Year Continuous': identity('Total Hours Worked This Year'),

    'Skills - Communication and Presentation Skills Continuous': getFromValueMap('Skills - Communication and Presentation Skills', valueMaps.Frequency),
    //'Skills - Communication and Presentation Skills': identity('Skills - Communication and Presentation Skills'),

    'Skills - MultiLingual Continuous': getFromValueMap('Skills - MultiLingual', valueMaps.Frequency),
    //'Skills - MultiLingual': identity('Skills - MultiLingual'),

    'Skills - Flexibility / Adaptability Continuous': getFromValueMap('Skills - Flexibility / Adaptability', valueMaps.Frequency),
    //'Skills - Flexibility / Adaptability': identity('Skills - Flexibility / Adaptability'),

    'Skills - Teamwork Continuous': getFromValueMap('Skills - Teamwork', valueMaps.Frequency),
    //'Skills - Teamwork': identity('Skills - Teamwork'),

    'Skills - Drive and Enthusiasm Continuous': getFromValueMap('Skills - Drive and Enthusiasm', valueMaps.Frequency),
    //'Skills - Drive and Enthusiasm': identity('Skills - Drive and Enthusiasm'),

    'Skills - Project Management Continuous': getFromValueMap('Skills - Project Management', valueMaps.Frequency),
    //'Skills - Project Management': identity('Skills - Project Management'),

    'Skills - Change Management Continuous': getFromValueMap('Skills - Change Management', valueMaps.Frequency),
    //'Skills - Change Management': identity('Skills - Change Management'),

    'Skills - Sales Continuous': getFromValueMap('Skills - Sales', valueMaps.Frequency),
    //'Skills - Sales': identity('Skills - Sales'),

    'Skills - Lead Generation / Marketing Continuous': getFromValueMap('Skills - Lead Generation / Marketing', valueMaps.Frequency),
    //'Skills - Lead Generation / Marketing': identity('Skills - Lead Generation / Marketing'),

    'Skills - Product Demo Continuous': getFromValueMap('Skills - Product Demo', valueMaps.Frequency),
    //'Skills - Product Demo': identity('Skills - Product Demo'),

    'Skills - Process Design Continuous': getFromValueMap('Skills - Process Design', valueMaps.Frequency),
    //'Skills - Process Design': identity('Skills - Process Design'),

    'Skills - Architectural Design Continuous': getFromValueMap('Skills - Architectural Design', valueMaps.Frequency),
    //'Skills - Architectural Design': identity('Skills - Architectural Design'),

    'Skills - Documentation Continuous': getFromValueMap('Skills - Documentation', valueMaps.Frequency),
    //'Skills - Documentation': identity('Skills - Documentation'),

    'Skills - Service Catalog Design Continuous': getFromValueMap('Skills - Service Catalog Design', valueMaps.Frequency),
    //'Skills - Service Catalog Design': identity('Skills - Service Catalog Design'),

    'Skills - Javascript Continuous': getFromValueMap('Skills - Javascript', valueMaps.Frequency),
    //'Skills - Javascript': identity('Skills - Javascript'),

    'Skills - HTML Continuous': getFromValueMap('Skills - HTML', valueMaps.Frequency),
    //'Skills - HTML': identity('Skills - HTML'),

    'Skills - CSS Continuous': getFromValueMap('Skills - CSS', valueMaps.Frequency),
    //'Skills - CSS': identity('Skills - CSS'),

    'Skills - Jelly Continuous': getFromValueMap('Skills - Jelly', valueMaps.Frequency),
    //'Skills - Jelly': identity('Skills - Jelly'),

    'Skills - Other Programming Languages Continuous': getFromValueMap('Skills - Other Programming Languages', valueMaps.Frequency),
    //'Skills - Other Programming Languages': identity('Skills - Other Programming Languages'),

    'Skills - Integration Development Continuous': getFromValueMap('Skills - Integration Development', valueMaps.Frequency),
    //'Skills - Integration Development': identity('Skills - Integration Development'),

    'Skills - Scripted REST API Development Continuous': getFromValueMap('Skills - Scripted REST API Development', valueMaps.Frequency),
    //'Skills - Scripted REST API Development': identity('Skills - Scripted REST API Development'),

    'Skills - Front End Development Continuous': getFromValueMap('Skills - Front End Development', valueMaps.Frequency),
    //'Skills - Front End Development': identity('Skills - Front End Development'),

    'Skills - Service Catalog Configuration Continuous': getFromValueMap('Skills - Service Catalog Configuration', valueMaps.Frequency),
    //'Skills - Service Catalog Configuration': identity('Skills - Service Catalog Configuration'),

    'Skills - Business Rule Development Continuous': getFromValueMap('Skills - Business Rule Development', valueMaps.Frequency),
    //'Skills - Business Rule Development': identity('Skills - Business Rule Development'),

    'Skills - Client Script Development Continuous': getFromValueMap('Skills - Client Script Development', valueMaps.Frequency),
    //'Skills - Client Script Development': identity('Skills - Client Script Development'),

    'Skills - UI Policy Configuration Continuous': getFromValueMap('Skills - UI Policy Configuration', valueMaps.Frequency),
    //'Skills - UI Policy Configuration': identity('Skills - UI Policy Configuration'),

    'Skills - Workspaces Configuration Continuous': getFromValueMap('Skills - Workspaces Configuration', valueMaps.Frequency),
    //'Skills - Workspaces Configuration': identity('Skills - Workspaces Configuration'),

    /*
    'Skills Score - Soft Skill': getComputedValue(softSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Total': getComputedValue(allSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Soft Skill': getComputedValue(softSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Management': getComputedValue(managementSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Sales and Marketing': getComputedValue(salesAndMarketingSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Architectural': getComputedValue(architectureSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Dev Overall': getComputedValue(devOverallSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Dev Basic': getComputedValue(devBasicSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Dev Front End': getComputedValue(devFrontedSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Dev Integration': getComputedValue(devIntegrationSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Dev Config': getComputedValue(devConfig, calculateSum, valueMaps.Frequency),
    */

    'Skills Score - Soft Skill Continuous': getComputedValue(softSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Total Continuous': getComputedValue(allSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Soft Skill Continuous': getComputedValue(softSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Management Continuous': getComputedValue(managementSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Sales and Marketing Continuous': getComputedValue(salesAndMarketingSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Architectural Continuous': getComputedValue(architectureSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Dev Overall Continuous': getComputedValue(devOverallSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Dev Basic Continuous': getComputedValue(devBasicSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Dev Front End Continuous': getComputedValue(devFrontedSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Dev Integration Continuous': getComputedValue(devIntegrationSkills, calculateSum, valueMaps.Frequency),
    'Skills Score - Dev Config Continuous': getComputedValue(devConfig, calculateSum, valueMaps.Frequency),

    'Skills Score - Total High Frequency Skills': getComputedValue(allSkills, totalHighFrequencyUsage, valueMaps.Frequency),
    'Skills Score - Total High Frequency Skills Continuous': getComputedValue(allSkills, totalHighFrequencyUsage, valueMaps.Frequency),

    'SN Product - ITSM Continuous': getFromValueMap('SN Product - ITSM', valueMaps.Frequency),
    //'SN Product - ITSM': identity('SN Product - ITSM'),

    'SN Product - ITOM Continuous': getFromValueMap('SN Product - ITOM', valueMaps.Frequency),
    //'SN Product - ITOM': identity('SN Product - ITOM'),

    'SN Product - ITBM Continuous': getFromValueMap('SN Product - ITBM', valueMaps.Frequency),
    //'SN Product - ITBM': identity('SN Product - ITBM'),

    'SN Product - Software Asset Management Continuous': getFromValueMap('SN Product - Software Asset Management', valueMaps.Frequency),
    //'SN Product - Software Asset Management': identity('SN Product - Software Asset Management'),

    'SN Product - Security Operations Continuous': getFromValueMap('SN Product - Security Operations', valueMaps.Frequency),
    //'SN Product - Security Operations': identity('SN Product - Security Operations'),

    'SN Product - GRC Continuous': getFromValueMap('SN Product - GRC', valueMaps.Frequency),
    //'SN Product - GRC': identity('SN Product - GRC'),

    'SN Product - HR Service Delivery Continuous': getFromValueMap('SN Product - HR Service Delivery', valueMaps.Frequency),
    //'SN Product - HR Service Delivery': identity('SN Product - HR Service Delivery'),

    'SN Product - CSM Continuous': getFromValueMap('SN Product - CSM', valueMaps.Frequency),
    //'SN Product - CSM': identity('SN Product - CSM'),

    'SN Product - Custom Applications Continuous': getFromValueMap('SN Product - Custom Applications', valueMaps.Frequency),
    //'SN Product - Custom Applications': identity('SN Product - Custom Applications'),

    'SN Product - Virtual Agent Continuous': getFromValueMap('SN Product - Virtual Agent', valueMaps.Frequency),
    //'SN Product - Virtual Agent': identity('SN Product - Virtual Agent'),

    'SN Product - Predictive Intelligence Continuous': getFromValueMap('SN Product - Predictive Intelligence', valueMaps.Frequency),
    //'SN Product - Predictive Intelligence': identity('SN Product - Predictive Intelligence'),

    'SN Product - Integration Hub Continuous': getFromValueMap('SN Product - Integration Hub', valueMaps.Frequency),
    //'SN Product - Integration Hub': identity('SN Product - Integration Hub'),

    'SN Product - Now Mobile Continuous': getFromValueMap('SN Product - Now Mobile', valueMaps.Frequency),
    //'SN Product - Now Mobile': identity('SN Product - Now Mobile'),

    'SN Product - Service Portal / UX / Front End Continuous': getFromValueMap('SN Product - Service Portal / UX / Front End', valueMaps.Frequency),
    //'SN Product - Service Portal / UX / Front End': identity('SN Product - Service Portal / UX / Front End'),

    'SN Product - ATF Continuous': getFromValueMap('SN Product - ATF', valueMaps.Frequency),
    //'SN Product - ATF': identity('SN Product - ATF'),

    'SN Product - Flow Designer Continuous': getFromValueMap('SN Product - Flow Designer', valueMaps.Frequency),
    //'SN Product - Flow Designer': identity('SN Product - Flow Designer'),

    'SN Product - Workflow Editor Continuous': getFromValueMap('SN Product - Workflow Editor', valueMaps.Frequency),
    //'SN Product - Workflow Editor': identity('SN Product - Workflow Editor'),

    'SN Product - Performance Analytics Continuous': getFromValueMap('SN Product - Performance Analytics', valueMaps.Frequency),
    //'SN Product - Performance Analytics': identity('SN Product - Performance Analytics'),

    'SN Product - Service Catalog Continuous': getFromValueMap('SN Product - Service Catalog', valueMaps.Frequency),
    //'SN Product - Service Catalog': identity('SN Product - Service Catalog'),

    'SN Product - ITSM / ITOM': allValuesMatch(['SN Product - ITSM', 'SN Product - ITOM'],isDailyOrWeekly),
    'SN Product - ITSM / Custom App': allValuesMatch(['SN Product - ITSM', 'SN Product - Custom Applications'],isDailyOrWeekly),
    'SN Product - ITSM / ITBM': allValuesMatch(['SN Product - ITSM', 'SN Product - ITBM'],isDailyOrWeekly),
    'SN Product - ITSM / CSM': allValuesMatch(['SN Product - ITSM', 'SN Product - CSM'],isDailyOrWeekly),
    'SN Product - ITSM / HR': allValuesMatch(['SN Product - ITSM', 'SN Product - HR Service Delivery'],isDailyOrWeekly),
    'SN Product - ITSM / SAM': allValuesMatch(['SN Product - ITSM', 'SN Product - Software Asset Management'],isDailyOrWeekly),
    'SN Product - ITSM / Sec Ops': allValuesMatch(['SN Product - ITSM', 'SN Product - Security Operations'],isDailyOrWeekly),
    'SN Product - ITSM / GRC': allValuesMatch(['SN Product - ITSM', 'SN Product - GRC'],isDailyOrWeekly),

    'SN Product - ITOM / Custom App': allValuesMatch(['SN Product - ITOM', 'SN Product - Custom Applications'],isDailyOrWeekly),
    'SN Product - ITOM / ITBM': allValuesMatch(['SN Product - ITOM', 'SN Product - ITBM'],isDailyOrWeekly),
    'SN Product - ITOM / CSM': allValuesMatch(['SN Product - ITOM', 'SN Product - CSM'],isDailyOrWeekly),
    'SN Product - ITOM / HR': allValuesMatch(['SN Product - ITOM', 'SN Product - HR Service Delivery'],isDailyOrWeekly),
    'SN Product - ITOM / SAM': allValuesMatch(['SN Product - ITOM', 'SN Product - Software Asset Management'],isDailyOrWeekly),
    'SN Product - ITOM / Sec Ops': allValuesMatch(['SN Product - ITOM', 'SN Product - Security Operations'],isDailyOrWeekly),
    'SN Product - ITOM / GRC': allValuesMatch(['SN Product - ITOM', 'SN Product - GRC'],isDailyOrWeekly),

    'SN Product - Custom App / ITBM': allValuesMatch(['SN Product - Custom Applications', 'SN Product - ITBM'],isDailyOrWeekly),
    'SN Product - Custom App / CSM': allValuesMatch(['SN Product - Custom Applications', 'SN Product - CSM'],isDailyOrWeekly),
    'SN Product - Custom App / HR': allValuesMatch(['SN Product - Custom Applications', 'SN Product - HR Service Delivery'],isDailyOrWeekly),
    'SN Product - Custom App / SAM': allValuesMatch(['SN Product - Custom Applications', 'SN Product - Software Asset Management'],isDailyOrWeekly),
    'SN Product - Custom App / Sec Ops': allValuesMatch(['SN Product - Custom Applications', 'SN Product - Security Operations'],isDailyOrWeekly),
    'SN Product - Custom App / GRC': allValuesMatch(['SN Product - Custom Applications', 'SN Product - GRC'],isDailyOrWeekly),

    'SN Product - ITBM / CSM': allValuesMatch(['SN Product - ITBM', 'SN Product - CSM'],isDailyOrWeekly),
    'SN Product - ITBM / HR': allValuesMatch(['SN Product - ITBM', 'SN Product - HR Service Delivery'],isDailyOrWeekly),
    'SN Product - ITBM / SAM': allValuesMatch(['SN Product - ITBM', 'SN Product - Software Asset Management'],isDailyOrWeekly),
    'SN Product - ITBM / Sec Ops': allValuesMatch(['SN Product - ITBM', 'SN Product - Security Operations'],isDailyOrWeekly),
    'SN Product - ITBM / GRC': allValuesMatch(['SN Product - ITBM', 'SN Product - GRC'],isDailyOrWeekly),

    'SN Product - CSM / HR': allValuesMatch(['SN Product - CSM', 'SN Product - HR Service Delivery'],isDailyOrWeekly),
    'SN Product - CSM / SAM': allValuesMatch(['SN Product - CSM', 'SN Product - Software Asset Management'],isDailyOrWeekly),
    'SN Product - CSM / Sec Ops': allValuesMatch(['SN Product - CSM', 'SN Product - Security Operations'],isDailyOrWeekly),
    'SN Product - CSM / GRC': allValuesMatch(['SN Product - CSM', 'SN Product - GRC'],isDailyOrWeekly),

    'SN Product - HR / SAM': allValuesMatch(['SN Product - HR Service Delivery', 'SN Product - Software Asset Management'],isDailyOrWeekly),
    'SN Product - HR / Sec Ops': allValuesMatch(['SN Product - HR Service Delivery', 'SN Product - Security Operations'],isDailyOrWeekly),
    'SN Product - HR / GRC': allValuesMatch(['SN Product - HR Service Delivery', 'SN Product - GRC'],isDailyOrWeekly),

    'SN Product - SAM / Sec Ops': allValuesMatch(['SN Product - Software Asset Management', 'SN Product - Security Operations'],isDailyOrWeekly),
    'SN Product - SAM / GRC': allValuesMatch(['SN Product - Software Asset Management', 'SN Product - GRC'],isDailyOrWeekly),

    'SN Product - Sec Ops / GRC': allValuesMatch(['SN Product - Security Operations', 'SN Product - GRC'],isDailyOrWeekly),

    'SN Product - ITSM Only': worksOnOnlyOneProduct('SN Product - ITSM', appProducts),
    'SN Product - Custom Only': worksOnOnlyOneProduct('SN Product - Custom Applications', appProducts),
    'SN Product - ITOM Only': worksOnOnlyOneProduct('SN Product - ITOM', appProducts),
    'SN Product - CSM Only': worksOnOnlyOneProduct('SN Product - CSM', appProducts),
    'SN Product - HR Only': worksOnOnlyOneProduct('SN Product - HR Service Delivery', appProducts),

    'SN Capability - Catalog': worksOnOnlyOneProduct('SN Product - Service Catalog', capabilityProducts),
    'SN Capability - ITSM': worksOnOnlyOneProduct('SN Product - ITSM', capabilityProducts),
    'SN Capability - SP-UX': worksOnOnlyOneProduct('SN Product - Service Portal / UX / Front End', capabilityProducts),
    'SN Capability - Catalog / WF': allValuesMatch(['SN Product - Service Catalog', 'SN Product - Workflow Editor'],isDailyOrWeekly),
    'SN Capability - Catalog / WF / SP-UX': allValuesMatch(['SN Product - Service Catalog', 'SN Product - Workflow Editor', 'SN Product - Service Portal / UX / Front End'],isDailyOrWeekly),
    'SN Capability - WF / Flow Design': allValuesMatch(['SN Product - Workflow Editor','SN Product - Flow Designer'],isDailyOrWeekly),

    /*
    'Product Score - Applications': getComputedValue(appProducts, calculateSum, valueMaps.Frequency),
    'Product Score - Platform Capabilities': getComputedValue(capabilityProducts, calculateSum, valueMaps.Frequency),
    'Product Score - Overall': getComputedValue(allProducts, calculateSum, valueMaps.Frequency),
    */

    'Product Score - Applications Continuous': getComputedValue(appProducts, calculateSum, valueMaps.Frequency),
    'Product Score - Platform Capabilities Continuous': getComputedValue(capabilityProducts, calculateSum, valueMaps.Frequency),
    'Product Score - Overall Continuous': getComputedValue(allProducts, calculateSum, valueMaps.Frequency),

    //'Product Group - High Frequency Apps': createGroupFromConcatPropsIf(appProducts, isHighFrequency, valueMaps.Frequency),
    //'Product Group - High Frequency Capabilities': createGroupFromConcatPropsIf(capabilityProducts, isHighFrequency, valueMaps.Frequency),

    /*
    'Statements - I contribute directly to revenue': identity('Statements - I contribute directly to revenue'),
    'Statements - I contribute directly to reducing costs': identity('Statements - I contribute directly to reducing costs'),
    'Statements - I contribute directly to maintaining and improving quality': identity('Statements - I contribute directly to maintaining and improving quality'),
    'Statements - My org would be negatively impacted if I left': identity('Statements - My org would be negatively impacted if I left'),
    'Statements - My org would find it challenging to replace me': identity('Statements - My org would find it challenging to replace me'),
    */

    'Statements - I contribute directly to revenue Continuous': getFromValueMap('Statements - I contribute directly to revenue', valueMaps.AgreeDisagree),
    'Statements - I contribute directly to reducing costs Continuous': getFromValueMap('Statements - I contribute directly to reducing costs', valueMaps.AgreeDisagree),
    'Statements - I contribute directly to maintaining and improving quality Continuous': getFromValueMap('Statements - I contribute directly to maintaining and improving quality', valueMaps.AgreeDisagree),
    'Statements - My org would be negatively impacted if I left Continuous': getFromValueMap('Statements - My org would be negatively impacted if I left', valueMaps.AgreeDisagree),
    'Statements - My org would find it challenging to replace me Continuous': getFromValueMap('Statements - My org would find it challenging to replace me', valueMaps.AgreeDisagree),

    //'Statement Score': getComputedValue(statementProperties, calculateSum, valueMaps.AgreeDisagree),
    'Statement Score Continuous': getComputedValue(statementProperties, calculateSum, valueMaps.AgreeDisagree),

    /*
    'Satisfaction with - Current Employer': identity('Satisfaction with - Current Employer'),
    'Satisfaction with - Current Role': identity('Satisfaction with - Current Role'),
    'Satisfaction with - Current Pay': identity('Satisfaction with - Current Pay'),
    'Satisfaction with - Future Career Prospects': identity('Satisfaction with - Future Career Prospects'),
    */

    /*
    'Satisfaction with - Current Employer Continuous': getFromValueMap('Satisfaction with - Current Employer', valueMaps.Satisfaction),
    'Satisfaction with - Current Role Continuous': getFromValueMap('Satisfaction with - Current Role', valueMaps.Satisfaction),
    'Satisfaction with - Current Pay Continuous': getFromValueMap('Satisfaction with - Current Pay', valueMaps.Satisfaction),
    'Satisfaction with - Future Career Prospects Continuous': getFromValueMap('Satisfaction with - Future Career Prospects', valueMaps.Satisfaction),
    */

    //'Satisfaction Score': getComputedValue(satisfactionProperties, calculateSum, valueMaps.Satisfaction),
    'Satisfaction Score Continuous': getComputedValue(satisfactionProperties, calculateSum, valueMaps.Satisfaction),

    //'Salary / Hourly': identity('Salary / Hourly'),
    'Salary / Hourly is Salary': getComputedProperty('Salary / Hourly', 'Salary'), // Groups prefer not to disclose with Hourly
    'Salary / Hourly is Hourly': getComputedProperty('Salary / Hourly', 'Hourly'), // Groups prefer not to disclose with Salary

    //'Benefits - Medical': identity('Benefits - Medical'),
    'Benefits - Medical is Yes': getComputedProperty('Benefits - Medical', 'Yes'),

    //'Benefits - Dental': identity('Benefits - Dental'),
    'Benefits - Dental is Yes': getComputedProperty('Benefits - Dental', 'Yes'),

    //'Benefits - Vision': identity('Benefits - Vision'),
    'Benefits - Vision is Yes': getComputedProperty('Benefits - Vision', 'Yes'),

    //'Benefits - Short Term Disability': identity('Benefits - Short Term Disability'),
    'Benefits - Short Term Disability is Yes': getComputedProperty('Benefits - Short Term Disability', 'Yes'),

    //'Benefits - Long Term Disability': identity('Benefits - Long Term Disability'),
    'Benefits - Long Term Disability is Yes': getComputedProperty('Benefits - Long Term Disability', 'Yes'),

    //'Benefits - Life Insurance': identity('Benefits - Life Insurance'),
    'Benefits - Life Insurance is Yes': getComputedProperty('Benefits - Life Insurance', 'Yes'),

    //'Benefits - Gym': identity('Benefits - Gym'),
    'Benefits - Gym is Yes': getComputedProperty('Benefits - Gym', 'Yes'),

    //'Benefits - Childcare': identity('Benefits - Childcare'),
    'Benefits - Childcare is Yes': getComputedProperty('Benefits - Childcare', 'Yes'),

    //'Benefits - Free Food / Drink': identity('Benefits - Free Food / Drink'),
    'Benefits - Free Food / Drink is Yes': getComputedProperty('Benefits - Free Food / Drink', 'Yes'),

    //'Benefits - Massage': identity('Benefits - Massage'),
    'Benefits - Massage is Yes': getComputedProperty('Benefits - Massage', 'Yes'),

    //'Benefits - Entertainment': identity('Benefits - Entertainment'),
    'Benefits - Entertainment is Yes': getComputedProperty('Benefits - Entertainment', 'Yes'),

    //'Benefits - Commute Reimbursement': identity('Benefits - Commute Reimbursement'),
    'Benefits - Commute Reimbursement is Yes': getComputedProperty('Benefits - Commute Reimbursement', 'Yes'),

    //'Benefits - Free Parking': identity('Benefits - Free Parking'),
    'Benefits - Free Parking is Yes': getComputedProperty('Benefits - Free Parking', 'Yes'),

    //'Benefits - Remote Work': identity('Benefits - Remote Work'),
    'Benefits - Remote Work is Yes': getComputedProperty('Benefits - Remote Work', 'Yes'),

    //'Benefits - Work From Home Days': identity('Benefits - Work From Home Days'),
    'Benefits - Work From Home Days is Yes': getComputedProperty('Benefits - Work From Home Days', 'Yes'),

    //'Benefits - On Site Shopping': identity('Benefits - On Site Shopping'),
    'Benefits - On Site Shopping is Yes': getComputedProperty('Benefits - On Site Shopping', 'Yes'),

    //'Benefits -Flextime': identity('Benefits -Flextime'),
    'Benefits -Flextime is Yes': getComputedProperty('Benefits -Flextime', 'Yes'),

    //'Benefits - Tuition Reimbursement': identity('Benefits - Tuition Reimbursement'),
    'Benefits - Tuition Reimbursement is Yes': getComputedProperty('Benefits - Tuition Reimbursement', 'Yes'),

    //'Benefits - Cert Reimbursement': identity('Benefits - Cert Reimbursement'),
    'Benefits - Cert Reimbursement is Yes': getComputedProperty('Benefits - Cert Reimbursement', 'Yes'),

    //'Benefits - Professional Development Courses Reimbursement': identity('Benefits - Professional Development Courses Reimbursement'),
    'Benefits - Professional Development Courses Reimbursement is Yes': getComputedProperty('Benefits - Professional Development Courses Reimbursement', 'Yes'),

    //'Benefits -  On Site Professional Development': identity('Benefits -  On Site Professional Development'),
    'Benefits -  On Site Professional Development is Yes': getComputedProperty('Benefits -  On Site Professional Development', 'Yes'),

    //'Benefits - Conference Participation': identity('Benefits - Conference Participation'),
    'Benefits - Conference Participation is Yes': getComputedProperty('Benefits - Conference Participation', 'Yes'),

    //'Benefits - Cross Training Opportunity': identity('Benefits - Cross Training Opportunity'),
    'Benefits - Cross Training Opportunity is Yes': getComputedProperty('Benefits - Cross Training Opportunity', 'Yes'),

    //'Benefits - Hackathon Opportunity': identity('Benefits - Hackathon Opportunity'),
    'Benefits - Hackathon Opportunity is Yes': getComputedProperty('Benefits - Hackathon Opportunity', 'Yes'),

    //'Benefits - Passion Project Time': identity('Benefits - Passion Project Time'),
    'Benefits - Passion Project Time is Yes': getComputedProperty('Benefits - Passion Project Time', 'Yes'),

    //'Benefits - Unlimited PTO': identity('Benefits - Unlimited PTO'),
    'Benefits - Unlimited PTO is Yes': getComputedProperty('Benefits - Unlimited PTO', 'Yes'),

    //'Benefits - Paid Maternity': identity('Benefits - Paid Maternity'),
    'Benefits - Paid Maternity is Yes': getComputedProperty('Benefits - Paid Maternity', 'Yes'),

    //'Benefits - Paid Paternity': identity('Benefits - Paid Paternity'),
    'Benefits - Paid Paternity is Yes': getComputedProperty('Benefits - Paid Paternity', 'Yes'),

    //'Benefits - Adoption / Foster Leave': identity('Benefits - Adoption / Foster Leave'),
    'Benefits - Adoption / Foster Leave is Yes': getComputedProperty('Benefits - Adoption / Foster Leave', 'Yes'),

    //'Benefits - Bereavement Leave': identity('Benefits - Bereavement Leave'),
    'Benefits - Bereavement Leave is Yes': getComputedProperty('Benefits - Bereavement Leave', 'Yes'),

    //'Benefits - Compressed Workweek': identity('Benefits - Compressed Workweek'),
    'Benefits - Compressed Workweek is Yes': getComputedProperty('Benefits - Compressed Workweek', 'Yes'),

    'Benefits - Total Count Continuous': identity('Benefits - Total Count'),
    //'Benefits - Total Count': identity('Benefits - Total Count'),

    'Compensation - Percent Fixed Continuous': identity('Compensation - Percent Fixed'),
    //'Compensation - Percent Fixed': identity('Compensation - Percent Fixed'),

    'Compensation - Fixed Annual PPP': getFixedAnnual
};