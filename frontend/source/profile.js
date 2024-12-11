// Function to populate the "Events For You" section
function populateEventsForYou(events) {
    const container = document.getElementById('events-for-you-list');
    if (!container) {
        console.error('Container for "Events For You" not found');
        return;
    }

    container.innerHTML = ''; // Clear existing content

    if (events.length === 0) {
        container.innerHTML = '<p>No events found for you.</p>';
        return;
    }

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.innerHTML = `
            <img src="${event.image || 'https://via.placeholder.com/150'}" alt="Event Image">
            <h3>${event.name}</h3>
            <p>Genre: ${event.tags}</p>
            <p>Location: ${event.location}</p>
        `;
        eventCard.addEventListener('click', () => showEventDetails(event));
        container.appendChild(eventCard);
    });
}

// Function to fetch "Events For You" from the server
async function fetchEventsForYou() {
    try {
        console.log('Fetching events for you...');

        const response = await fetch('http://127.0.0.1:4000/events/for-you');
        if (!response.ok) {
            throw new Error(`Failed to fetch events for you: ${response.status}`);
        }

        const events = await response.json();
        console.log('Fetched Events for You:', events);

        populateEventsForYou(events);
    } catch (error) {
        console.error('Error fetching events for you:', error);
    }
}

// Fetch and render "Events For You" on DOM load
document.addEventListener('DOMContentLoaded', () => {
    fetchEventsForYou();
});
