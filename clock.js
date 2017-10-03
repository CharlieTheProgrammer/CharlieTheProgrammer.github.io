"use strict";
window.onload = setInterval(startClock, 1000);;

function startClock(){
    //
    var updatedCustomTime = getTimeForClock(customTime);
    // if click event, update customTime - changeTimeZone
    newsetTimeForClock(updatedCustomTime);

//    setInterval(setTimeForClock, 1000);
}

function convertTo12HourTime(hour){
    var updatedHour = (hour + 11) % 12 + 1;
    return updatedHour;
}

function setTimeForClock() {
    var date = new Date();
    var hour = convertTo12HourTime(date);
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var ampm = null;

    // Formatting minutes and seconds to always have 2 digits
    minute = ("0" + minute).slice(-2);
    second = ("0" + second).slice(-2)

    if (date.getHours() <= 12) {
        ampm = "AM";
    } else {
        ampm = "PM";
    }

    var str = hour.toString() + ":" +  minute.toString() + ":" + second.toString() + " " + ampm;
    document.getElementById('clock').innerHTML = str;
}

// Gets current system time, converts it to 12 hours, and displays it on webpage.
function getTimeForClock(customTime) {
    var date = new Date();
    customTime.hour = convertTo12HourTime(date.getHours());
    customTime.minute = date.getMinutes();
    customTime.second = date.getSeconds();

    // Formatting minutes and seconds to always have 2 digits
    customTime.minute = ("0" + customTime.minute).slice(-2);
    customTime.second = ("0" + customTime.second).slice(-2)

    if (date.getHours() <= 12) {
        customTime.ampm = "AM";
    } else {
        customTime.ampm = "PM";
    }

    return customTime;
}

function newsetTimeForClock(customTime) {
    var str = customTime.hour.toString()
     + ":"
     +  customTime.minute.toString()
     + ":" + customTime.second.toString()
     + " " + customTime.ampm;

    document.getElementById('clock').innerHTML = str;
}

var customTime = {
    hour: 0,
    minute: 0,
    second: 0,
    ampm: 0,
    }

// Takes in current timezone, an offs
//function setCustomTime (timezoneOffset, customTime) {
//    customTime.hour =
//}

// Get different timezones. Find out the difference between
// Find out current timezone and get it's UTC time.

function changeTimeZone(offset) {
    var offsets = {
        HAST: -10,
        PST: -7,
        PDT: -7,
        MST: -6,
        CST: -5,
        EST: -4,
    };

    // Get UTC hour
    var date = new Date();
    var utcHour = date.getUTCHours();

    // Subtract the offset from current UTC hour (UTC hour - offset)
    var offsetDiff = utcHour - offsets[offset];

    // If total is +, convert it to 12 hour time. This is technically already done for hour variable.
    if (offsetDiff > 0) {
        customTime.hour = convertTo12HourTime(offsetDiff);

    }
    // Else, if number is negative or 0, add 24 hours to it. Then convert to 12 hours.
    else {
        var newHour = convertTo12HourTime(offsetDiff + 24);
    }

    return offsets.offset;
}


// Get new time zone selection
// Calculate new time from time zone selection
//