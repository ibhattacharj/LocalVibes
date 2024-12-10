document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("open-event-form");
  const modal = document.getElementById("event-form-modal");
  const closeButton = modal.querySelector(".close-button");
  const loadingIndicator = document.getElementById("loading-indicator");

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

      // Validate input fields
      if (
        !eventName ||
        !eventDescription ||
        !eventLocation ||
        !eventTime ||
        !eventImage
      ) {
        alert("Please fill out all required fields and upload an image.");
        return;
      }

      // Create a FormData object
      const formData = new FormData();
      formData.append("eventName", eventName);
      formData.append("eventDescription", eventDescription);
      formData.append("eventLocation", eventLocation);
      formData.append("eventTags", eventTags);
      formData.append("eventTime", eventTime);
      formData.append("eventImage", eventImage); // Append the file

      // Show loading indicator
      loadingIndicator.style.display = "block";

      // Send formData to the server
      fetch("http://127.0.0.1:4000/events", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          loadingIndicator.style.display = "none"; // Hide the loading indicator
          if (!response.ok) {
            throw new Error("Failed to create event");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Event created successfully:", data);
          alert("Event created successfully!");

          // Clear the form and close the modal
          document.getElementById("create-event-form").reset();
          modal.style.display = "none";
        })
        .catch((error) => {
          loadingIndicator.style.display = "none"; // Hide the loading indicator
          console.error("Error creating event:", error);
          alert("Failed to create event. Please try again.");
        });
    });
});