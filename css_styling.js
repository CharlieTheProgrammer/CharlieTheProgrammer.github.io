"use strict"

// On Click event to hide/show the timezone selections
// Hide/Show the available timezones when user clicks on the button to add time zone.
function hide_showAvailableTimezones() {
    //var timezones = document.getElementsByClassName('timezones');
    var timezones_Query = document.querySelectorAll('.timezones');

    // if opacity is 0
    if (timezones_Query[0].style.opacity == 0 || timezones_Query[0].style.opacity == "") {
        for (var i = 0;i < timezones_Query.length;i++) {
            timezones_Query[i].style.opacity = 1;
        }
    } else {
         for (var i = 0;i < timezones_Query.length;i++) {
            timezones_Query[i].style.opacity = 0;
        }
    }
}


function changeSavedTimezonesTextColor() {
    var SavedTimeszones_Query = document.querySelectorAll('.saved-timezones');
    var SavedTimeszonesDelete_Query = document.querySelectorAll('.saved-timezones-delete');

    if (SavedTimeszones_Query.length > 0){ // Check that elements returned
        for (var i = 0; i < SavedTimeszones_Query.length; i++) {
            SavedTimeszones_Query[i].setAttribute('class', 'saved-timezones-delete');
        }
    } else {
        if (SavedTimeszonesDelete_Query.length > 0) {
            for (var i = 0; i < SavedTimeszonesDelete_Query.length; i++) {
                SavedTimeszonesDelete_Query[i].setAttribute('class', 'saved-timezones');
            }
        }
    }
}


function saveClock(clock) {
    var answer = confirm('Set main clock to selected timezone?')    
    hide_showAvailableTimezones()    
}

// EVENT LISTENERS

// Shows or hides timezones when the 'add new time zone' button is clicked.
// var TimezoneSelector_Elem = document.getElementById('add-timezone');
// TimezoneSelector_Elem.addEventListener('click', hide_showAvailableTimezones);
    // jQuery example of above
$('#add-timezone').on('click', hide_showAvailableTimezones);        // jQuery version of the above


// Hides time zones after they have been clicked.
// var timezones_Elems = document.getElementsByClassName('timezones');
// if (timezones_Elems) {
//     for (var i = 0; i < timezones_Elems.length; i++) {
//         timezones_Elems[i].addEventListener('click', hide_showAvailableTimezones)        
//     }
// }
    
$('.timezones').on('click', saveClock)            // jQuery version of the above



// Highlight saved timezone text color when remove timezone button is clicked
// var removeTimezone_Elem = document.getElementById('remove-timezone')
// removeTimezone_Elem.addEventListener('click', changeSavedTimezonesTextColor)
    
$('#remove-timezone').on('click', changeSavedTimezonesTextColor)        // jQuery version of the above
