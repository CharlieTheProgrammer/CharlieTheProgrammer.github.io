"use strict"

// On Click event to hide/show the timezone selections
// Hide/Show the available timezones when user clicks on "Select Time Zone" button.
function hide_showAvailableTimezones() {
    //var timezones = document.getElementsByClassName('timezones');
    var timezones = document.querySelectorAll(".timezones");

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

var elTimezoneSelector = document.getElementById("timezone-selector");
elTimezoneSelector.addEventListener('click', hide_showAvailableTimezones);
