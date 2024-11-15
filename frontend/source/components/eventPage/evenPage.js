export function showEventDetails(event) {
    const eventDetailView = document.getElementById('event-detail-view');

    // this is html code for the event
    eventDetailView.innerHTML = `
        <div class="event-detail">
            <button id="back-to-main">Back to Main</button>
            <img src="${event.image}" alt="${event.title}" class="event-detail-image">
            <h2 class="event-detail-title">${event.title}</h2>
            <p class="event-detail-genre">Genre: ${event.genre}</p>
            <p class="event-detail-location">Location: ${event.location}</p>
            <div id="map-container">
                <img src="https://developers.google.com/static/maps/images/landing/hero_maps_static_api.png" alt="Map">
            </div>
            <div class="event-tags">Tags: ${event.tags.join(', ')}</div>
            <button id="add-to-interested">${event.interested ? 'Remove from Interested' : 'Add to Interested'}</button>
            <button id="rsvp-button">RSVP</button>
            <button id="share-button">Share</button>
            ${event.isCreator ? `<button id="update-reviews">${event.reviewsEnabled ? 'Disable Reviews' : 'Enable Reviews'}</button>` : ''}
            <div id="reviews-container" style="display: none;">
            <h3>Reviews</h3>
            <p>No reviews yet. Be the first to review this event!</p>
        </div>
    `;

    // Add event listeners for the buttons
    document.getElementById('add-to-interested').addEventListener('click', () => UpdateInterested(event));
    document.getElementById('rsvp-button').addEventListener('click', () => window.open('about:blank', '_blank')); //blank page for now
    document.getElementById('share-button').addEventListener('click', () => shareEvent(event));
    document.getElementById('back-to-main').addEventListener('click', backToMain);
}

// Function to update "Interested in" status in the profile of the user
function UpdateInterested(event) {
    event.interested = !event.interested;
    document.getElementById('add-to-interested').textContent = event.interested
        ? "Remove"
        : "Add";
}

// Function to share the event link
function shareEvent(event) {
    navigator.clipboard.writeText(`Check out this event! ${event.title}`);
    alert('Event link copied to clipboard!');
}

// function to navigate back to the main view from event view
function backToMain() {
    const eventDetailView = document.getElementById('event-detail-view');
    const popularEventsSection = document.getElementById('popular-events');
    const eventsForYouSection = document.getElementById('events-for-you');
    const searchResultsContainer = document.getElementById('search-results');
    const mapContainer = document.getElementById('map-container');
    const searchBar = document.getElementById('search-bar');

    // hide event details view
    eventDetailView.style.display = 'none';

    // show main sections back
    popularEventsSection.style.display = 'block';
    eventsForYouSection.style.display = 'block';
    searchBar.style.display = 'block';
    searchResultsContainer.style.display = searchBar.value ? 'block' : 'none';
    mapContainer.style.display = searchBar.value ? 'block' : 'none';
}
