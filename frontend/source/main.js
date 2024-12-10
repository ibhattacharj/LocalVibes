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

//fetch popular events from server
async function fetchPopularEvents() {
  try {
    console.log('Fetching popular events...');
    
    const response = await fetch('http://127.0.0.1:4000/events/popular');
    console.log('Response received:', response);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const popularEvents = await response.json();
    console.log('Fetched data:', popularEvents);

    const popularEventsList = document.getElementById('popular-events-list');
    if (!popularEventsList) {
      console.error('Element with id "popular-events-list" not found');
      return;
    }

    popularEventsList.innerHTML = ''; //clear existing content

    //loop through each event. create cards for them in DOM
    popularEvents.forEach(event => {
      console.log('Adding event to DOM:', event);
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
      popularEventsList.appendChild(eventCard);
    });
  } catch (error) {
    console.error('Error fetching popular events:', error);
  }
}

//fetch events for you from server
async function fetchEventsForYou() {
  try {
    console.log('Fetching events for you...');

    const response = await fetch('http://127.0.0.1:4000/events/for-you');
    console.log('Response received:', response);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const eventsForYou = await response.json();
    console.log('Fetched Events for You:', eventsForYou);

    const eventsForYouList = document.getElementById('events-for-you-list');
    if (!eventsForYouList) {
      console.error('Element with id "events-for-you-list" not found');
      return;
    }

    eventsForYouList.innerHTML = ''; //clear existing content

    eventsForYou.forEach(event => {
      console.log('Adding event to DOM:', event);

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
      eventsForYouList.appendChild(eventCard);
    });
  } catch (error) {
    console.error('Error fetching events for you:', error);
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

  markers = [];

  events.forEach(event => {
    let marker = new mapboxgl.Marker()
    .setLngLat([parseFloat(event.long), parseFloat(event.lat)])
    .addTo(map);

    markers.push(marker);
  })

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


searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    const locationTerm = locationBar.value.toLowerCase();  

    //utilizes localStorage
    localStorage.setItem("search", JSON.stringify(searchBar.value));
    updateState(searchTerm, locationTerm);
});

dropDown.addEventListener('click', () => {
  const dropdown = document.querySelector('.dropdown');
  dropdown.classList.toggle('show');
});

locationBar.addEventListener('input', () => {
  const locationTerm = locationBar.value.toLowerCase();
  const searchTerm = searchBar.value.toLowerCase();

  //utilizes localStorage
  localStorage.setItem("location", JSON.stringify(locationBar.value));
  updateState(searchTerm, locationTerm);
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

// Make Tags
function addTags() {
  const tagsContainer = document.querySelector('.tags-container');

  if (!tagsContainer) {
    console.error('Tags container element not found');
    return;
  }

  userTags.forEach(tag => {
    const tagElement = document.createElement('div');
    tagElement.classList.add('tag');
    tagElement.textContent = tag;
    tagElement.setAttribute('data-genre', tag.toLowerCase());

    //click event for tag filtering
    tagElement.addEventListener('click', () => {
      document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
      tagElement.classList.add('active');
      updateState(searchBar.value.toLowerCase(), locationBar.value.toLowerCase());

      const dropdown = document.querySelector('.dropdown');
      dropdown.classList.remove('show');
    });

    tagsContainer.appendChild(tagElement);
  });
}

document.addEventListener('click', (event) => {
  const dropdown = document.querySelector('.dropdown');
  const isClickInside = dropdown.contains(event.target);

  if (!isClickInside) {
      dropdown.classList.remove('show');
  }
});

//add Events
function addEvents(eventType, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`Container element with ID ${containerId} not found`);
      return;
    }

    const events = fakeEvents[eventType]; // 'interested', 'upcoming', 'past'
    container.innerHTML = '';
    
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <h3>${event.title}</h3>
            <p>${event.date}</p>
        `;
        container.appendChild(eventCard);
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
