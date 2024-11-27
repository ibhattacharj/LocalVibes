import { showEventDetails } from './components/eventPage/evenPage.js';
//import axios from 'https://cdn.skypack.dev/axios';

console.log('main.js loaded');

console.log("JavaScript Loaded");

const searchBar = document.getElementById('search-bar');
const popularEventsSection = document.getElementById('popular-events');
const eventsForYouSection = document.getElementById('events-for-you');
const searchResultsContainer = document.getElementById("search-results"); 
const mapContainer = document.getElementById('map-container');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  //initProfilePage(); 

  fetch('http://127.0.0.1:5000/events/popular')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched popular events using fetch:', data);
    })
    .catch(error => {
      console.error('Error fetching popular events:', error);
    });
  //fetchPopularEvents(); 
});

//fetch popular events from server
async function fetchPopularEvents() {
  try {
    console.log('Fetching popular events...');
    const response = await axios.get('http://127.0.0.1:5000/events/popular');
    console.log('Fetched data:', response.data); //to log fetched data

    const popularEvents = response.data;
    const popularEventsList = document.getElementById('popular-events-list');

    if (!popularEventsList) {
      console.error('Element with id "popular-events-list" not found');
      return;
    }

    popularEventsList.innerHTML = '';
    
    popularEvents.forEach(event => {
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
      const response = await axios.get('http://127.0.0.1:5000/events/for-you');
      const eventsForYou = response.data;
      const eventsForYouList = document.getElementById('events-for-you-list');
      eventsForYouList.innerHTML = '';
  
      eventsForYou.forEach(event => {
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
async function fetchSearchResults(searchTerm) {
  try {
    const response = await axios.get('http://127.0.0.1:5000/events/search', {
      params: { query: searchTerm }
    });
    const searchResults = response.data;
    searchResultsContainer.innerHTML = '';

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
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
}

searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();

    //utilizes localStorage
    localStorage.setItem("search", JSON.stringify(searchBar.value));
    console.log("hi");
    updateState(searchTerm);
});

function updateState(searchTerm) {
    if (searchTerm.length > 0) {
        popularEventsSection.style.display = 'none';
        eventsForYouSection.style.display = 'none';

        searchResultsContainer.style.display = 'block';  
        mapContainer.style.display = 'block';

        fetchSearchResults(searchTerm); //fetch search results from the server
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
    userTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
}

//add Events
function addEvents(eventType, containerId) {
    const container = document.getElementById(containerId);
    const events = fakeEvents[eventType]; // 'interested', 'upcoming', 'past'
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


//initialize Profile Page
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
    fetchPopularEvents(); //fetch and display popular events from the server
});

searchBar.value = JSON.parse(localStorage.getItem("search"));
updateState(JSON.parse(localStorage.getItem("search")));
