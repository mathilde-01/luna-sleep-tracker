//gets the list from local storage or makes it an empty array
var eventList = JSON.parse(localStorage.getItem("lunaEventList")) || [];
var phasePercentages = [];

// Bulma calendar
// Initialize all input of type date
var calendars = bulmaCalendar.attach('[type="date"]', {
  datePicker: "inline",
  startDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2),
  endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 4),
});

var invisibleDisableEl = $(".invisible-disable");
function resizeInvisibleDisable() {
  console.log(this);
  invisibleDisableEl.each(function () {
    console.log(this);
    var calendarEL = $(this).parent().children("[data-calendar]");
    console.log(calendarEL);
    $(this).width(calendarEL.width());
    $(this).height(calendarEL.height());
  });
}
resizeInvisibleDisable()
$(document).on("resize", resizeInvisibleDisable);

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
  calendars[i].on("show", (date) => {
    console.log(date);
  });
}

// // To access to bulmaCalendar instance of an element
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
  const message = $("#message").val();
  const formElement = $(`#${formId}`);
  var eventTypeElement = $("#event-type");
  var eventType = eventTypeElement.val();
  var dayInputElement = $("#start-date");
  var beginEventTimeElement = $("#begin-time");
  var endEventTimeElement = $("#end-time");
  if (formId == "sleep-form") {
    eventType = "sleep";
    dayInputElement = $("#sleep-date");
    beginEventTimeElement = $("#fell-asleep");
    endEventTimeElement = $("#woke-up");
  }
  var eventType = eventTypeElement.val();
  var dayInput = dayInputElement.val();
  var beginEventTime = beginEventTimeElement.val();
  var endEventTime = endEventTimeElement.val();

  if (eventType === "Select") {
    //alert("Please select an option before submitting.");
    eventTypeElement.addClass("error");
  } else {
    eventTypeElement.removeClass("error");
  }
  if (dayInput === "") {
    dayInputElement.addClass("error");
  } else {
    dayInputElement.removeClass("error");
  }
  if (beginEventTime === "") {
    beginEventTimeElement.addClass("error");
  } else {
    beginEventTimeElement.removeClass("error");
  }
  if (endEventTime === "") {
    endEventTimeElement.addClass("error");
  } else {
    endEventTimeElement.removeClass("error");
  }

  /* Create new div element to display submitted info in column */

  /* Conditional for adding text content */

  /* Get the corresponding day and append info */
  const rawDay = dayjs(dayInput);
  const formatedDay = dayjs(rawDay).format("YYYY-MM-DD");
  const formatedDayPlusOne = dayjs(rawDay).add(1, "day").format("YYYY-MM-DD");
  const formateBeginTime = dayjs(formatedDay + beginEventTime).format(
    "YYYY-MM-DD HH:mm"
  );
  var formatedEndTime = dayjs(formatedDay + endEventTime).format(
    "YYYY-MM-DD HH:mm"
  );
  if (dayjs(formatedEndTime).isBefore(dayjs(formateBeginTime))) {
    formatedEndTime = dayjs(formatedDayPlusOne + endEventTime).format(
      "YYYY-MM-DD HH:mm"
    );
  }
  const length = dayjs(formatedEndTime).diff(dayjs(formateBeginTime), "minute");

  const eventObject = {
    type: eventType,
    startHour: formateBeginTime,
    endHour: formatedEndTime,
    length: length,
  };
  if (length != null) {
    eventList.push(eventObject);
    localStorage.setItem("lunaEventList", JSON.stringify(eventList));
  }

  /* Conditional statement to alert each input */

  // const lengthHours = Math.floor(length/60);
  // const lengthMinutes = length%60;
  // if(formId === 'schedule-form'){
  //     alert(`${eventType} event added: ${message} from ${dayjs(formateBeginTime).format('hh:mm a')} to ${dayjs(formateEndTime).format('hh:mm a')}`);
  // }else if(formId === 'sleep-form' && length >= 480){
  //     alert(`You slept for ${lengthHours} hours and ${lengthMinutes} minutes this day! I'm sure that is plenty.`);
  // }else if(formId === 'sleep-form' && length < 480 && length >= 360){
  //     alert(`You slept for ${lengthHours} hours and ${lengthMinutes} minutes this day! That's not quite enough but still good`);
  // }else if(formId === 'sleep-form' && length < 360 && length > 60){
  //     alert(`You slept for ${lengthHours} hours and ${lengthMinutes} minutes this day! Binge watching Netflix again?`);
  // }else if(formId === 'sleep-form' && length < 60){
  //     alert(`You slept for ${lengthMinutes} minutes this day... That's not even an hour.`);
  // }
}

/* Function to update day titles to selected day*/
function updateDayTitles(selectedDate) {
  var dayTitlesContainer = $("#day-titles-container");

  if (dayTitlesContainer) {
    // Clear the existing day titles
    dayTitlesContainer.html("");

    // Calculate and set the day titles
    for (let i = -2; i <= 4; i++) {
      var day = selectedDate.add(i, "day");
      var columnEl = $("<div>");
      var dayOfWeek = $("<h4>");
      var date = $("<h3>");

      dayOfWeek.text(day.format("ddd").toUpperCase());
      date.text(day.format("D"));
      columnEl.addClass("column p-0");
      columnEl.attr("id", day.format("YYYY-MM-DD"));

      columnEl.append(dayOfWeek);
      columnEl.append(date);
      dayTitlesContainer.append(columnEl);
    }
  }
}

function printSchedule() {
  if (eventList) {
    for (i = 0; i < eventList.length; i++) {
      var startTimeDate = eventList[i].startHours.slice(0, 10);
      var lengthOfEventInMinutes = eventList[i].length;
      var endTimeDate = eventList[i].endHours.slice(0, 10);
      var startTime = eventList[i].startHours.slice(11);
      var endTime = eventList[i].endHours.slice(11);
      var startTimeInMinutes =
        parseInt(startTime.slice(0, 2)) * 60 + parseInt(startTime.slice(3));

      if (startTimeDate === endTimeDate) {
        for (x = 0; x < lengthOfEventInMinutes; x++) {
          minuteIndex = startTimeInMinutes + x;
          $("#" + startTimeDate + "-" + minuteIndex).css(
            "background-color",
            "var(--accent)"
          );
        }
      } else {
        for (x = 0; x < 1440 - startTimeInMinutes; x++) {
          minuteIndex = startTimeInMinutes + x;
          lengthOfEventInMinutes--;
          $("#" + startTimeDate + "-" + minuteIndex).css(
            "background-color",
            "var(--accent)"
          );
        }
        for (x = 0; x < lengthOfEventInMinutes; x++) {
          minuteIndex = 0 + x;
          $("#" + endTimeDate + "-" + minuteIndex).css(
            "background-color",
            "var(--accent)"
          );
        }
      }
    }
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
        var dateIndex = dayjs(dateRangeMin).add(i, "day").format("YYYY-MM-DD");

        if (moonPhaseData <= 0.5) {
          var phasePercent = moonPhaseData * 200;
        } else {
          var phasePercent = 200 * (1 - moonPhaseData);
        }
        phasePercent = Math.round(phasePercent);
        phasePercentages.push(phasePercent / 100);

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

        for (x = 0; x < 1440; x++) {
          var minutesEl = $("<div>");
          minutesEl.attr("id", dayjs(dateIndex).format("YYYY-MM-DD-") + x);
          minutesEl.css({
            height: "0.25px",
            "background-color":
              "rgba(242, 242, 242, " + phasePercentages[i] / 2 + ")",
          });

          $("#" + dayjs(dateIndex).format("YYYY-MM-DD")).append(minutesEl);
        }
      }
      printSchedule();
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
      // get the moon phase using the city they're in and the current time
      var date = dayjs().format("YYYY-MM-DD");

      getMoonPhase(data.city, date);
    });
}

/* Function to hide the current  days of week */
function hideInitialDays() {
  var initialDays = document.querySelectorAll(".initial-days");
  for (var i = 0; i < initialDays.length; i++) {
    initialDays[i].style.display = "none";
  }
}

/* Event listener for selecting dates on bulma calendar */
for (var i = 0; i < calendars.length; i++) {
  calendars[i].on("select", function () {
    hideInitialDays();
  });
}

// Initial update of day titles with the current date
updateDayTitles(dayjs());
getCity();
