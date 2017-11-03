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

function deleteClock(event) {
    console.log();
}

function saveClock(eevent) {
    var timezone = event.target.getAttribute('data-timezone')
    // Determine if current clock is already saved
    var isClockAlreadySaved = savedTimezoneDupCheck(clocks.savedTimezones, timezone)

    // If selected timezone is already saved, we don't want to save it again.
    if (isClockAlreadySaved) {
        alert("You already saved this timezone bruh.");
        hide_showAvailableTimezones();
        return;
    }

    // Create saved timezone object
    var savedTimezone = {
        "hour": clocks[timezone].hour,
        "ampm": clocks[timezone].ampm,
        "timezone": timezone
    }

    // If not dup, check that there's room to add this.
    if (clocks.savedTimezones.length < 3) {
        clocks.savedTimezones.push(savedTimezone);
    } else {
        alert("No more room to store a timezone. Remove an existing timezone.");
        hide_showAvailableTimezones();
        return;
    }

    // Add saved time to HTML
    // An alternative way (if we go with buttons) would be to copy them
    var SavedTimeszones_Query = document.getElementById('saved-timezones');
    var HTML = '<p class="saved-timezones updateTarget"';
    HTML += " data-timezone=" + "\"" + timezone + "\"" + ">";
    HTML += generateHTMLTime(timezone);
    HTML += "</p>";
    SavedTimeszones_Query.insertAdjacentHTML('beforeend', HTML);

    // Finally, hide timezone buttons after this operation is complete.
    hide_showAvailableTimezones();

}

function savedTimezoneDupCheck(array, valueToCheck) {
    if (array.length === 0)
    {
        return false;
    }

    for (var item in array) {
        console.log("Duplicate detected " + array.timezone)
        if (array[item].timezone === valueToCheck) {
            return true;
        }
    }
}

function addButtonsForClocks(availableTimezones) {
    var timezonesSection_Elem = document.getElementById('timezones-section')

    // Generates HTML with hardcoded class. For dynamic custom data, there's a data method.
    // Skipping data method for now.
    for (var key in availableTimezones) {
        var button = '<button class="timezones updateTarget"'
        button += " data-timezone=" + "\"" + key + "\"" + '>'
        button += generateHTMLTime(key)
        button += "</button>"
        timezonesSection_Elem.insertAdjacentHTML('beforeend', button)   // Add generated HTML to page
    }
}

function generateHTMLTime(timezone) {
    var timeInHTML = "";
    timeInHTML += clocks[timezone].hour + ":" + clocks.minute + " " + clocks[timezone].ampm
    timeInHTML += "</br>" + clocks.timezoneFullname[timezone]

    return timeInHTML
}

function updateMinuteInButtons() {
    // Get the elements we need to update
    var timezones_Query = document.getElementsByClassName('updateTarget')

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
    var timezones_Query = document.getElementsByClassName('updateTarget')

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


// Delete timezones when user clicks on Remove Time Zone buttons and clicks on time
// var timezones_Elems = document.getElementsById('saved-timezones');
// timezones_Elems.addEventListener('click', deleteClock);

//$('.saved-timezones-delete').on('click', deleteClock);          // jQuery version of this above

// Highlight saved timezone text color when remove timezone button is clicked
// var removeTimezone_Elem = document.getElementById('remove-timezone')
// removeTimezone_Elem.addEventListener('click', changeSavedTimezonesTextColor)

$('#remove-timezone').on('click', changeSavedTimezonesTextColor)        // jQuery version of the above


// Add click event to saved times. When user clicks on it, it should update the time
var savedTimezones = document.getElementById('saved-timezones')
savedTimezones.addEventListener('click', swapTime)

function swapTime(e) {
    // Get the hour of the saved timezone
    var tz = e.target.getAttribute('data-timezone')
    var newHour = clocks[tz].hour
    // Set the main clock's hour to the saved timezone's hour
    clocks.hour = newHour

    // NEED TO TAKE INTO ACCOUNT AMPM
    // Update the selected timezone of the main clock to generate the correct AMPM
    clocks.selectedTimezone = tz
}