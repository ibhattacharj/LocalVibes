import { openEventForm } from "../eventCreationForm/eventCreationForm.js";

export function showEventDetails(event) {
  const eventDetailView =
    document.getElementById("event-detail-view") ||
    document.createElement("div");
  eventDetailView.id = "event-detail-view";
  eventDetailView.classList.add("event-detail-view");
  document.body.appendChild(eventDetailView);

  eventDetailView.innerHTML = `
        <div class="event-detail-view">
            <div class="event-detail">
                <button id="back-to-main">Back to Main</button>
                <img src="${event.image}" alt="${
    event.title
  }" class="event-detail-image">
                <h2 class="event-detail-title">${event.title}</h2>
                <p class="event-detail-genre">Genre: ${event.genre || "N/A"}</p>
                <p class="event-detail-location">Location: ${
                  event.location || "N/A"
                }</p>
                <button id="add-to-interested">${
                  event.interested ? "Remove" : "Add"
                }</button>
                <button id="rsvp-button">RSVP</button>
                <button id="share-button">Share</button>
                ${
                  event.host === getCurrentUserName()
                    ? `<button id="edit-event-button"> Edit </button>`
                    : ""
                }
            </div>  
            <div class="map-reviews-container">
                <div class="map-container">
                    <img src="https://developers.google.com/static/maps/images/landing/hero_maps_static_api.png" alt="Map Placeholder" class="map-image">
                </div>

                <div class="reviews-container">
                    <div class="reviews-header">
                        <h3>Reviews</h3>
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

  document
    .getElementById("add-to-interested")
    .addEventListener("click", () => updateInterested(event));
  document.getElementById("back-to-main").addEventListener("click", backToMain);
  document
    .getElementById("share-button")
    .addEventListener("click", () => shareEvent(event));
  document.getElementById("rsvp-button").addEventListener("click", rsvpEvent);
  document
    .getElementById("submit-review")
    .addEventListener("click", (event) => submitReview(event));

  if (event.host === getCurrentUserName()) {
    document
      .getElementById("edit-event-button")
      .addEventListener("click", () => {
        openEventForm(event.id);
      });
  }
}

//fot testing

localStorage.setItem("currentUser", "Rock Society");

// this will be replaced with logic to get the current user
function getCurrentUserName() {
  const currentUser = localStorage.getItem("currentUser") || "Guest";
  console.log(`Current User: ${currentUser}`);
  return currentUser;
}

function updateInterested(event) {
  event.interested = !event.interested;
  document.getElementById("add-to-interested").textContent = event.interested
    ? "Remove"
    : "Add";
  alert(
    `Event ${
      event.interested ? "added to" : "removed from"
    } your Interested list!`
  );
}

function backToMain() {
  const eventDetailView = document.getElementById("event-detail-view");
  if (eventDetailView) eventDetailView.remove();

  document.getElementById("popular-events").style.display = "block";
  document.getElementById("events-for-you").style.display = "block";
  document.getElementById("search-results").style.display = "none";
  document.getElementById("map-container").style.display = "none";
}

function shareEvent(event) {
  const eventUrl = `${window.location.origin}${
    window.location.pathname
  }?event=${encodeURIComponent(event.title)}`;

  navigator.clipboard
    .writeText(eventUrl)
    .then(() => alert(`Event link copied to clipboard: ${eventUrl}`))
    .catch((error) => console.error("Error", error));
}

async function submitReview(event) {
  // get the typed text
  event.preventDefault();
  const reviewText = document.getElementById("review-text").value;
  const eventTitle = document.querySelector(".event-detail-title");
  const eventName = eventTitle
    ? eventTitle.innerText
    : "No event name available";
  // if there is text, then we need to post to db
  if (reviewText) {
    const response = await fetch("http://127.0.0.1:4000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // in db, records contain the text and the event its for
      body: JSON.stringify({
        review_text: reviewText,
        event_name: eventName,
      }),
    });

    // the post request should return res with just the text
    const newReview = await response.json();
    if (response.ok) {
      const reviewBox = document.getElementById("review-box");
      reviewBox.innerHTML += `<p>${newReview.review_text}</p>`; // Append review
      document.getElementById("review-text").value = ""; // Clear text area
      alert("Review Submitted!");
    } else {
      alert("Failed to submit review");
    }
  } else {
    alert("Please write a review");
  }
}

function rsvpEvent(event) {
  const modal = document.getElementById("rsvp-modal");
  if (!modal) {
    const modalElement = document.createElement("div");
    modalElement.id = "rsvp-modal";
    modalElement.classList.add("modal");
    modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>RSVP for ${event.title}</h3>
                <form id="rsvp-form">
                    <label for="attendance">Will you attend?</label>
                    <select id="attendance">
                        <option value="yes">Yes</option>
                        <option value="maybe">Maybe</option>
                        <option value="no">No</option>
                    </select>

                    <label for="attendees">How many people are attending?</label>
                    <input type="number" id="attendees" min="1" value="1">

                    <label for="comments">Additional comments</label>
                    <textarea id="comments" placeholder="Any additional information?"></textarea>

                    <button type="submit" id="submit-rsvp">Submit RSVP</button>
                </form>
            </div>
        `;

    document.body.appendChild(modalElement);

    document
      .querySelector(".close")
      .addEventListener("click", () => (modalElement.style.display = "none"));

    document.getElementById("rsvp-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const attendance = document.getElementById("attendance").value;
      const attendeesCount = document.getElementById("attendees").value;
      const comments = document.getElementById("comments").value;

      console.log(`RSVP for event: ${event.title}`);
      console.log(`Attendance: ${attendance}`);
      console.log(`Number of people: ${attendeesCount}`);
      console.log(`Comments: ${comments}`);

      modalElement.style.display = "none";
    });
  }
  modal.style.display = "block";
}