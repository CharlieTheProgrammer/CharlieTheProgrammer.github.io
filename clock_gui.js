"use strict"

/**
 * Shows or hides the available timezone buttons in clock app.
 */
function hide_showAvailableTimezones() {
    var timezones_Query = document.querySelectorAll('.timezones');

    if (timezones_Query != undefined) {
        for (var i = 0; i < timezones_Query.length; i++) {
            timezones_Query[i].classList.toggle("activate")
        }
    }
}

/**
 * Enables/disables ability to delete timezones user has saved.
 */
function enable_disableDeleteMode() {
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

function deleteClock(event){
    var list = event.target.classList;

    if (list.contains("saved-timezones-delete")){
        // Get timezoneabbrev
        var timezoneAbbrev = event.target.getAttribute('data-timezone');
        // Check that it's not empty
        if (!timezoneAbbrev){
            console.error("data-timezone value could not be retrieved.");
            return;
        }

        // Remove the timezone from the userSavedClock prototype, which is an array
        try {
            // First get the index of the element we want to remove
            var indexToRemove =  clockCollection[timezoneAbbrev].userSavedClocks.indexOf(timezoneAbbrev);
            clockCollection[timezoneAbbrev].userSavedClocks.splice(indexToRemove, 1);
        } catch (e){
            console.error(e);
            alert("There was an error removing the timezone.")
            return;
        }
        event.target.remove();
    }
}

/**
 * This function does quite a bit, but leaving as is.  *
 */
function saveClock(event){
    var timezoneAbbrev = event.target.getAttribute('data-timezone');
    // Determine if current clock is already saved
    var isClockSaved = isClockUserSaved(timezoneAbbrev);

    if (isClockSaved) {
        alert("This timezone is already saved.");
        hide_showAvailableTimezones();
        return;
    }

    // Determine if user is trying to save more clocks than allowed.
    if (clockCollection[timezoneAbbrev].userSavedClocks.length >= config.MAX_SAVED_CLOCKS_LIMIT){
        alert("No more room to store a timezone. Remove an existing timezone.");
        hide_showAvailableTimezones();
        return;
    } else {
        try {
            clockCollection[timezoneAbbrev].userSavedClocks.push(timezoneAbbrev);
        } catch (e) {
            throw new Error("Failed to save user clock." + e)
            return;
        }
    }

    // If the above checks passed, a button will be created and added.
    var classes = "saved-timezones updateTarget";
    var dataAttribute = {
        "timezone": timezoneAbbrev
    }

    var button = makeTimeButton(classes,
        dataAttribute,
        clockCollection[timezoneAbbrev],
        config.timeFormat);

    // Add the new button to the document.
    var SavedTimeszones_Query = document.getElementById('saved-timezones');
    SavedTimeszones_Query.insertAdjacentElement('beforeend', button);

    // Finally, hide timezone buttons after this operation is complete.
    hide_showAvailableTimezones();
}

function isClockUserSaved(timezoneAbbrev){
    /*
        Here, userSavedClocks is a prototype of a clock object, so it doesn't
        matter which clock in the collection is used, it will have access to the
        list of clocks saved by the user.
    */
    for (var i = 0; i < clockCollection[timezoneAbbrev].userSavedClocks.length; i++){
        if (clockCollection[timezoneAbbrev].userSavedClocks[i] == timezoneAbbrev){
            return true;
        }
    }
    return false;
}

/**
 * Creates an HTML button specifically with the time as text.
 * @param {string} classes - This is help for the classes param.
 * @param {Object} dataAttribute - {attribute: attribute value}
 * @param {Object} clock - See Clock object.
 * @param {Object} timeformat - See config.timeFormat
 * @returns {HTMLElement} - Returns a button HTML element.
 */
function makeTimeButton(classes, dataAttribute, clock, timeformat){
    // Create dom button
    var domButton = document.createElement("BUTTON");
    // Add classes via DOM
    if (classes) {
        domButton.className = classes;
    }
    // Add data attributes if needed
    if (dataAttribute){
        var dataAttribKeyName = Object.keys(dataAttribute)

        if (dataAttribKeyName > 1){
            throw new Error("Only 1 data attribute is valid.")
            return;
        }
        domButton.dataset[dataAttribKeyName[0]] = dataAttribute[dataAttribKeyName[0]];
    }
    // Add text to button
    var text = "";

    if (clock.hasOwnProperty("getTime")){
        // Should probably put try statements down here, like checking that the object has the required method
        if (timeformat) {
            text = clock.getTime(timeformat);
        } else {
            text = clock.getTime();
        }
    } else {
        throw new Error("Invalid clock object.");
    }
    // Append time to button
    domButton.innerHTML = text + "<br>" + config.timezoneFullname[dataAttribute.timezone];

    // Return button
    // Button not attached here in case many buttons need to be added. It's more
    // efficient to add them all at once.
    return domButton;
}


function addClockButtonsToApp(){
    var timezonesSection_Elem = document.getElementById('timezones-section');
    var classes = "timezones updateTarget";

    // Generates HTML with hardcoded class for now.
    for (var clock in clockCollection){
        if (clockCollection.hasOwnProperty(clock)) {
            var dtValue = clockCollection[clock].getTimezoneAbbrev();
            if (dtValue == ""){
                console.error("An error has occurred.  Unable to retrieve timezone abbrev.");
                return;
            }
            var dataAttribute = {"timezone": dtValue};
            var button = makeTimeButton(classes,
                dataAttribute,
                clockCollection[clock],
                config.timeFormat);

            timezonesSection_Elem.insertAdjacentElement('beforeend', button)   // Add generated HTML to page
        }
    }
}


function updateTimeinButtons() {
    // Get a list of all buttons that need to be updated, currently, the updateTarget class. This should be a data attrib.
    var updateTargetQuery = document.getElementsByClassName("updateTarget");

    // For each element in the query, get the data attribute, get a new time for the attrib, set the new time
    for (var i = 0; i < updateTargetQuery.length; i++){
        // Get the date attribute
        var tz = updateTargetQuery[i].dataset["timezone"];
        // Get a new time the attrib from clock Collection
        try {
            var time = clockCollection[tz].getTime(config.timeFormat);
        } catch(error) {
            console.error("Unable to update time: " + error);
            return;
        }
        // set the new time
        var text = time + "<br>" + config.timezoneFullname[tz];
        updateTargetQuery[i].innerHTML = text;
    }
}

/**
 * Swaps the main clock with a user saved clock when user clicks on saved
 * clock button.
 */
function swapTime(event) {
    // Need to check if event is in delete mode and if it is skip swapping time
    if (event.target.classList.contains("saved-timezones-delete")) {
        return;
    }

    userSelectedClock = event.target.getAttribute('data-timezone')
}


function launchEventListeners(){
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
        var savedTimezones_Elems = document.getElementById('saved-timezones');
        savedTimezones_Elems.addEventListener('click', deleteClock);

        //$('.saved-timezones-delete').on('click', deleteClock);          // jQuery version of this above

        // Highlight saved timezone text color when remove timezone button is clicked
        // var removeTimezone_Elem = document.getElementById('remove-timezone')
        // removeTimezone_Elem.addEventListener('click', enableDeleteMode)

        $('#remove-timezone').on('click', enable_disableDeleteMode)        // jQuery version of the above


        // Add click event to saved times. When user clicks on it, it should update the time
        var savedTimezones = document.getElementById('saved-timezones')
        savedTimezones.addEventListener('click', swapTime)
}


var mainClock = document.getElementById('clock');