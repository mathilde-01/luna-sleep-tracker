// Bulma calendar 
// Initialize all input of type date
var calendars = bulmaCalendar.attach('[type="date"]', {datePicker: "inline"});

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

// Autoselect 2 days before & 3 days after when a date is selected
// var calendarSelection = document.querySelector('.date-item.is-active.is-date')
// if (calendars[i] == 'select') {
//     datepicker-range.style.display;
// }


/*Script to open form*/
    function openForm(formId, day) {
        const formPopup = document.getElementById(formId);
        formPopup.classList.add('is-active');
        formPopup.setAttribute('data-day-offset',day);
    }
/* Close form*/
    function closeForm(formId) {
        const formPopup = document.getElementById(formId);
        formPopup.classList.remove('is-active');
    }
/* Submit form- takes in the responses and Alerts user of added event*/
    function submitForm(formId) {
        const formPopup = document.getElementById(formId);
        const eventType = document.getElementById('event-type').value;
        const message = document.getElementById('message').value;
        const beginEventTime = document.getElementById('begin-time').value;
        const endEventTime = document.getElementById('end-time').value;
        const dayOffset = parseInt(formPopup.getAttribute('data-day-offset'))
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
        const rawDay = dayjs().add(dayOffset, 'day');
        const formatedDay = dayjs(rawDay).format('YYYY-MM-DD');
        const formateBeginTime = dayjs(formatedDay + beginEventTime).format('YYYY-MM-DD HH:mm');
        const formatedEndTime = dayjs(formatedDay + endEventTime).format('YYYY-MM-DD HH:mm');
        //const length =  
        // [
        //     {
        //         "startHours": [],
        //         "endHours": [],
        //         "length": []
        //     }
        // ]

        /* Conditional statement to alert each input */
        if(formId === 'schedule-form'){
            alert(`${eventType} event added: ${message} at ${eventTime}`);
        }else if(formId === 'sleep-form' && sleepHours >= 8){
            alert(`You slept for ${sleepHours} hours this day! I'm sure that is plenty.`)
        }else if(formId === 'sleep-form' && sleepHours < 8 && sleepHours > 1){
            alert(`You slept for ${sleepHours} hours this day! Binge watching Netflix again?`)
        }else if(formId === 'sleep-form' && sleepHours < 2){
            alert(`You slept for ${sleepHours} hour this day... Not great.`)
        }
    }


// get the moon phase using city name and time
function getMoonPhase(city, date){

	var dateRangeMin = dayjs(date).subtract(3, "day").format("YYYY-MM-DD");
	var dateRangeMax = dayjs(date).add(3, "day").format("YYYY-MM-DD");

	fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + city + '/' + dateRangeMin + '/' + dateRangeMax + '?unitGroup=us&elements=moonphase&include=current&key=Z6C7FPXUVA9JACX4YZ6VGQPPK&contentType=json')
    .then(function (response) {
        return(response.json())
    })
    // display their city and the current day using dayjs
    .then(function (data) {
		for (i = 0; i < 7; i++){
			console.log(data.days[i].moonphase);
			
			if (i === 3) {
				console.log("current phase");
			}
		}
		
	})
}


// get user city from ip address
function getCity(){
	fetch('https://api.ipgeolocation.io/ipgeo?apiKey=a1d419df10e64b8e9710e164ca9b610b&fields=city')
    .then(function (response) {
        return(response.json())
    })
    // display their city and the current day using dayjs
    .then(function (data) {
		// get the moon phase using the city they're in and the current time
		var date = dayjs().format("YYYY-MM-DD");
		getMoonPhase(data.city, date);
	})
}

getCity();

const moonImages = {
    "firstQuarter" : "assets/images/moon-icons/first-quarter.png",
    "fullMoon" : "assets/images/moon-icons/full-moon.png",
    "thirdQuarter" : "assets/images/moon-icons/third-quarter.png",
    "waningCrescent" : "assets/images/moon-icons/waning-crescent.png",
    "waningGibbous" : "assets/images/moon-icons/waning-gibbous.png",
    "waxingCrescent" : "assets/images/moon-icons/waxing-crescent.png",
    "waxingGibbous" : "assets/images/moon-icons/waxing-gibbous.png"
}