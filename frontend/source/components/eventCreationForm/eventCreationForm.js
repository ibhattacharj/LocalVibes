
document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("open-event-form");
  const modal = document.getElementById("event-form-modal");
  const closeButton = modal.querySelector(".close-button");

  // Open the modal
  openButton.addEventListener("click", () => {
    modal.style.display = "flex";
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

      // Get form values
      const eventName = document.getElementById("event-name").value;
      const eventDescription =
        document.getElementById("event-description").value;
      const eventLocation = document.getElementById("event-location").value;
      const eventTags = document
        .getElementById("event-tags")
        .value.split(",")
        .map((tag) => tag.trim());
      const eventTime = document.getElementById("event-time").value;
      const eventImage = document.getElementById("event-image").files[0]; // Get the uploaded file

      // Create a FormData object
      const formData = new FormData();
      formData.append("eventName", eventName);
      formData.append("eventDescription", eventDescription);
      formData.append("eventLocation", eventLocation);
      formData.append("eventTags", eventTags);
      formData.append("eventTime", eventTime);
      formData.append("eventImage", eventImage); // Append the file

      // Log the form data for testing
      console.log("Form Data:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // TODO: Send formData to a server using fetch or AJAX
      alert("Event created successfully! (Check console for form data)");

      // Clear the form and close the modal
      document.getElementById("create-event-form").reset();
      modal.style.display = "none";
    });
});

// this pre fills the form with the event data from the database
document.addEventListener("DOMContentLoaded", () => {
  const urlParam = new URLSearchParams(window.location.search);
  const eventId = urlParam.get("eventId");

  if (eventId) {
    fetch(`https://127.0.0.1:4000/events/${eventId}`)
     .then(response => response.json())
     .then(event =>  {
       // fill the form with the event data
       document.getElementById("event-name").value = event.name;
       document.getElementById("event-description").value = event.description;
       document.getElementById("event-location").value = event.location;
       document.getElementById("event-tags").value = event.tags.split(',').map(tag => tag.trim()).join(', ');
       document.getElementById("event-time").value = new Date(event.time).toISOString().slice(0, 16);
       
       const imageInput = document.getElementById("event-image");
        if (imageInput && event.image) {
          const imgPreview = document.createElement("img");
          imgPreview.src = `data:image/jpeg;base64,${event.image}`;
          imgPreview.alt = "Event Image Preview";
          imgPreview.style.maxWidth = "100px";
          imageInput.insertAdjacentElement("beforebegin", imgPreview);
        }
      })
      .catch((error) => console.error("Error fetching event data:", error));
    }
});