"use strict";

/* This application calculates the time by setting it to the default system clock first
       and then checking if a new timezone has been selected. If it has, it will update the time
       to match the selected timezone.

       It uses UTC as the base hour and then calculates timezone offsets to get the desired time.

       Known Issues or Comments:
         1. It doesn't handle Daylight Savings time. Since I'm relying on straight UTC times, this
            clock ignores locations that follow daylight savings.
         2. This algorithm recreates the date every second in lieu of setting the time once and then
            using counters. This seems inefficient, but I'm not sure how to optimize it at this point.
*/

// This would be an instance of the singleton design pattern. There's only one object
// and a lot of the code refers to this global object. In it's current state, there's a lot
// of anti-patterns. Namely that several functions should be in the object rather than outside.
var clocks = {
    "hour": null,
    "minute": 0,
    "second": 0,
    "selectedTimezone": null,
    "systemTimezoneOffset": null,
    "availableTimezones": {
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
    savedTimezones: []
};


function initClocksContainer() {
    var date = new Date();

    clocks.selectedTimezone = date.getUTCHours();
    clocks.systemTimezone = date.getUTCHours();

    // Sets the time's minute and second, which is shared among all times
    clocks.minute = formatToTwoDigits(date.getMinutes());
    clocks.second = formatToTwoDigits(date.getSeconds());

    // Iterate through the hardcoded available timezones,
    // create new nested clock objects, set hour, and set ampm
    for (var key in clocks.availableTimezones) {
        clocks[key] = {
            hour: 0,
            ampm: null,
            selectedTimezone: key
        };

        // Calculate hour and ampm for newly added timezone
        clocks[key].hour = date.getUTCHours() - Math.abs(clocks.availableTimezones[key]);

        if (clocks[key].hour > 0) {
            clocks[key].ampm = setAMPM(clocks[key].hour);
            clocks[key].hour = convertTo12HourTime(clocks[key].hour);
        } else {
            clocks[key].hour = clocks[key].hour + 24;
            clocks[key].ampm = setAMPM(clocks[key].hour);
            clocks[key].hour = convertTo12HourTime(clocks[key].hour);
        }
    }

    // Set the main clock's time to system time
    clocks.systemTimezoneOffset = date.getTimezoneOffset() / 60
    var currentSysTimezone =  findCurrentTimezone(clocks.availableTimezones, clocks.systemTimezoneOffset)

    // Check that system timezone is supported. Why?
    try {
        if (currentSysTimezone === undefined) {
            throw new Error("Timezone Not Supported")
        } else {
            // Once we have the timezone, we can set the hour
            for (var timezone in clocks.availableTimezones) {
                if (currentSysTimezone === clocks.availableTimezones[timezone]) {
                    clocks.hour = calculateHour(clocks.availableTimezones[timezone]);
                    clocks.selectedTimezone = timezone;
                    break;
                }
            }
        }
    }
    catch (error) {
        console.log(error + ":" + "This is where we could call a function to trigger warning to user")
    }
}

function runClock() {
    var date = new Date();

    clocks.minute = formatToTwoDigits(date.getMinutes());
    clocks.second = formatToTwoDigits(date.getSeconds());

    var time = clocks.hour.toString() + ":" +  clocks.minute.toString() + ":" + clocks.second.toString();
    time += " " + clocks[clocks.selectedTimezone].ampm;
    document.getElementById("clock").innerHTML = time;      // This should be moved to the file that handles UI.

    // Updates hours in the buttons
    if (clocks.minute == "00" && clocks.second == "00") {

        // Update the hour
        clocks.hour = clocks.availableTimezones[clocks.selectedTimezone];
        clocks.hour = calculateHour(clocks.hour);

        for (var key in clocks.availableTimezones) {
            // Update hours for timezones
            clocks[key].hour = date.getUTCHours() - Math.abs(clocks.availableTimezones[key]);
            // TODO This code block needs to be deduped, it appears elsewhere and is very similar to calculateHour.
            if (clocks[key].hour > 0) {
                clocks[key].ampm = setAMPM(clocks[key].hour);
                clocks[key].hour = convertTo12HourTime(clocks[key].hour);
            } else {
                clocks[key].hour = clocks[key].hour + 24;
                clocks[key].ampm = setAMPM(clocks[key].hour);
                clocks[key].hour = convertTo12HourTime(clocks[key].hour);
            }
        }
        updateHourInButtons();
    } else if (clocks.second == "00") {
        updateMinuteInButtons()
    }
}

function calculateHour(offset){
    /*
        offset: is a number corresponding a UTC offset for a given timezone
    */

    var hour = 0
    var date = new Date()

    hour = date.getUTCHours() - Math.abs(offset)

    if (hour > 0) {
        hour = convertTo12HourTime(hour)
        return hour
    } else {
        hour +=  24
        hour = convertTo12HourTime(hour)
        return hour
    }
}

function findCurrentTimezone(timezoneAbbreviations, matchValue) {
/* Receives an offset and then looks up the timezone abbreviation in the
    abbreviations list.
 */
    for (var key in timezoneAbbreviations) {
        if (timezoneAbbreviations[key] * -1 === matchValue) {
            return timezoneAbbreviations[key]
        }
    }
}

function setAMPM(hour) {
    /*Lesson Learned: Don't send entire objects to functions. Only send the exact parameter it needs
    to change. Also, try to return back a value rather than modiying a global object, which is bad
    behaviour. */

    if (1 <= hour  && hour <= 11 | hour == 24 ) {
        return "AM";
    } else if (12 <= clock.hour <= 23 ) {
        return "PM";
    }
}

// Format minutes and seconds to always have 2 digits
function formatToTwoDigits(number) {
    return ("0" + number).slice(-2);
}

function convertTo12HourTime(hour) {
    return (hour + 11) % 12 + 1;
}


// EVENT LISTENERS
// Call timezone setter when timezone button is clicked
$(".timezones").on("click", function(){
    var dataTimezone = $(this).attr("data-timezone")
    clock.selectedTimezone = clock.availableTimezones[dataTimezone];
})

// Upon startup, initialize the clocks container.
initClocksContainer()

// Start the clocks
setInterval(runClock, 1000);
