console.log("connected");


// Bulma calendar 
// Initialize all input of type date
var calendars = bulmaCalendar.attach('[type="date"]', options);

// Loop on each calendar initialized
for(var i = 0; i < calendars.length; i++) {
	// Add listener to select event
	calendars[i].on('select', date => {
		console.log(date);
	});
}

// To access to bulmaCalendar instance of an element
var element = document.querySelector('#my-element');
if (element) {
	// bulmaCalendar instance is available as element.bulmaCalendar
	element.bulmaCalendar.on('select', function(datepicker) {
		console.log(datepicker.data.value());
	});
}


/*Script to open form*/
    function openForm(formId) {
        const formPopup = document.getElementById(formId);
        formPopup.classList.add('is-active');
    }
/* Close form*/
    function closeForm(formId) {
        const formPopup = document.getElementById(formId);
        formPopup.classList.remove('is-active');
    }
/* Submit form- takes in the responses and Alerts user of added event*/
    function submitForm(formId) {
        const eventType = document.getElementById('event-type').value;
        const message = document.getElementById('message').value;
        const beginEventTime = document.getElementById('begin-time').value;
        const endEventTime = document.getElementById('end-time').value;
        const sleepHours = parseInt(document.getElementById('sleep-hours').value)
        if (eventType.value === "Select") {
            alert("Please select an option before submitting.");
            formId.preventDefault(); // Prevent the form from being submitted.
        } else if (beginEventTime   === "") {
            alert("Please select a start time before submitting.");
            formId.preventDefault();
        } else if (endEventTime   === "") {
            alert("Please select a end time before submitting.");
            formId.preventDefault();
        } else {
            closeForm(formId);
        }
        /* Create new div element to display submitted info in column */

        /* Conditional for adding text content */

        /* Get the corresponding day and append info */

        /* Conditional statement to alert each input */
            if(formId === 'schedule-form'){
                alert(`${eventType} event added: ${message} from ${beginEventTime} to ${endEventTime}`);
            }else if(formId === 'sleep-form' && sleepHours >= 8){
                alert(`You slept for ${sleepHours} hours this day! I'm sure that is plenty.`)
            }else if(formId === 'sleep-form' && sleepHours < 8 && sleepHours > 1){
                alert(`You slept for ${sleepHours} hours this day! Binge watching Netflix again?`)
            }else if(formId === 'sleep-form' && sleepHours < 2){
                alert(`You slept for ${sleepHours} hour this day... Not great.`)
            }
    }