// Event listener for DOMContentLoaded to initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const eventForm = document.getElementById('event-form');
    const events = JSON.parse(localStorage.getItem('Events')) || [];

    // Event listener for the event form submission
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Create a new event object from the form data
        const newEvent = {
            title: document.getElementById('title').value,
            date: document.getElementById('date').value,
            sttime: document.getElementById('timeSt').value,
            Endtime: document.getElementById('timeEnd').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            category: document.getElementById('event-category').value
        };
        const question = confirm("Do you need any currency to do this event?");
        if (question) {
            const country = prompt("The current currency of your money","e.g,lebanon,United States,etc");
            const amount = prompt("Enter the amount you need");
            newEvent.amount = amount;
    
            // Fetch the currency based on the country name
            countryName(country, (countryName) => {
            fetchCurrencyByCountry(countryName, (currency) => {
                newEvent.currency = currency;
            });
        });
                // Save the event after fetching the currency
                saveEvent(newEvent);
        } else {
            // Save the event directly if no currency is needed
            saveEvent(newEvent);
        }
    }
)}
)
function saveEvent(newEvent) {
    let events = JSON.parse(localStorage.getItem('Events')) || [];
    const existingEvent = events.findIndex((event) => event.title === newEvent.title);
    if (existingEvent !== -1) {
        events[existingEvent] = newEvent;
    } else {
        events.push(newEvent);
    }
    localStorage.setItem('Events', JSON.stringify(events));

    document.getElementById('event-form').reset();
    window.location.href = "index.html";
}

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

function countryName(city, callback) {
    const url = `http://api.geonames.org/searchJSON?q=${city}&style=LONG&lang=en&username=location554`;

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