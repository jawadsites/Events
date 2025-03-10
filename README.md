# Smart Event Management Dashboard

## Project Overview

The Smart Event Management Dashboard is a web application designed to help users manage events and attendees efficiently. The application allows users to add, edit, and view events, as well as manage attendee lists for each event. The project is built using HTML, CSS, and JavaScript, and leverages local storage to persist data.

## Project Structure

- **index.html**: The main dashboard page where users can view upcoming events, filter events by category, and manage attendees.
- **script.js**: The main JavaScript file for the dashboard, handling dynamic content population and event management.
- **addevents.html**: The page where users can add or edit events.
- **addevents.js**: The JavaScript file for the add/edit event page, handling form submissions and local storage operations.
- **style.css**: The stylesheet for the application, providing the necessary styles for the UI components.
- **celender.html**: The calendar page where users can view events on a calendar.

## Features

1. **Event Management**:
   - Add new events with details such as title, date, time, location, description, and category.
   - Edit existing events.
   - View a list of upcoming events.
   - Filter events by category (workshop, conference, party).

2. **Attendee Management**:
   - Add attendees to specific events.
   - View the list of attendees for each event.

## APIs Used

The project uses the following APIs:



1. **Font Awesome**:
   - URL: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
   - Purpose: Provides icons used throughout the application.

2. **OpenWeatherMap API**:

The OpenWeatherMap API is used to fetch weather information for the event locations. The weather data is displayed for both the start and end times of the events.

- **Endpoint**: `https://api.openweathermap.org/data/2.5/forecast`
- **Parameters**:
  - `q`: City name
  - `units`: Units of measurement (metric)
  - `appid`: API key



3.  **RestCountries API**

The RestCountries API is used to fetch the country name based on the country code obtained from the OpenWeatherMap API.

Example API request:
`https://restcountries.com/v3.1/alpha/{COUNTRY_CODE}`

4. **ExchangeRate-API**:
The ExchangeRate-API is used to fetch currency conversion rates based on the event location.
**
**Endpoint**:` https://v6.exchanger-api.com/v6/YOUR_API_KEY/latest`
- **Parameters**:
- `fromCurrency`: The currency to convert from
- `toCurrency`: The currency to convert to

5. **RestCountries API**:
The RestCountries API is used to fetch the currency based on the country name.

**Endpoint**:` https://restcountries.com/v3.1/name`
- **Parameters**:
   - `country`: Country name
6. **OpenWeatherMap API**:
The OpenWeatherMap API is used to fetch the country code based on the city name provided in the event location.

Example API request:
`https://api.openweathermap.org/geo/1.0/direct?q={CITY_NAME}&limit=1&appid={YOUR_API_KEY}`


### Font Awesome

- **URL**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- **Purpose**: Provides icons used throughout the application.
## How to Use

1. **Adding Events**:
   - Navigate to the "Add Event" page.
   - Fill out the event form with the required details.
   - Click the "Add Event" button to save the event to local storage.

2. **Viewing Events**:
   - Navigate to the main dashboard page.
   - View the list of upcoming events in the "Upcoming Events" section.
   - Use the filter buttons to filter events by category.

3. **Managing Attendees**:
   - Navigate to the "Attendees" section on the main dashboard page.
   - Fill out the attendee form with the required details.
   - Select the event to which the attendee should be added.
   - Click the "Add Attendee" button to save the attendee to local storage.

## Installation

To run the project locally, follow these steps:

1. Clone the repository to your local machine.
2. Open the project directory in your preferred code editor.
3. Open `index.html` in a web browser to view the main dashboard.
4. Open `addevents.html` in a web browser to add or edit events.
