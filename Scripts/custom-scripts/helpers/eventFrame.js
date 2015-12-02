// just a simple global event manager used to trigger events/subscribe to events.

(function () {
    window.eventCallbacks = {};

    window.spliceArgs = function (args) {
        var newArgs = [];
        for (var i = 1; i < args.length; i++) {
            newArgs.push(args[i]);
        }
        return newArgs;
    }

    window.on = function(eventName, callback) {
        if (!window.eventCallbacks.hasOwnProperty(eventName)) {
            window.eventCallbacks[eventName] = [callback];
        } else {
            window.eventCallbacks[eventName].push(callback);
        }
    }

    window.trigger = function(eventName) {
        if (window.eventCallbacks.hasOwnProperty(eventName)) {
            var callbacks = window.eventCallbacks[eventName];
            for (var i = 0; i < callbacks.length; i++) {
                try {
                    callbacks[i].apply(this, window.spliceArgs(arguments));
                } catch (e) {

                } 
            }
            return true;
        } else {
            return false;
        }
    }
})();