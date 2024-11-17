import { faker } from 'https://esm.sh/@faker-js/faker';
import { toEventDetails } from './main.js';

export const allEvents = [];

function populateFakeEvents(containerId, numEvents) {
    const container = document.getElementById(containerId);

    for (let i = 0; i < numEvents; i++) {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');

        const eventTitle = faker.company.catchPhrase();
        const eventGenre = faker.music.genre();
        const eventLocation = faker.location.city();
        const eventImage = faker.image.urlPicsumPhotos({ width: 640, height: 480 }); //generates random image URL from Picsum

        eventCard.innerHTML = `
            <img src="${eventImage}" alt="Event Image">
            <h3>${eventTitle}</h3>
            <p>Genre: ${eventGenre}</p>
            <p>Location: ${eventLocation}</p>
        `;
        const event = { title: eventTitle, genre: eventGenre, location: eventLocation, image: eventImage };

        eventCard.addEventListener('click', ()=> toEventDetails(event));
        container.appendChild(eventCard);
        allEvents.push({... event, element: eventCard});
    }
}

populateFakeEvents('popular-events-list', 10);
populateFakeEvents('events-for-you-list', 10);
