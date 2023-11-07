//gets the list from local storage or makes it an empty array
var eventList = JSON.parse(localStorage.getItem('lunaEventList')) || [];

// Bulma calendar
// Initialize all input of type date
var calendars = bulmaCalendar.attach('[type="date"]', {
  datePicker: "inline",
  startDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3),
  endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3),
});

const moonImages = {
  firstQuarter: "assets/images/moon-icons/first-quarter.png",
  fullMoon: "assets/images/moon-icons/full-moon.png",
  thirdQuarter: "assets/images/moon-icons/third-quarter.png",
  waningCrescent: "assets/images/moon-icons/waning-crescent.png",
  waningGibbous: "assets/images/moon-icons/waning-gibbous.png",
  waxingCrescent: "assets/images/moon-icons/waxing-crescent.png",
  waxingGibbous: "assets/images/moon-icons/waxing-gibbous.png",
  newMoon: "assets/images/moon-icons/full-moon.png",
};

var moonPhases = [
  "newMoon",
  "waxingCrescent",
  "firstQuarter",
  "waxingGibbous",
  "fullMoon",
  "waningGibbous",
  "thirdQuarter",
  "waningCrescent",
];

// Loop on each calendar initialized
for (var i = 0; i < calendars.length; i++) {
  // Add listener to select event
  calendars[i].on("select", (date) => {
    console.log(date);
  });
}

// To access to bulmaCalendar instance of an element
var element = document.querySelector("#my-element");
if (element) {
  // bulmaCalendar instance is available as element.bulmaCalendar
  element.bulmaCalendar.on("select", function (datepicker) {
    console.log(datepicker.data.value());
  });
}

/*Script to open form*/
function openForm(formId, day) {
  const formPopup = document.getElementById(formId);
  formPopup.classList.add("is-active");
}
/* Close form*/
function closeForm(formId) {
  const formPopup = document.getElementById(formId);
  formPopup.classList.remove("is-active");
}
/* Submit form- takes in the responses and Alerts user of added event*/
    function submitForm(formId) {
        const formPopup = document.getElementById(formId);
        const message = document.getElementById('message').value;
        var eventType = document.getElementById('event-type').value;
        var dayInput = document.getElementById('start-date').value;
        var beginEventTime = document.getElementById('begin-time').value;
        var endEventTime = document.getElementById('end-time').value;
        if (formId == 'sleep-form') {
            eventType = 'sleep';
            dayInput = document.getElementById('sleep-date').value;
            beginEventTime = document.getElementById('fell-asleep').value;
            endEventTime = document.getElementById('woke-up').value;
        }

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
        const rawDay = dayjs(dayInput);
        const formatedDay = dayjs(rawDay).format('YYYY-MM-DD');
        const formatedDayPlusOne = dayjs(rawDay).add(1,'day').format('YYYY-MM-DD');
        const formateBeginTime = dayjs(formatedDay + beginEventTime).format('YYYY-MM-DD HH:mm');
        var formatedEndTime = dayjs(formatedDay + endEventTime).format('YYYY-MM-DD HH:mm');;
        if (dayjs(formatedEndTime).isBefore(dayjs(formateBeginTime))) {
            formatedEndTime = dayjs(formatedDayPlusOne + endEventTime).format('YYYY-MM-DD HH:mm');
        }
        const length =  dayjs(formatedEndTime).diff(dayjs(formateBeginTime), 'minute');
        
        const eventObject = {
            "type": eventType,
            "startHours": formateBeginTime,
            "endHours": formatedEndTime,
            "length": length
        };

        eventList.push(eventObject);
        localStorage.setItem('lunaEventList', JSON.stringify(eventList));


        /* Conditional statement to alert each input */
        
        const lengthHours = Math.floor(length/60);
        const lengthMinutes = length%60;
        if(formId === 'schedule-form'){
            alert(`${eventType} event added: ${message} from ${dayjs(formateBeginTime).format('hh:mm a')} to ${dayjs(formateEndTime).format('hh:mm a')}`);
        }else if(formId === 'sleep-form' && length >= 480){
            alert(`You slept for ${lengthHours} hours and ${lengthMinutes} minutes this day! I'm sure that is plenty.`);
        }else if(formId === 'sleep-form' && length < 480 && length >= 360){
            alert(`You slept for ${lengthHours} hours and ${lengthMinutes} minutes this day! That's not quite enough but still good`);
        }else if(formId === 'sleep-form' && length < 360 && length > 60){
            alert(`You slept for ${lengthHours} hours and ${lengthMinutes} minutes this day! Binge watching Netflix again?`);
        }else if(formId === 'sleep-form' && length < 60){
            alert(`You slept for ${lengthMinutes} minutes this day... That's not even an hour.`);
        }
    }

// get the moon phase using city name and time
function getMoonPhase(city, date) {
  var dateRangeMin = dayjs(date).subtract(3, "day").format("YYYY-MM-DD");
  var dateRangeMax = dayjs(date).add(3, "day").format("YYYY-MM-DD");

  fetch(
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
      city +
      "/" +
      dateRangeMin +
      "/" +
      dateRangeMax +
      "?unitGroup=us&elements=moonphase&include=current&key=Z6C7FPXUVA9JACX4YZ6VGQPPK&contentType=json"
  )
    .then(function (response) {
      return response.json();
    })
    // display their city and the current day using dayjs
    .then(function (data) {
      for (i = 0; i < 7; i++) {
        var moonPhaseData = data.days[i].moonphase;
        console.log(moonPhaseData);

        if (moonPhaseData <= 0.5) {
          var phasePercent = moonPhaseData * 200;
        } else {
          var phasePercent = 200 * (1 - moonPhaseData);
        }
        phasePercent = Math.round(phasePercent)

        if (i === 3) {
          var moonIndex = Math.round(moonPhaseData * 8) % 8;

          var logoContainerEl = $("#logo-container");
          var moonIconEl = $("<img>");

          moonIconEl.attr("src", moonImages[moonPhases[moonIndex]]);
          moonIconEl.css("max-height", "30px");

          logoContainerEl.append(moonIconEl);

          $("#info-text").text(
            "On " +
              dayjs(date).format("MMMM D, YYYY") +
              " in " +
              city +
              ", the moon is " +
              phasePercent +
              "% illuminated."
          );

          if (phasePercent >= 70) {
            $("#info-text").append(" Close your blinds tonight!");
          }
        }
      }
    });
}

// get user city from ip address
function getCity() {
  fetch(
    "https://api.ipgeolocation.io/ipgeo?apiKey=a1d419df10e64b8e9710e164ca9b610b&fields=city"
  )
    .then(function (response) {
      return response.json();
    })
    // display their city and the current day using dayjs
    .then(function (data) {
    console.log(data.city)
      // get the moon phase using the city they're in and the current time
      var date = dayjs().format("YYYY-MM-DD");

      getMoonPhase(data.city, date);
    });
}


/* Function to update day titles to selected day*/
function updateDayTitles(selectedDate) {
  const dayTitlesContainer = document.getElementById("day-titles-container");

  if (dayTitlesContainer) {
    // Clear the existing day titles
    dayTitlesContainer.innerHTML = "";

    // Calculate and set the day titles
    for (let i = -3; i <= 3; i++) {
      const day = selectedDate.add(i, "day");
      const dayOfWeek = day.format("dddd");
      const date = day.format("MM/DD");
      const column = document.createElement("div");
      column.classList.add("column");
      column.innerHTML = `<h2 class="title">${dayOfWeek} ${date}</h2>`;
      dayTitlesContainer.appendChild(column);
    }
  }
}


// Initial update of day titles with the current date
updateDayTitles(dayjs());
getCity();



