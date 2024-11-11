import { faker } from 'https://esm.sh/@faker-js/faker';

function populateFakeEvents(containerId, numEvents) {
    const container = document.getElementById(containerId);

    for (let i = 0; i < numEvents; i++) {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');

        const eventTitle = faker.company.catchPhrase();
        const eventGenre = faker.music.genre();
        const eventLocation = faker.location.city();

        eventCard.innerHTML = `
            <h3>${eventTitle}</h3>
            <p>Genre: ${eventGenre}</p>
            <p>Location: ${eventLocation}</p>
        `;

        container.appendChild(eventCard);
    }
}
populateFakeEvents('popular-events-list', 10);
populateFakeEvents('events-for-you-list', 10);
