import { allEvents } from './fakeData.js';

const searchBar = document.getElementById('search-bar');
const popularEventsSection = document.getElementById('popular-events');
const eventsForYouSection = document.getElementById('events-for-you');
const searchResultsContainer = document.getElementById("search-results"); 
const mapContainer = document.getElementById('map-container');


searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();

    if (searchTerm.length > 0) {
        popularEventsSection.style.display = 'none';
        eventsForYouSection.style.display = 'none';


        searchResultsContainer.style.display = 'block';  
        mapContainer.style.display = 'block';

        searchResultsContainer.innerHTML = '';

        const filteredEvents = allEvents.filter(event => event.title.toLowerCase().includes(searchTerm));

        filteredEvents.forEach(event => {
           searchResultsContainer.appendChild(event.element.cloneNode(true));
        });

         if(filteredEvents.length === 0){
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = "No events found matching your search.";
            searchResultsContainer.appendChild(noResultsMessage)
         }



    } else {

        searchResultsContainer.style.display = 'none';
        mapContainer.style.display = 'none';
        popularEventsSection.style.display = 'block';
        eventsForYouSection.style.display = 'block';
    }

});