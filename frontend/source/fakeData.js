import { faker } from 'https://esm.sh/@faker-js/faker';
import { toEventDetails } from './main.js';
export const allEvents = [];

//commented out as it interferes with database inputs
async function populateFakeEvents(containerId, numEvents) {
    try {
        const response = await fetch('http://127.0.0.1:4000/events/popular');
        const popularEvents = response.data;
        const popularEventsList = document.getElementById('popular-events-list');
        popularEventsList.innerHTML = '';

        searchResults.forEach(e => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');

            eventCard.innerHTML = `
                <img src="${e.image || 'https://via.placeholder.com/150'}" alt="Event Image">
                <h3>${e.name}</h3>
                <p>Genre: ${e.tags}</p>
                <p>Location: ${e.location}</p>
                <p>Latitude: ${e.lat}</p>
                <p>Longitude: ${e.long}</p>
            `;
            const event = { title: eventTitle, genre: eventGenre, location: eventLocation, image: eventImage };

            eventCard.addEventListener('click', ()=> toEventDetails(event));
            container.appendChild(eventCard);
            allEvents.push({... event, element: eventCard});
        });
    }
    catch (error) {
        console.error('Error fetching events:', error);
    }
}
    


export const fakeEvents = {
    interested: [
        { title: 'Rock Fest 2024', date: '2024-12-01', image: 'rock-fest.jpg' },
        { title: 'Jazz Night', date: '2024-11-20', image: 'jazz-night.jpg' }
    ],
    upcoming: [
        { title: 'Electronic Beats', date: '2024-12-10', image: 'electronic-beats.jpg' }
    ],
    past: [
        { title: 'Acoustic Jam', date: '2024-10-15', image: 'acoustic-jam.jpg' }
    ]
};

export const userTags = ['Rock', 'Jazz', 'Electronic', 'Acoustic', 'Pop', 'Classical', 'Hip-Hop', 'Country'];

populateFakeEvents('popular-events-list', 10);
populateFakeEvents('events-for-you-list', 10);
