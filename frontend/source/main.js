import { allEvents } from './fakeData.js';
import { showEventDetails } from './components/eventPage/evenPage.js'

const searchBar = document.getElementById('search-bar');
const popularEventsSection = document.getElementById('popular-events');
const eventsForYouSection = document.getElementById('events-for-you');
const searchResultsContainer = document.getElementById("search-results"); 
const mapContainer = document.getElementById('map-container');



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

function toEventDetails(event) {

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


// Calls updateState()
searchBar.value = JSON.parse(localStorage.getItem("search"));
updateState(JSON.parse(localStorage.getItem("search")));