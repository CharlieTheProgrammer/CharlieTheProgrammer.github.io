"use strict"

// This is hardcoded in the file now, but could be retrieved from local file or db.
var config = {
    "availableTimezones" : {
        "HAST": -10,
        "PST": -8,
        "MST": -6,
        "CST": -5,
        "EST": -4
    },
    timezoneFullname: {
        "HAST": "Hawaiian",
        "PST": "Pacific",
        "MST": "Mountain",
        "CST": "Central",
        "EST": "Eastern"
    },
    timeFormat: {
        "hour": true,
        "minute": true,
        "second": false,
        "meridian": true
    },
    MAX_SAVED_CLOCKS_LIMIT : 3
};


// Only clock objects should be added to this object.
var clockCollection = {};
// This extends the clock with a user list that all clocks can access.
Clock.prototype.userSavedClocks = [];
//Clock.prototype.userSelectedClock = "";
// Not sure how to get rid of this global. I can't add it to clock collection
// because that throws off other functions and this has to be easily accessible.
var userSelectedClock = "";


function Clock() {
    // What attributes/properties does a clock have?
    var hour = 0;
    var minute = 0;
    var second = 0;
    var ampm = "";
    var timezoneAbbrev = "";
    var UtcOffset = undefined;

    // This is here because I want calculateAMPM to be private.
    var calculateAMPM = function(hour){
        if (1 <= hour  && hour <= 11 || hour == 24 ) {
            return "AM";
        } else if (12 <= hour <= 23 ) {
            return "PM";
        }
    }

    // Public Vars
    //this.isUserSavedClock = false;
    // This is needed to run the app, but it's not 'core' to what a clock is.
    // This doesn't seem to belong here. An alt is to tack it on outside the object
    // in initialization step, but that seems a bit odd as well.
    // ** Solved design issue by adding array to clockCollection as prototype.

    // What can a clock do?
    this.initClock = function(offset){
        // Set offset
        this.setTimezoneOffset(offset);

        // Set time
        this.setTime();
    }
    /**
     * Calculates the object's time based on its UTC offset.
     */
    this.setTime = function(){
        if(!UtcOffset){
            console.error("Set a timezone before setting the time.")
            return;
        }

        var date = new Date();

        try {
            minute = ("0" + date.getMinutes()).slice(-2);
            second = ("0" + date.getSeconds()).slice(-2);
            hour = date.getUTCHours() - Math.abs(UtcOffset);

            if (hour > 0) {
                ampm = calculateAMPM(hour);
                hour = (hour + 11) % 12 + 1;
            } else {
                hour += 24;
                ampm = calculateAMPM(hour);
                hour = (hour + 11) % 12 + 1;
            }

        } catch (error) {
            console.error("An error occurred while setting the time." + error);
        }
    }

    /**
     * Returns the object's time. Parameter is optional. If it's not included,
     * all parameters will be treated as true.
     * @param {Object} options -
     * @param {boolean} options.hour - Set if hour should be return in time.
     * @param {boolean} options.minute - Set if minute should be return in time.
     * @param {boolean} options.second - Set if second should be return in time.
     * @param {boolean} options.meridian - Set if AMPM should be return in time.
     */
    this.getTime = function(options) {
        if (hour == 0) {
            console.error("You must set the time before you can get a time.")
            return;
        }
        // Default time format
        if (!options) {
            return hour + ":" + minute + ":" + second + " " + ampm;
        };
        // Refactored with parameters so that it returns a formatted time
        var formattedTime = "";
        var h = options.hour || false;
        var min = options.minute || false;
        var sec = options.second || false;
        var meridian = options.meridian || false;

        // Requesting the hour and sec, but not minute is stupid, let's stop that.
        if (h && sec && !min){
            throw new Error("Requesting hour and second only is invalid.")
            return false;
        }

        if (h){
            formattedTime += hour
        }

        // Only add the : if an hour and minute are requested
        if (h && min){
            formattedTime += ":" + minute;
        } else if (min){
            formattedTime += minute;
        }
        // Only add the : if minute and second are requested
        if (min && sec){
            formattedTime += ":" + second;
        } else if (sec){
            formattedTime += second;
        }
        // Return meridian with space in front only if there rest of
        // attributes are not requested
        if (meridian && (h || min || sec)) {
            formattedTime += " " + ampm;
        } else if (meridian) {
            formattedTime += ampm;
        }

        return formattedTime;
    }

    this.setTimezoneOffset = function(offset){
        if (typeof offset === "number") {
            UtcOffset = offset;
        } else {
            console.error("Offset must be a number between -12 and 24")
        }
    }

    this.setTimezoneAbbrev = function(TimezoneAbbrev){
        // We will want to check the config here for valid values
        var keys = Object.keys(config.availableTimezones)

        if (!keys) {
            console.error("Timezones in config failed to load.");
            throw new Error("Timezones in config failed to load.");
        }

        TimezoneAbbrev = TimezoneAbbrev.toUpperCase();

        for (var item in keys) {
            if (keys[item] === TimezoneAbbrev) {
                timezoneAbbrev = TimezoneAbbrev;
                return;
            }
        }

        console.error("Invalid timezone abbreviation.");
        throw new Error("Invalid timezone abbreviation.");
    }

    this.getTimezoneAbbrev = function() {
        return timezoneAbbrev;
    }

/*
    // It doesn't make sense to include this here. This 'helper' shouldn't be
    // part of a clock, it's not something a clock does or is. However, the
    // getTime function can use this object so.....
    // this.createTimeFormat = function() {
    //     var timeFormat = {};

    /*     return {
    //         addHour: function(){
    //             timeFormat.hour = true;
    //         },
    //         addMinute: function(){
    //             timeFormat.minute = true;
    //         },
    //         addSecond: function(){
    //             timeFormat.second = true;
    //         },
    //         addMeridian: function(){
    //             timeFormat.meridian = true;
    //         },

    //         removeHour: function(){
    //             timeFormat.hour = false;
    //         },
    //         removeMinute: function(){
    //             timeFormat.minute = false;
    //         },
    //         removeSecond: function(){
    //             timeFormat.second = false;
    //         },
    //         removeMeridian: function(){
    //             timeFormat.meridian = false;
    //         },
    //         getTimeFormat: function(){
    //             return timeFormat;
    //         }
    //     }
    //  }
*/
}

/*
    I overthought this, the easiest way to do this was via a config.
    However, it was nice to practice creating an object like this, which would
    be justified in scenario were time formats are constantly changing or need
    to be highly dynamic.
*/
function createTimeFormat() {
    var timeFormat = {};
    // I'm still not sure when I would use 'this' vs just returning a set of methods.
    return {
        addHour: function(){
            timeFormat.hour = true;
        },
        addMinute: function(){
            timeFormat.minute = true;
        },
        addSecond: function(){
            timeFormat.second = true;
        },
        addMeridian: function(){
            timeFormat.meridian = true;
        },

        removeHour: function(){
            timeFormat.hour = false;
        },
        removeMinute: function(){
            timeFormat.minute = false;
        },
        removeSecond: function(){
            timeFormat.second = false;
        },
        removeMeridian: function(){
            timeFormat.meridian = false;
        },
        getTimeFormat: function(){
            return timeFormat;
        }
    }
}


//Initialize Clocks
var keys = Object.keys(config.availableTimezones);

// Create clock object with a dynamic name based on config
for (const i in keys) {
    clockCollection[keys[i]] = new Clock();
    clockCollection[keys[i]].initClock(config.availableTimezones[keys[i]])
    clockCollection[keys[i]].setTimezoneAbbrev(keys[i]);
}

// Setup main clock
function setupMainClock(){
    var currentDate = new Date();
    var systemUTCOffset = (currentDate.getTimezoneOffset() / 60) * -1;

    for (var item in config.availableTimezones){
        if (config.availableTimezones[item] == systemUTCOffset){
            userSelectedClock = item;
            return;
        }
    }
    console.warn("Timezone not supported.");
}


function loop(){
    // This failed because the length of array is zero. This is one of the ugly things about JS
    // To fix it I may be able to add a prototype to the array object to increase the length.
    // clockCollection.forEach(function(clock) {
    //     clock.setTime();
    //     clock.getTime();
    // }, this);

    // Douglas Crockford recommends using an object if the array indexes aren't
    // going to be simple sequential integers, so I'm using an object.
    for (var clock in clockCollection) {
        if (clockCollection.hasOwnProperty(clock)) {
            clockCollection[clock].setTime();
        }
    }

    // Sets the main clock
    if (!(userSelectedClock === "")){
        mainClock.innerHTML = clockCollection[userSelectedClock].getTime();
    }

    // Updates time in buttons at same rate as main clock.
    updateTimeinButtons();
}


// Populate HTML file with clocks
addClockButtonsToApp();

setupMainClock();
// GUI handling JS file is loaded first.
// This helps prevent launching that code too early.
launchEventListeners();

// Sets the app in motion.
setInterval(loop, 1000);