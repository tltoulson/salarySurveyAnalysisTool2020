export { ActionTypes, appLoaded, filterAdded, filterRemoved, histogramConfigChanged, histogramPropertySelected };

var ActionTypes = {
    'APP_LOADED': 'APP_LOADED',
    'FILTER_ADDED': 'FILTER_ADDED',
    'FILTER_REMOVED': 'FILTER_REMOVED',
    'HISTOGRAM_CONFIG_CHANGED': 'HISTOGRAM_CONFIG_CHANGED',
    'HISTOGRAM_PROPERTY_SELECTED': 'HISTOGRAM_PROPERTY_SELECTED'
};

function appLoaded() {
    return {
        'type': ActionTypes.APP_LOADED
    };
}

function filterAdded(property, value) {
    return {
        'type': ActionTypes.FILTER_ADDED,
        'property': property,
        'value': value
    };
}

function filterRemoved(property) {
    return {
        'type': ActionTypes.FILTER_REMOVED,
        'property': property
    };
}

function histogramConfigChanged(config) {
    return {
        'type': ActionTypes.HISTOGRAM_CONFIG_CHANGED,
        'config': { ...config }
    };
}

function histogramPropertySelected(property) {
    return {
        'type': ActionTypes.HISTOGRAM_PROPERTY_SELECTED,
        'property': property
    };
}