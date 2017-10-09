"use strict"

// On Click event to hide/show the timezone selections
// Hide/Show the available timezones when user clicks on the button to add time zone.
function hide_showAvailableTimezones() {
    //var timezones = document.getElementsByClassName('timezones');
    var timezones = document.querySelectorAll('.timezones');

    // if opacity is 0
    if (timezones[0].style.opacity == 0 || timezones[0].style.opacity == "") {
        for (var i = 0;i < timezones.length;i++) {
            timezones[i].style.opacity = 1;
        }
    } else {
         for (var i = 0;i < timezones.length;i++) {
            timezones[i].style.opacity = 0;
        }
    }
}


function changeSavedTimezonesTextColor() {
    var elSavedTimeszones = document.querySelectorAll('.saved-timezones');
    var elSavedTimeszonesDelete = document.querySelectorAll('.saved-timezones-delete');

    if (elSavedTimeszones.length > 0){ // Check that elements returned
        for (var i = 0; i < elSavedTimeszones.length; i++) {
            elSavedTimeszones[i].setAttribute('class', 'saved-timezones-delete');
        }
    } else {
    if (elSavedTimeszonesDelete.length > 0) {
        for (var i = 0; i < elSavedTimeszonesDelete.length; i++) {
            elSavedTimeszonesDelete[i].setAttribute('class', 'saved-timezones');
        }
    }
    }
}


// Shows or hides timezones when the 'add new time zone' button is clicked.
var elTimezoneSelector = document.getElementById('add-timezone');
elTimezoneSelector.addEventListener('click', hide_showAvailableTimezones);

// Hides time zones after they have been clicked.
var elemsTimezones = document.getElementsByClassName('timezones');
if (elemsTimezones) {
    for (var i = 0; i < elemsTimezones.length; i++) {
        elemsTimezones[i].addEventListener('click', hide_showAvailableTimezones)
    }
}

// Highlight saved timezone text color when remove timezone button is clicked
var elRemoveTimezone = document.getElementById('remove-timezone')
elRemoveTimezone.addEventListener('click', changeSavedTimezonesTextColor)

