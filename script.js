// Weather object to fetch and display weather data
const weather = {
    apikey: "4ddd2d11361bd60eb7a9f367d86a277f",
    fetchWeather: function(city, targetElement, eventDate, eventTime, retry = true) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apikey}`)
            .then((response) => {
                if (!response.ok) {
                    if (retry) {
                        // If the initial fetch fails, fetch the country name and retry
                        countryName(city, (country) => {
                            this.fetchWeather(country, targetElement, eventDate, eventTime, false);
                        });
                    } else {
                        alert("No weather found.");
                        throw new Error("No weather found.");
                    }
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data, targetElement, eventDate, eventTime))
            .catch((error) => {
                console.error('Error fetching weather data:', error);
            });
    },
    displayWeather: function(data, targetElement, eventDate, eventTime) {
        const forecastList = data.list;
        let weatherData = forecastList.find(forecast => forecast.dt_txt.startsWith(`${eventDate} ${eventTime}:00:00`));
        
        if (!weatherData) {
            const newHour1 = (parseInt(eventTime) + 1).toString().padStart(2, '0');
            weatherData = forecastList.find(forecast => forecast.dt_txt.startsWith(`${eventDate} ${newHour1}:00:00`));
        }
        
        if (!weatherData) {
            const newHour2 = (parseInt(eventTime) - 1).toString().padStart(2, '0');
            weatherData = forecastList.find(forecast => forecast.dt_txt.startsWith(`${eventDate} ${newHour2}:00:00`));
        }
        
        if (!weatherData) {
            weatherData = forecastList[0]; // Use the first available forecast if no match is found
        }

        const { icon } = weatherData.weather[0];
        const { temp } = weatherData.main;
        const weatherIcon = targetElement.querySelector(".weather-icon");
        const weatherTemp = targetElement.querySelector(".weather-temp");
        if (weatherIcon && weatherTemp) {
            weatherIcon.src = `https://openweathermap.org/img/wn/${icon}.png`;
            weatherTemp.innerText = `${temp}°C`;
        }
    }
};

// Event listener for DOMContentLoaded to initialize the application
document.addEventListener('DOMContentLoaded', () => {
    displayTool();
    populateEventOptions();
    displayAttendees();
});

// Get references to DOM elements
const filterButtons = document.querySelectorAll('.filter-btn');
const addAttendee = document.getElementById('attendee-form');
const modal = document.getElementById('event-details');
const closeModal = document.querySelector('.close');
const addToCalendarBtn = document.getElementById('add-to-calendar');

// Initialize events and attendees from local storage
let events = JSON.parse(localStorage.getItem('Events')) || [];
let attendees = JSON.parse(localStorage.getItem('Attendees')) || [];
let selectedEvent = null;

// Event listeners for filter buttons to filter events by category
filterButtons.forEach(btn => btn.addEventListener('click', () => {
    filterButtons.forEach(button => button.classList.remove('active'));
    btn.classList.add('active');
    filterEvents();
}));

// Event listener for the attendee form submission
addAttendee.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add the new attendee to the attendees array
    const newAttendee = {
        name: document.getElementById('attendee-name').value,
        email: document.getElementById('attendee-email').value,
        event: document.getElementById('attendee-event').value
    };
    attendees.push(newAttendee);
    // Save attendees to local storage
    localStorage.setItem('Attendees', JSON.stringify(attendees));
    // Reset the form and display the updated attendee list
    e.target.reset();
    displayAttendees();
});

// Function to display events in the event grid
function displayTool() {
    const eventGrid = document.getElementById('event-grid');
    eventGrid.innerHTML = '';
    events.forEach((event) => {
        const card = document.createElement('div');
        card.classList.add('event-card');
        card.dataset.category = event.category;

        const title = document.createElement('h3');
        title.textContent = event.title;

        const date = document.createElement('p');
        const i = document.createElement('i');
        i.classList.add('fas', 'fa-calendar-alt');
        date.appendChild(i);
        date.appendChild(document.createTextNode(` ${event.date}`));

        const location = document.createElement('p');
        const iLocation = document.createElement('i');
        iLocation.classList.add('fas', 'fa-map-marker-alt');
        location.appendChild(iLocation);
        location.appendChild(document.createTextNode(` ${event.location}`));

        const description = document.createElement('p');
        const iDescription = document.createElement('i');
        iDescription.classList.add('fas', 'fa-info-circle');
        description.appendChild(iDescription);
        description.appendChild(document.createTextNode(` ${event.description}`));

        const weatherWidgetStart = document.createElement('div');
        weatherWidgetStart.classList.add('weather-widget');
        const weatherIconStart = document.createElement('img');
        weatherIconStart.classList.add('weather-icon');
        const weatherTempStart = document.createElement('p');
        weatherTempStart.classList.add('weather-temp');
        const sTtitle = document.createElement('h4');
        sTtitle.textContent = 'Weather at start time:';
        weatherWidgetStart.appendChild(weatherIconStart);
        weatherWidgetStart.appendChild(weatherTempStart);

        const weatherWidgetEnd = document.createElement('div');
        weatherWidgetEnd.classList.add('weather-widget');
        const weatherIconEnd = document.createElement('img');
        weatherIconEnd.classList.add('weather-icon');
        const weatherTempEnd = document.createElement('p');
        weatherTempEnd.classList.add('weather-temp');
        const endTitle = document.createElement('h4');
        endTitle.textContent = 'Weather at End time:';
        weatherWidgetEnd.appendChild(weatherIconEnd);
        weatherWidgetEnd.appendChild(weatherTempEnd);

        const viewDetails = document.createElement('button');
        viewDetails.textContent = 'View Details';
        viewDetails.classList.add('view-details');
        viewDetails.addEventListener('click', () => {
            showEventDetails(event);
        });

        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(location);
        card.appendChild(description);
        card.appendChild(sTtitle);
        card.appendChild(weatherWidgetStart);
        card.appendChild(endTitle);
        card.appendChild(weatherWidgetEnd);
        card.appendChild(viewDetails);

        eventGrid.appendChild(card);

        // Extract the hours from sttime or Endtime
        const eventstTime = event.sttime ? event.sttime.split(":")[0] : "00";
        const eventEndTime = event.Endtime ? event.Endtime.split(":")[0] : "00";

        // Fetch and display weather for this event
        weather.fetchWeather(event.location, weatherWidgetStart, event.date, eventstTime);
        weather.fetchWeather(event.location, weatherWidgetEnd, event.date, eventEndTime);
    });
    filterEvents(); // Apply filters after displaying all events
}

// Function to filter events based on filter criteria
function filterEvents() {
    const filterValue = document.querySelector('.filter-btn.active')?.dataset.category || 'all';

    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        const category = card.dataset.category.toLowerCase();

        const isFilterMatch = filterValue === 'all' || category === filterValue;

        if (isFilterMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to populate event options in the attendee form
function populateEventOptions() {
    const attendeeEventSelect = document.getElementById('attendee-event');
    attendeeEventSelect.innerHTML = '';
    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event.title;
        option.textContent = event.title;
        attendeeEventSelect.appendChild(option);
    });
}

// Function to display attendees in the attendee list container
function displayAttendees() {
    const attendeeListContainer = document.getElementById('attendee-list-container');
    attendeeListContainer.innerHTML = '';
    attendees.forEach(attendee => {
        const attendeeItem = document.createElement('div');
        attendeeItem.classList.add('attendee-item');
        attendeeItem.innerHTML = `
            <p><i class="fas fa-user"></i> <strong>Name:</strong> ${attendee.name}</p>
            <p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${attendee.email}</p>
            <p><i class="fas fa-calendar-alt"></i> <strong>Event:</strong> ${attendee.event}</p>
        `;
        attendeeListContainer.appendChild(attendeeItem);
    });
}

// Function to show event details in a modal
function showEventDetails(event) {
    selectedEvent = event;
    document.getElementById('event-title').textContent = event.title;

    const eventDate = document.getElementById('event-date');
    eventDate.innerHTML = ''; // Clear any existing content
    const dateTitle = document.createElement('h3');
    dateTitle.textContent = 'Date:';
    const dateIcon = document.createElement('i');
    dateIcon.classList.add('fas', 'fa-calendar-alt'); // Add icon class
    eventDate.appendChild(dateTitle);
    eventDate.appendChild(dateIcon);
    eventDate.appendChild(document.createTextNode(` ${event.date}`));

    const eventLocation = document.getElementById('event-location');
    eventLocation.innerHTML = ''; // Clear any existing content
    const locationTitle = document.createElement('h3');
    locationTitle.textContent = 'Location:';
    const locationIcon = document.createElement('i');
    locationIcon.classList.add('fas', 'fa-map-marker-alt'); // Add icon class
    eventLocation.appendChild(locationTitle);
    eventLocation.appendChild(locationIcon);
    eventLocation.appendChild(document.createTextNode(` ${event.location}`));

    const eventDescription = document.getElementById('event-description');
    eventDescription.innerHTML = ''; // Clear any existing content
    const descriptionTitle = document.createElement('h3');
    descriptionTitle.textContent = 'Description:';
    const descriptionIcon = document.createElement('i');
    descriptionIcon.classList.add('fas', 'fa-info-circle'); // Add icon class
    eventDescription.appendChild(descriptionTitle);
    eventDescription.appendChild(descriptionIcon);
    eventDescription.appendChild(document.createTextNode(` ${event.description}`));
    
    document.getElementById('weather-start-tilte').textContent = 'Weather at start time:';
    document.getElementById('weather-end-tilte').textContent = 'Weather at end time:';

    const eventWeatherStart = document.getElementById('event-weather-start');
    eventWeatherStart.innerHTML = '';
    eventWeatherStart.classList.add('weather-widget');
    const weatherIconStart = document.createElement('img');
    weatherIconStart.classList.add('weather-icon');
    const weatherTempStart = document.createElement('p');
    weatherTempStart.classList.add('weather-temp');
    eventWeatherStart.appendChild(weatherIconStart);
    eventWeatherStart.appendChild(weatherTempStart);

    const eventWeatherEnd = document.getElementById('event-weather-end');
    eventWeatherEnd.innerHTML = '';
    eventWeatherEnd.classList.add('weather-widget');
    const weatherIconEnd = document.createElement('img');
    weatherIconEnd.classList.add('weather-icon');
    const weatherTempEnd = document.createElement('p');
    weatherTempEnd.classList.add('weather-temp');
    eventWeatherEnd.appendChild(weatherIconEnd);
    eventWeatherEnd.appendChild(weatherTempEnd);

    // Extract the hours from sttime or Endtime
    const eventStartTime = event.sttime ? event.sttime.split(":")[0] : "00";
    const eventEndTime = event.Endtime ? event.Endtime.split(":")[0] : "00";

    // Fetch and display weather for this event
    weather.fetchWeather(event.location, eventWeatherStart, event.date, eventStartTime);
    weather.fetchWeather(event.location, eventWeatherEnd, event.date, eventEndTime);

    const attendeeList = document.getElementById('attendee-list');
    attendeeList.innerHTML = '';
    attendees.filter(attendee => attendee.event === event.title).forEach(attendee => {
        const attendeeItem = document.createElement('li');
        attendeeItem.classList.add('attendee-details-item');
        attendeeItem.innerHTML = `<i class="fas fa-user"></i> ${attendee.name} (${attendee.email})`;
        attendeeList.appendChild(attendeeItem);
    });

    // Fetch and display currency conversion
    if (event.amount && event.currency) {
        countryName(event.location, (country) => {
            fetchCurrencyByCountry(country, (currency) => {
                convertCurrency(event.amount, event.currency, currency, (convertedAmount) => {
                    let amountElement = document.getElementById('amount-element');
                    if (!amountElement) {
                        amountElement = document.createElement('p');
                        amountElement.id = 'amount-element';
                        document.querySelector('.modal-content').appendChild(amountElement);
                    }
                    amountElement.textContent = `Allocated budget: ${convertedAmount} ${currency}`;
                });
            });
        });
    } else {
        let amountElement = document.getElementById('amount-element');
        if (!amountElement) {
            amountElement = document.createElement('p');
            amountElement.id = 'amount-element';
            document.querySelector('.modal-content').appendChild(amountElement);
        }
        amountElement.textContent = `Money Amount: ${event.amount || "No money need"} ${event.currency || ""}`;
    }

    modal.style.display = 'block';
}

// Event listener to close the modal when the close button is clicked
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Event listener to close the modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Event listener to add the selected event to the calendar
addToCalendarBtn.addEventListener('click', () => {
    if (selectedEvent) {
        // Extract the start and end times
        const startTime = selectedEvent.sttime;
        const endTime = selectedEvent.Endtime;

        // Check if the start time is greater than the end time
        if (startTime > endTime) {
            // Add one day to the end date
            const endDate = new Date(selectedEvent.date);
            endDate.setDate(endDate.getDate() + 1);
            selectedEvent.endDate = endDate.toISOString().split('T')[0];
        } else {
            selectedEvent.endDate = selectedEvent.date;
        }

        if (selectedEvent.currency) {
            // Fetch the country name based on the event location
            countryName(selectedEvent.location, (country) => {
                // Fetch the currency based on the country name
                fetchCurrencyByCountry(country, (currency) => {
                    convertCurrency(selectedEvent.amount, selectedEvent.currency, currency, (convertedAmount) => {
                        let calendarEvents = JSON.parse(localStorage.getItem('CalendarEvents')) || [];
                        calendarEvents.push({
                            title: selectedEvent.title,
                            start: selectedEvent.date + 'T' + selectedEvent.sttime,
                            end: selectedEvent.endDate + 'T' + selectedEvent.Endtime, // Ensure end time is correctly set
                            description: selectedEvent.description,
                            location: selectedEvent.location,
                            category: selectedEvent.category,
                            amount: convertedAmount,
                            currency: currency
                        });
                        localStorage.setItem('CalendarEvents', JSON.stringify(calendarEvents));
                        alert('Event added to calendar!');
                    });
                });
            });
        } else {
            let calendarEvents = JSON.parse(localStorage.getItem('CalendarEvents')) || [];
            calendarEvents.push({
                title: selectedEvent.title,
                start: selectedEvent.date + 'T' + selectedEvent.sttime,
                end: selectedEvent.endDate + 'T' + selectedEvent.Endtime, // Ensure end time is correctly set
                description: selectedEvent.description,
                location: selectedEvent.location,
                category: selectedEvent.category,
                amount: selectedEvent.amount,
                currency: selectedEvent.currency
            });
            localStorage.setItem('CalendarEvents', JSON.stringify(calendarEvents));
            alert('Event added to calendar!');
        }
    }
});
// Function to convert currency using an API
function fetchCurrencyByCountry(country, callback) {
    const url = `https://restcountries.com/v3.1/name/${country}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const currency = Object.keys(data[0].currencies)[0];
            callback(currency);
        })
        .catch(error => {
            console.error('Error fetching currency:', error);
            alert('Error fetching currency. Please try again later.');
        });
}
// Function to convert currency using an country name
function countryName(city, callback) {
    const url = `https://api.geonames.org/searchJSON?q=${city}&style=LONG&lang=en&username=location554`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const countryName = data.geonames[0].countryName;
            callback(countryName);
        })
        .catch(error => {
            console.error('Error fetching country name:', error);
            alert('Error fetching country name. Please try again later.');
        });
}
function convertCurrency(amount, fromCurrency, toCurrency, callback) {
    const apiKey = '2ebd6623f7d0c91337fb402a';
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const conversionRate = data.conversion_rate;
            const convertedAmount = amount * conversionRate;
            callback(convertedAmount);
        })
        .catch(error => {
            console.error('Error converting currency:', error);
            alert('Error converting currency. Please try again later.');
        });
}
