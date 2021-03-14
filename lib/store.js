export { createStore };


function createStore(reducer) {
    var listeners = [];
    var nextListenerId = 0;
    var state = undefined;
    var inProgress = false;

    function _dispatchAsync(action) {
        $timeout(function() {
            dispatch(action);
        }, 0);
    }

    function dispatch(action) {
        try {
            if (inProgress) {
                throw 'Cannot dispatch while another action has already been dispatched';
            }

            if (!reducer) {
                throw 'Store reducer has not been set';
            }

            inProgress = true;

            state = reducer(state, action, _dispatchAsync);

            listeners.forEach(function(listener) {
                listener.handler.call(null, state, action);
            });
        }
        catch(err) {
            // TODO: Improve error handling
            console.error('Error during Store dispatch:');
            console.error(err);
            console.error(action);
            inProgress = false;
        }
        finally {
            console.log({
                'type': action.type,
                'action': action,
                'newState': state
            });

            inProgress = false;
        }
    }

    function subscribe(fn) {
        var id = nextListenerId;
        nextListenerId++;

        listeners.push({
            'id': id,
            'handler': fn
        });

        return function unsubscribe() {
            listeners = listeners.filter(function (listener) {
                return listener.id == id;
            });
        };
    }

    function getState() {
        return state;
    }


    return {
        'dispatch': dispatch,
        'subscribe': subscribe,
        'getState': getState
    };
}