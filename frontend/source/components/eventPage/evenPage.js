export function showEventDetails(event) {
    const eventDetailView = document.getElementById('event-detail-view') || document.createElement('div');
    eventDetailView.id = 'event-detail-view';
    eventDetailView.classList.add('event-detail-view');
    document.body.appendChild(eventDetailView);

    eventDetailView.innerHTML = `
        <div class="event-detail-view">
            <div class="event-detail">
                <button id="back-to-main">Back to Main</button>
                <img src="${event.image}" alt="${event.title}" class="event-detail-image">
                <h2 class="event-detail-title">${event.title}</h2>
                <p class="event-detail-genre">Genre: ${event.genre || 'N/A'}</p>
                <p class="event-detail-location">Location: ${event.location || 'N/A'}</p>
                <button id="add-to-interested">${event.interested ? 'Remove' : 'Add'}</button>
                <button id="rsvp-button">RSVP</button>
                <button id="share-button">Share</button>
            </div>  
            <div class="map-reviews-container">
                <div class="map-container">
                    <img src="https://developers.google.com/static/maps/images/landing/hero_maps_static_api.png" alt="Map Placeholder" class="map-image">
                </div>

                <div class="reviews-container">
                    <div class="reviews-header">
                        <h3>Reviews</h3>
                        <button id="prev-review" class="review-nav-left">&lt;</button>
                        <button id="next-review" class="review-nav-right">&gt;</button>
                    </div>
                    <div class="review-box" id="review-box">
                    </div>
                    <div class="submit-review">
                        <textarea id="review-text" placeholder="Write your review here..."></textarea>
                        <button id="submit-review">Submit Review</button>
                    </div>
                </div>
            
            </div>
            
        </div>
    `;

    document.getElementById('add-to-interested').addEventListener('click', () => updateInterested(event));
    document.getElementById('back-to-main').addEventListener('click', backToMain);
    document.getElementById('share-button').addEventListener('click', () => shareEvent(event));
    document.getElementById('rsvp-button').addEventListener('click', rsvpEvent);
    document.getElementById("submit-review").addEventListener("click", submitReview); 
}

function updateInterested(event) {
    event.interested = !event.interested;
    document.getElementById('add-to-interested').textContent = event.interested ? "Remove" : "Add";
    alert(`Event ${event.interested ? 'added to' : 'removed from'} your Interested list!`);
}



function backToMain() {
    const eventDetailView = document.getElementById('event-detail-view');
    if (eventDetailView) eventDetailView.remove();

    document.getElementById('popular-events').style.display = 'block';
    document.getElementById('events-for-you').style.display = 'block';
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('map-container').style.display = 'none';
}

function shareEvent(event) {
    const eventUrl = `${window.location.origin}${window.location.pathname}?event=${encodeURIComponent(event.title)}`;
    
    navigator.clipboard.writeText(eventUrl)
    .then(() => alert(`Event link copied to clipboard: ${eventUrl}`))
    .catch((error) => console.error('Error', error));
}

function rsvpEvent() {
    // blank page for now
    window.open('about:blank', '_blank');
}

function submitReview() {
  const reviewText = document.getElementById("review-text").value.trim(); 
  const reviewBox = document.getElementById("review-box"); 

  if (reviewText) {
    const reviewElement = document.createElement("div");
    reviewElement.className = "review"; 
    reviewElement.textContent = reviewText; 

    reviewBox.appendChild(reviewElement);

    document.getElementById("review-text").value = "";
  }
//   else {
//     alert("Please write a review before submitting.");
//   }
}