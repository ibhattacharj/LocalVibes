import { allEvents } from './fakeData.js';
import { showEventDetails } from './components/eventPage/evenPage.js';

const searchBar = document.getElementById('search-bar');
const popularEventsSection = document.getElementById('popular-events');
const eventsForYouSection = document.getElementById('events-for-you');
const searchResultsContainer = document.getElementById("search-results"); 
const mapContainer = document.getElementById('map-container');

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

searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();

    // Utilizes localStorage
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

        searchResultsContainer.innerHTML = '';

        const filteredEvents = allEvents.filter(event => event.title.toLowerCase().includes(searchTerm));

        filteredEvents.forEach(event => {
           const eventCard = event.element.cloneNode(true);
           // on click, the eventview will appear
           eventCard.addEventListener('click', () => toEventDetails(event));
           searchResultsContainer.appendChild(eventCard);
        });

         if(filteredEvents.length === 0){
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = "No events found matching your search.";
            searchResultsContainer.appendChild(noResultsMessage);
         }



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
//For Profile Page(s)
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

// Add Events
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

// Initialize Profile Page
function initProfilePage() {
    addTags();
    addEvents('interested', 'interested-events');
    addEvents('upcoming', 'upcoming-events');
    addEvents('past', 'past-events');
}

// Run on DOM load
document.addEventListener('DOMContentLoaded', initProfilePage);

// Calls updateState()
searchBar.value = JSON.parse(localStorage.getItem("search"));
updateState(JSON.parse(localStorage.getItem("search")));