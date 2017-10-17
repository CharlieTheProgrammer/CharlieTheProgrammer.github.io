"use strict"

// Clock
var clock = {
    hour: 0,
    minute: 0,
    second: 0,
    ampm: null,
    selectedTimezone: null,
    systemTimezone: null,
    availableTimezones: {
        HAST: -10,
        PST: -7,
        PDT: -7,
        MST: -6,
        CST: -5,
        EST: -4,
    }
//    savedTimezones: {
//        saveTimezone1: [time, timezoneAbbr]
//    }
}

function runClock() {
    calculateClockTime(clock);
    formatClock(clock);
    setClock(clock);
// Create function that checks if seconds is zero
// if true and there are savedTimeZones (we can set a bool),
    // for each time zone object
    // update the minute in the object
    // set the HTML content to the updated object

}

function calculateClockTime(clock) {
    /* This algorithm calculates the clock time by setting it to the default system clock first
       and then checking if a new timzone has been selected. If it has, it will update the time
       to match the selected timezone.

       It uses UTC as the base hour and then calculates timezone offsets to get the desired time.

       Known Issues or Comments:
         1. It doesn't handle Daylight Savings time. Since I'm relying on straight UTC times, this
            clock ignores locations that follow daylight savings.
         2. This algorithm recreates the date every second in lieu of setting the time once and then
            using counters. This seems inefficient, but I'm not sure how to optimize it at this point.
    */

    var date = new Date();
    clock.hour = date.getHours();
    clock.minute = date.getMinutes();
    clock.second = date.getSeconds();
    clock.ampm = null;
    setAMPM(clock);
    convertTo12HourTime(clock);

    // Checks if new timezone was selected by user.
    if (clock.selectedTimezone != clock.systemTimezone) {
        // Subtract the offset from current UTC hour (UTC hour - offset)
        clock.hour = date.getUTCHours() - Math.abs(clock.selectedTimezone);

        if (clock.hour > 0) {
            setAMPM(clock);
            convertTo12HourTime(clock);
        } else {
            clock.hour = clock.hour + 24;
            setAMPM(clock);
            convertTo12HourTime(clock);
        }
    }
}

function setAMPM(clock) {
    if (1 <= clock.hour  && clock.hour <= 11 | clock.hour == 24 ) {
        clock.ampm = "AM";
    } else if (12 <= clock.hour <= 23 ) {
        clock.ampm = "PM";
    }
}

// Format minutes and seconds to always have 2 digits
function formatClock(clock) {
    clock.minute = ("0" + clock.minute).slice(-2);
    clock.second = ("0" + clock.second).slice(-2);
}

function convertTo12HourTime(clock) {
    clock.hour = (clock.hour + 11) % 12 + 1;
}

function setClock(clock) {
    var time = clock.hour.toString() + ":" +  clock.minute.toString() + ":" + clock.second.toString() + " " + clock.ampm;
    document.getElementById('clock').innerHTML = time;
}

// If user changes timezone, adjust the timezone
function setTimeZone(newTimezone) {
    clock.selectedTimezone = clock.availableTimezones[newTimezone];
}


// EVENT LISTENERS
// Call timezone setter when timezone button is clicked
$('.timezones').on('click', function(){
    var dataTimezone = $(this).attr('data-timezone')  
    setTimeZone(dataTimezone)
})


// Upon startup, set clock to system time
var initialDate = new Date();
clock.selectedTimezone = initialDate.getUTCHours();
clock.systemTimezone = initialDate.getUTCHours();

// Start the clock
setInterval(runClock, 1000);
