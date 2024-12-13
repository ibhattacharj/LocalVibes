import { showEventDetails } from './components/eventPage/eventPage.js';
import "./components/eventCreationForm/eventCreationForm.js";

console.log('main.js loaded');
console.log("JavaScript Loaded");

//grab all the necessary elements from DOM
const searchBar = document.getElementById('search-bar');
const dropDown = document.getElementById('tag-dropdown-toggle');
const locationBar = document.getElementById('location-filter');
const popularEventsSection = document.getElementById('popular-events');
const eventsForYouSection = document.getElementById('events-for-you');
const searchResultsContainer = document.getElementById("search-results"); 
const mapContainer = document.getElementById('map-container');

//event listener for search bar input
if (searchBar) {
  searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    localStorage.setItem("search", JSON.stringify(searchBar.value));
    updateState(searchTerm);
  });
} else {
  console.error('Search bar element not found');
}

//async function to fetch popular events from server
async function fetchPopularEvents() {
  try {
    console.log('Fetching popular events...'); //log start of fetch process
    
    const response = await fetch('http://127.0.0.1:4000/events/popular'); //send GET request to server
    console.log('Response received:', response); //log raw response object

    if (!response.ok) { //check if the response status is not OK
      throw new Error(`HTTP error! Status: ${response.status}`); //throw error if status is invalid
    }

    const popularEvents = await response.json(); //parse JSON response
    console.log('Fetched data:', popularEvents); //log parsed data

    const popularEventsList = document.getElementById('popular-events-list'); //select DOM element to display popular events
    if (!popularEventsList) { //check if DOM element exists
      console.error('Element with id "popular-events-list" not found'); //log error if element doesn't exist
      return; 
    }

    popularEventsList.innerHTML = ''; //clear any existing content in the popular events list

    //loop through each fetched event and create a card for it in DOM
    popularEvents.forEach(event => {
      console.log('Adding event to DOM:', event); //log event being added to the DOM
      const eventCard = document.createElement('div'); //create new div for event card
      eventCard.classList.add('event-card'); //add 'event-card' class to new div
      eventCard.innerHTML = `
        <img src="${event.image || 'https://via.placeholder.com/150'}" alt="Event Image"> <!--event image or placeholder-->
        <h3>${event.name}</h3> 
        <p>Genre: ${event.tags}</p> 
        <p>Location: ${event.location}</p> 
        <p>Latitude: ${event.lat}</p> 
        <p>Longitude: ${event.long}</p> 
      `;
      eventCard.addEventListener('click', () => toEventDetails(event)); //add click event listener to display event details
      popularEventsList.appendChild(eventCard); //append event card to popular events list
    });
  } catch (error) {
    console.error('Error fetching popular events:', error); //log errors
  }
}

//async function to fetch personalized events for the user
async function fetchEventsForYou() {
  try {
    console.log('Fetching events for you...'); //log start of fetch process

    const response = await fetch('http://127.0.0.1:4000/events/for-you'); //send GET request to fetch personalized events
    console.log('Response received:', response); //log raw response object

    if (!response.ok) { //check if response status is not OK
      throw new Error(`HTTP error! Status: ${response.status}`); //throw error if the status is invalid
    }

    const eventsForYou = await response.json(); //parse JSON response
    console.log('Fetched Events for You:', eventsForYou); //log parsed data

    const eventsForYouList = document.getElementById('events-for-you-list'); //select DOM element to display personalized events
    if (!eventsForYouList) { //check if the DOM element exists
      console.error('Element with id "events-for-you-list" not found'); //log error if element doesn't exist
      return; 
    }

    eventsForYouList.innerHTML = ''; //clear existing content in the personalized events list

    //loop through each fetched event and create a card for it in DOM
    eventsForYou.forEach(event => {
      console.log('Adding event to DOM:', event); //log event being added to DOM
      const eventCard = document.createElement('div'); //create new div for event card
      eventCard.classList.add('event-card'); //add 'event-card' class to the new div
      eventCard.innerHTML = `
        <img src="${event.image || 'https://via.placeholder.com/150'}" alt="Event Image"> <!--event image placeholder-->
        <h3>${event.name}</h3> 
        <p>Genre: ${event.tags}</p> 
        <p>Location: ${event.location}</p> 
        <p>Latitude: ${event.lat}</p> 
        <p>Longitude: ${event.long}</p> 
      `;
      eventCard.addEventListener('click', () => toEventDetails(event)); //click event listener to display event details
      eventsForYouList.appendChild(eventCard); //append event card to personalized events list
    });
  } catch (error) {
    console.error('Error fetching events for you:', error); //log error during fetch process
  }
}

//fetch search results from the server
async function fetchSearchResults(searchTerm, locationTerm, genre) {
  try {
    const url = new URL('http://127.0.0.1:4000/events/search');
    if (searchTerm) url.searchParams.append('query', searchTerm);
    if (locationTerm) url.searchParams.append('location', locationTerm);
    if (genre) url.searchParams.append('genre', genre);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const searchResults = await response.json();
    searchResultsContainer.innerHTML = ''; //clear existing content

    searchResults.forEach(event => {
      const eventCard = document.createElement('div');
      eventCard.classList.add('event-card');
      eventCard.innerHTML = `
        <img src="${event.image || 'https://via.placeholder.com/150'}" alt="Event Image">
        <h3>${event.name}</h3>
        <p>Genre: ${event.tags}</p>
        <p>Location: ${event.location}</p>
        <p>Latitude: ${event.lat}</p>
        <p>Longitude: ${event.long}</p>
      `;
      eventCard.addEventListener('click', () => toEventDetails(event));
      searchResultsContainer.appendChild(eventCard);
    });

    if (searchResults.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = "No events found matching your search.";
      searchResultsContainer.appendChild(noResultsMessage);
    }

    addMarkersToMap(searchResults);
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
}

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJla2tlciIsImEiOiJjbTN3NGxoZTMxM2cwMmpwdTNjODEyMXBvIn0.9o4pgS4R2dJUmwKJseNr5A';

const map = new mapboxgl.Map({
    container: 'map-container',
    center: [-74.5, 40],
    zoom: 9
});

// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
    })
);

let markers = [];

function addMarkersToMap(events) {
  // Clear existing markers 
  if (map.getLayer('event-markers')) {
      map.removeLayer('event-markers');
      map.removeSource('event-markers');
  }

  markers.forEach(marker => {
    marker.remove();
  });

  if (!events || events.length === 0) {
      return;
  }

  // Adds map location marker pins
  markers = [];

  events.forEach(event => {
    let marker = new mapboxgl.Marker()
    .setLngLat([parseFloat(event.long), parseFloat(event.lat)])
    .addTo(map);

    markers.push(marker);
  })

  // Adds text and description to location pin
  const features = events.map(event => ({
      type: 'Feature',
      geometry: {
          type: 'Point',
          coordinates: [parseFloat(event.long), parseFloat(event.lat)] 
      },
      properties: {
          title: event.name,
          description: event.description
      }
  }));

  
  map.addSource('event-markers', {
      type: 'geojson',
      data: {
          type: 'FeatureCollection',
          features: features
      }
  });

  map.addLayer({
      id: 'event-markers',
      type: 'symbol',
      source: 'event-markers',
      layout: {
          'icon-image': 'marker-15',
          'icon-size': 1.5,
          'text-field': ['get', 'title'],
          'text-offset': [0, 1.25],
          'text-anchor': 'top'
      }
  });

  // Fit map bounds to markers
  const bounds = new mapboxgl.LngLatBounds();
  features.forEach(feature => bounds.extend(feature.geometry.coordinates));
  if (features.length > 0) { // Avoid error if no features exist
    map.fitBounds(bounds, { padding: 50 });
  }

  // Add click event to markers
  map.on('click', 'event-markers', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'event-markers', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'event-markers', () => {
    map.getCanvas().style.cursor = '';
  });
}


//add event listener to search bar input
searchBar.addEventListener('input', () => {
  const searchTerm = searchBar.value.toLowerCase(); //convert input value to lowercase
  const locationTerm = locationBar.value.toLowerCase(); //get current value of location filter  

  //store search term in localStorage for persistence
  localStorage.setItem("search", JSON.stringify(searchBar.value)); 
  updateState(searchTerm, locationTerm); //update app state with the search term and location
});

//add event listener to dropdown toggle button
dropDown.addEventListener('click', () => {
  const dropdown = document.querySelector('.dropdown'); //select dropdown element
  dropdown.classList.toggle('show'); //toggle 'show' class to expand or collapse the dropdown menu
});

//add event listener to location bar input
locationBar.addEventListener('input', () => {
  const locationTerm = locationBar.value.toLowerCase(); //convert the location input value to lowercase
  const searchTerm = searchBar.value.toLowerCase(); //get the current value of the search bar

  //store the location term in localStorage for persistence
  localStorage.setItem("location", JSON.stringify(locationBar.value)); 
  updateState(searchTerm, locationTerm); //update app state with search term and location
});


//update page content based on the current search term
function updateState(searchTerm, locationTerm) {
  const activeTag = document.querySelector('.tag.active')?.getAttribute('data-genre');

  if (!searchResultsContainer || !mapContainer || !popularEventsSection || !eventsForYouSection) {
    console.error('One or more required elements are missing');
    return;
  }

  if (searchTerm || locationTerm || activeTag) {
    popularEventsSection.style.display = 'none';
    eventsForYouSection.style.display = 'none';

    searchResultsContainer.style.display = 'block';
    mapContainer.style.display = 'block';

    fetchSearchResults(searchTerm, locationTerm, activeTag);
  } else {
    searchResultsContainer.style.display = 'none';
    mapContainer.style.display = 'none';
    popularEventsSection.style.display = 'block';
    eventsForYouSection.style.display = 'block';
  }
}


export function toEventDetails(event) {
  let eventDetailView = document.getElementById('event-detail-view');
  if (!eventDetailView) {
    eventDetailView = document.createElement('div');
    eventDetailView.id = 'event-detail-view';
    document.body.appendChild(eventDetailView);
  }

  //hide unnecessary details from event view
  popularEventsSection.style.display = 'none';
  eventsForYouSection.style.display = 'none';
  searchResultsContainer.style.display = 'none';
  mapContainer.style.display = 'none';
  eventDetailView.style.display = 'block';
  showEventDetails(event);
}

import { fakeEvents, userTags } from './fakeData.js'; 

//dynamically add tags to the tags container
function addTags() {
  const tagsContainer = document.querySelector('.tags-container'); //select container where tags will be added

  if (!tagsContainer) { //check if tags container exists
    console.error('Tags container element not found'); //log error if it doesn't
    return;
  }

  userTags.forEach(tag => { //iterate over list of user-defined tags
    const tagElement = document.createElement('div'); //create new div for each tag
    tagElement.classList.add('tag'); //assign 'tag' class for styling
    tagElement.textContent = tag; //set tag's text content
    tagElement.setAttribute('data-genre', tag.toLowerCase()); //add data attribute for filtering purposes

    //add click event to each tag for filtering
    tagElement.addEventListener('click', () => {
      document.querySelectorAll('.tag').forEach(t => t.classList.remove('active')); //remove 'active' class from all tags
      tagElement.classList.add('active'); //add 'active' class to clicked tag
      updateState(searchBar.value.toLowerCase(), locationBar.value.toLowerCase()); //update state with current search and location values

      const dropdown = document.querySelector('.dropdown'); //select dropdown
      dropdown.classList.remove('show'); //collapse dropdown after a tag is selected
    });

    tagsContainer.appendChild(tagElement); //add tag element to tags container
  });
}

//event listener to handle clicks outside dropdown menu
document.addEventListener('click', (event) => {
  const dropdown = document.querySelector('.dropdown'); //select dropdown element
  const isClickInside = dropdown.contains(event.target); //check if click occurred inside dropdown

  if (!isClickInside) { //if click was outside dropdown...
    dropdown.classList.remove('show'); //collapse dropdown menu
  }
});

//function to dynamically add events to a specified container
function addEvents(eventType, containerId) {
  const container = document.getElementById(containerId); //select the container by ID

  if (!container) { //check if container exists
    console.error(`Container element with ID ${containerId} not found`); //log error if it doesn't
    return; 
  }

  const events = fakeEvents[eventType]; //retrieve events of a specific type
  container.innerHTML = ''; //clear existing content in container
    
  events.forEach(event => { //iterate over list of events
    const eventCard = document.createElement('div'); //create new div for each event
    eventCard.classList.add('event-card'); //assign 'event-card' class for styling
    eventCard.innerHTML = ` //set the HTML content for the event card
      <img src="${event.image}" alt="${event.title}"> 
      <h3>${event.title}</h3>
      <p>${event.date}</p>
      `;
      container.appendChild(eventCard); //add event card to the container
  });
}


//initialize profile page with user tags and event data
function initProfilePage() {
    addTags();
    addEvents('interested', 'interested-events');
    addEvents('upcoming', 'upcoming-events');
    addEvents('past', 'past-events');
}

//run on DOM load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  
  initProfilePage(); 
  fetchPopularEvents(); 
  fetchEventsForYou();
});

searchBar.value = JSON.parse(localStorage.getItem("search"));
locationBar.value = JSON.parse(localStorage.getItem("location"));
updateState(JSON.parse(localStorage.getItem("search")), JSON.parse(localStorage.getItem("location")));
