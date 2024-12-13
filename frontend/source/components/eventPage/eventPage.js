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
    event.name
  }" class="event-detail-image">
                <h2 class="event-detail-title">${event.name}</h2>
                <p class="event-detail-genre">Genre: ${event.tags || "N/A"}</p>
                <p class="event-detail-location">Location: ${
                  event.location || "N/A"
                }</p>
                <button id="add-to-interested">${
                  event.interested ? "Remove" : "Add"
                }</button>
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
    const eventName = document.querySelector(".event-detail-title").innerText;
    fetchAndDisplayReviews(eventName);

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
    .addEventListener("click", submitReview);
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
  }?event=${encodeURIComponent(event.name)}`;

  navigator.clipboard
    .writeText(eventUrl)
    .then(() => alert(`Event link copied to clipboard: ${eventUrl}`))
    .catch((error) => console.error("Error", error));
}

async function submitReview() {
  const reviewText = document.getElementById("review-text").value;
  const eventName = document.querySelector(".event-detail-title").innerText;

  if (reviewText) {
    // create a reviewElement div for css purposes
    const reviewElement = document.createElement("div");
    reviewElement.className = "review";
    reviewElement.textContent = reviewText;

    // append the review to other displayed reviews
    const reviewBox = document.getElementById("review-box");
    reviewBox.appendChild(reviewElement);

    document.getElementById("review-text").value = "";

    // logic to post to db
    const review = JSON.stringify({
      review_text: reviewText,
      event_name: eventName,
    });

      // Fetching from Post API endpoint
    const response = await fetch("http://127.0.0.1:4000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: review,
    });
    // error handling
    if (response.ok) {
      alert("Review has been submitted!");
    } else {
      alert("Failed to submit review");
    }
  } else {
    alert("Please write a review");
  }
}

async function fetchAndDisplayReviews(eventName) {
    // Check if eventName is provided
    console.log(eventName);
  if (!eventName) {
    console.error("Event name is undefined or empty");
    alert("Event name is missing. Unable to fetch reviews.");
    return;
  }

  try {
    // Fetch reviews from the server
    const response = await fetch(
      `http://127.0.0.1:4000/api/reviews?event_name=${eventName}`
    );
      console.log(response);
    // Check if the response is successful
    if (!response.ok) {
      console.error("Error fetching reviews: " + response.statusText);
      alert("Failed to fetch reviews. Please try again later.");
      return;
    }

    // Parse the response JSON
    const reviews = await response.json();

    // Get the review box element
    const reviewBox = document.getElementById("review-box");
    reviewBox.innerHTML = ""; // Clear existing reviews

    // Display the reviews
    reviews.forEach((review) => {
      const reviewElement = document.createElement("div");
      reviewElement.className = "review";
      reviewElement.textContent = review.review_text;
      reviewBox.appendChild(reviewElement);
    });
  } catch (error) {
    // Handle errors (network issues, JSON parsing, etc.)
    console.error("Error fetching reviews:", error);
    alert("Failed to fetch reviews. Please try again later.");
  }
}


function rsvpEvent(event) {
  // Check if the RSVP modal element already exists
  const modal = document.getElementById("rsvp-modal");
  if (!modal) {
    // Create the modal element if it doesn't exist
    const modalElement = document.createElement("div");
    modalElement.id = "rsvp-modal";
    modalElement.classList.add("modal"); // Add the "modal" class for styling

    // Set the modal content (HTML structure)
    modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>RSVP for ${event.name}</h3>
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

    // Append the modal element to the body
    document.body.appendChild(modalElement);

    // Add click event listener for the close button (X)
    document
      .querySelector(".close")
      .addEventListener("click", () => (modalElement.style.display = "none"));

    // Add submit event listener for the RSVP form
    document.getElementById("rsvp-form").addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent default form submission behavior

      // Get the user's RSVP details
      const attendance = document.getElementById("attendance").value;
      const attendeesCount = document.getElementById("attendees").value;
      const comments = document.getElementById("comments").value;

      // Log the RSVP details to the console
      console.log(`RSVP for event: ${event.name}`);
      console.log(`Attendance: ${attendance}`);
      console.log(`Number of people: ${attendeesCount}`);
      console.log(`Comments: ${comments}`);

      // Hide the modal after submission
      modalElement.style.display = "none";
    });
  }

  // If the modal already exists, just show it
  modal.style.display = "block"; // Display the modal element
}
