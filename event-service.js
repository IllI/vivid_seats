/*
 Provides access to a database of events.  Currently supports:
 all(onSuccess, onError):  calls onSuccess with the event list if successful, onError otherwise
 update(event, onSuccess, onError):  update a specific event.  Calls onSuccess if successful
 add(event, onSuccess, onError):  adds an event to the system,  Calls onSuccess if successful
 remove(event, onSuccess, onError):  removes the given event from the system.  Calls onSuccess if successful
 */

var VividSeats = (function(){
    //private collection and accessors
    var _events =  [{
        "id" : 123,
        "name" : "Sesame Street Live - Elmo Makes Music",
        "date" : "2014-01-15T10:30:00",
        "venue" : {
            "id" : 111,
            "name" : "Broome County Forum",
            "city" : "Binghamton",
            "state" : "NY"
        }
    }, {
        "id" : 124,
        "name" : "2014 Australian Open",
        "date" : "2014-01-15T11:00:00",
        "venue" : {
            "name" : "Rod Laver Arena",
            "city" : "Melbourne"
        }
    }, {
        "id" : 125,
        "name" : "Mac King Comedy Magic Show",
        "date" : "2014-01-15T13:00:00",
        "venue" : {
            "id" : 300,
            "name" : "Harrah's Las Vegas Casino",
            "city" : "Las Vegas",
            "state" : "NV"
        }
    }, {
        "id" : 126,
        "name" : "42nd Street",
        "date" : "2014-01-15T13:30:00",
        "venue" : {
            "id" : 1200,
            "name" : "Paramount Theatre - IL",
            "city" : "Aurora",
            "state" : "IL"
        }
    }, {
        "id" : 127,
        "name" : "Million Dollar Quartet",
        "date" : "2014-01-15T14:00:00",
        "venue" : {
            "id" : 712,
            "name" : "Apollo Theater-IL",

            "city" : "Chicago",
            "state" : "IL"

        }
    }, {
        "id" : 128,
        "name" : "Twelfth Night",
        "date" : "2014-01-15T14:00:00",
        "venue" : {
            "id" : 1665,
            "name" : "Belasco Theatre",
            "city" : "New York",
            "state" : "NY"
        }
    }, {
        "id" : 129,
        "name" : "The Glass Menagerie",
        "date" : "2014-01-15T14:00:00",
        "venue" : {
            "id" : 2411,
            "name" : "Booth Theatre",
            "city" : "New York",
            "state" : "NY"
        }
    }, {
        "id" : 130,
        "name" : "Cinderella - The Musical",
        "date" : "2014-01-16T14:00:00",
        "venue" : {
            "id" : 2332,
            "name" : "Broadway Theatre-New York",
            "city" : "New York",
            "state" : "NY"

        }

    }, {
        "id" : 131,
        "name" : "After Midnight",
        "date" : "2014-01-16T14:00:00",
        "venue" : {
            "id" : 2372,
            "name" : "Brooks Atkinson Theatre",
            "city" : "New York",
            "state" : "NY"
        }
    }, {
        "id" : 132,
        "name" : "Die Fledermaus",
        "date" : "2014-01-16T14:00:00",
        "venue" : {
            "id" : 3244,
            "name" : "Civic Opera House",
            "city" : "Chicago",
            "state" : "IL"
        }
    } ];
    var _addEvent = function(event) { _events.push(event); };
    var _allEvents = function() { return _deepCopy(_events)};
    var _updateEvent = function(event) {
        _events.forEach(function(item){
            if(item.id === event.id)
            {
                Object.getOwnPropertyNames(event).forEach(function(name){
                    var desc = Object.getOwnPropertyDescriptor(event,name);
                    Object.defineProperty(item, name, desc);
                });
            }
        });
    };
    var _removeEvent = function(event) {
        _events = _events.filter(function(item){return item.id !== event.id});
    };
    var _deepCopy = function (obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var out = [], i = 0, len = obj.length;
            for ( ; i < len; i++ ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        if (typeof obj === 'object') {
            var out = {}, i;
            for ( i in obj ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        return obj;
    };
    var _simulateNetwork = function(onSuccess, onError) {
        console.log()
        var callback = Math.random() <= 0.9 ? onSuccess : onError;
        setTimeout(function(){callback()}, Math.random() * 100);
    };


    return {
        eventService: {
            all: function(onSuccess, onError) {
                _simulateNetwork(function(){onSuccess(_allEvents());}, function(){onError("Oops, a server error occurred")});
            },

            update: function(event, onSuccess, onError) {
                _simulateNetwork(function(){onSuccess(_updateEvent(event));}, function(){onError("Oops, a server error occurred")});
            },

            add: function(event, onSuccess, onError) {
                _simulateNetwork(function(){onSuccess(_addEvent(event));}, function(){onError("Oops, a server error occurred")});
            },

            remove: function(event, onSuccess, onError) {
                _simulateNetwork(function(){onSuccess(_removeEvent(event));}, function(){onError("Oops, a server error occurred")});
            }
        }
    }
})();
console.log(VividSeats);