"use strict"

// On Click event to hide/show the timezone selections
// Hide/Show the available timezones when user clicks on the button to add time zone.
function hide_showAvailableTimezones() {
    //var timezones = document.getElementsByClassName('timezones');
    var timezones_Query = document.querySelectorAll('.timezones');

    // // if opacity is 0
    // if (timezones_Query[0].style.opacity == 0 || timezones_Query[0].style.opacity == "") {
    //     for (var i = 0;i < timezones_Query.length;i++) {
    //         timezones_Query[i].style.opacity = 1;
    //     }
    // } else {
    //      for (var i = 0;i < timezones_Query.length;i++) {
    //         timezones_Query[i].style.opacity = 0;
    //     }
    // }

    if (timezones_Query != undefined) {
        for (var i = 0; i < timezones_Query.length; i++) {            
            timezones_Query[i].classList.toggle("activate")            
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


function saveClock(e) {
    var answer = confirm('Set main clock to selected timezone?')    
    if (answer === true) {        
        var timezone = e.target.getAttribute('data-timezone')
        clocks.hour = clocks[timezone].hour        
    }
    hide_showAvailableTimezones() 
}


function addButtonsForClocks(availableTimezones) {
    var timezonesSection_Elem = document.getElementById('timezones-section')

    // Generates HTML with hardcoded class. For dynamic custom data, there's a data method. 
    // Skipping data method for now.
    for (var key in availableTimezones) {
        var button = '<button class="timezones"'
        button += " data-timezone=" + "\"" + key + "\"" + '>'
        button += clocks[key].hour + ":" + clocks.minute + " " + clocks[key].ampm
        button += "</br>" + clocks.timezoneFullname[key]
        button += "</button>"        
        timezonesSection_Elem.insertAdjacentHTML('beforeend', button)   // Add generated HTML to page
    }  
}


function updateMinuteInButtons() {
    // Get the elements we need to update
    var timezones_Query = document.getElementsByClassName('timezones')
       
    if (timezones_Query) {
        // Do NOT use 'for in' for CSS queries, it counts ALL properties. Instead use length property
        for (var item = 0; item < timezones_Query.length; item++) {
            var currentHTML
            currentHTML = timezones_Query[item].innerHTML

            var updatedStr = currentHTML.replace(/\d\d(?=\s)/, clocks.minute)
            timezones_Query[item].innerHTML = updatedStr
        }
    }
}

function updateHourInButtons() {
    // Get the elements we need to update
    var timezones_Query = document.getElementsByClassName('timezones')
       
    if (timezones_Query) {
        // Do NOT use 'for in' for CSS queries, it counts ALL properties. Instead use length property
        for (var item = 0; item < timezones_Query.length; item++) {
            var currentHTML
            currentHTML = timezones_Query[item].innerHTML

            var timezone = timezones_Query[item].getAttribute('data-timezone')

            var updatedStr = currentHTML.replace(/(\d\d:|\d:)/, clocks[timezone].hour + ":") 
            timezones_Query[item].innerHTML = updatedStr
        }
    }
}


addButtonsForClocks(clocks.availableTimezones)           // Populate HTML with clocks

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
