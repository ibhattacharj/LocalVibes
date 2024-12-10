
document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("open-event-form");
  const modal = document.getElementById("event-form-modal");
  const closeButton = modal.querySelector(".close-button");

  // Open the modal
  openButton.addEventListener("click", () => {
    modal.style.display = "flex";
    const form = document.getElementById("create-event-form");
    form.reset(); // Clear the form
    form.removeAttribute("data-event-id"); // Remove event ID for new event
  });

  // Close the modal
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle form submission
  document
    .getElementById("create-event-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default behavior


      // this logic has been edited to determine whether to create or update event

      const form = event.target;
      const eventId  = form.getAttribute("data-event-id");

      const url = eventId ? `http://127.0.0.1:4000/events/${eventId}`: 'http://127.0.0.1:4000/events';
      const method = eventId? 'PUT' : 'POST';


      // Get form values
      const eventName = document.getElementById("event-name").value;
      const eventDescription = document.getElementById("event-description").value;
      const eventLocation = document.getElementById("event-location").value;
      const eventTags = document
        .getElementById("event-tags")
        .value.split(",")
        .map((tag) => tag.trim());
      const eventTime = document.getElementById("event-time").value;
      const eventImage = document.getElementById("event-image").files[0]; // Get the uploaded file

      // Create a FormData object
      const formData = new FormData();
      formData.append("name", eventName);
      formData.append("description", eventDescription);
      formData.append("location", eventLocation);
      formData.append("tags", eventTags);
      formData.append("time", eventTime);
      if (eventImage) {
        formData.append("image", eventImage); // Append the file if it exists
      }
    //   // Log the form data for testing
    //   console.log("Form Data:");
    //   for (let [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    //   }

    //   // TODO: Send formData to a server using fetch or AJAX
    //   alert("Event created successfully! (Check console for form data)");

    //   // Clear the form and close the modal
    //   document.getElementById("create-event-form").reset();
    //   modal.style.display = "none";
    // });

    // for debugging
    console.log("Submitting FormData:");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }


    // submit form to the server
    fetch(url, {
      method: method,
      body: formData,
  })
      .then((response) => {
          if (!response.ok) {
              throw new Error(`Failed to ${eventId ? 'update' : 'create'} event: ${response.statusText}`);
          }
          return response.json();
      })
      .then((data) => {
        alert(`Event ${eventId ? "updated" : "created"} successfully!`);
        // Clear the form and close the modal
        modal.style.display = "none";
        form.reset();
        form.removeAttribute("data-event-id"); // Clear event ID for new events
    })
    .catch((error) => {
      console.error("Error submitting form:", error);
      alert(`Failed to ${eventId ? "update" : "create"} event. Please try again.`);
    });
    });
  });


 export function openEventForm(eventId) {
  const modal = document.getElementById('event-form-modal');
  modal.style.display = 'flex'; 

  // Fetch event details from the server
  fetch(`http://127.0.0.1:4000/events/${eventId}`)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`Failed to fetch event: ${response.statusText}`);
          }
          return response.json();
      })
      .then((event) => {
          // Populate the form with the fetched event details
          document.getElementById('event-name').value = event.name;
          document.getElementById('event-description').value = event.description;
          document.getElementById('event-location').value = event.location;
          document.getElementById('event-tags').value = event.tags;
          document.getElementById('event-time').value = new Date(event.time).toISOString().slice(0, 16);

           // Set the data-event-id attribute on the form
           const form = document.getElementById('create-event-form');
           form.setAttribute('data-event-id', event.id); 
      })
      .catch((error) => console.error('Error fetching event data:', error));
}
