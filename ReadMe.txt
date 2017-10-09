Clock

Clock is a mini-project. Basic purpose of this project is just to give
me practice with a simple website and Javascript. 

Requirements:
Phase I
 - Design must show clock in following format: hh:mm:ss PM/AM
    - DONE
 - 'ss' must be updated every second and match actual time
    - DONE
 - Design must be responsive
    - DONE
 
 
Phase II:
 - Add functionality to change timezone.
    - Hawaiian 1
    - Pacific 2
    - Mountain 3
    - Central 4
    - Eastern 5

Phase III:
 - Add functionality to save timezones and be able to switch through them.




***** Phase II *****
1. Add a button on the bottom right. This is the timezone selector

2. Add a table to the right of the button. Table should be a 2 rows by 3 columns.
Each cell in the table itself will have 2 rows. Top is current time in the timezone,
bottom is the name of the time zone. For example:

|  8:15 AM  |
| Mountain  |

3. When the user clicks the selector button, the table should display. The end user can
then click on one of the buttons to select

4. Clicking on the selector should hide the table if it's showing.


***** Phase III *****
-- Storyboard --
Adding a clock
1. User clicks on 'Add New Time' button. Timezones appear.
2. User clicks on a timezone, trigger a prompt "Set main clock to selected Timezone"
  2a. If yes, then update main clock. Add current clock to the first slot.
  2b. If no, add selected timezone to first slot.

Selecting a stored clock
1. User clicks on a saved clock, main clock is updated.

Removing a stored clock
1. User click on 'Remove TimeZones' button. Saved timezones will be highlighted.
    1a. Hide timezones.
2. Remove whichever saved timezones user clicks on.
3. User must click on 'Remove TimeZones' button to de-activate 'delete mode'.




-- To do --
1. DONE - Add new element to engage 'delete mode'.
2. DONE - Finalize the CSS/HTML work first, then work on the JS.