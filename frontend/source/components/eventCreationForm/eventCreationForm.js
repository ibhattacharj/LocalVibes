document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("open-event-form");
  const modal = document.getElementById("event-form-modal");
  const closeButton = modal.querySelector(".close-button");
  const createEventForm = document.getElementById("create-event-form");

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
  createEventForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default behavior

    // Get form values
    const eventName = document.getElementById("event-name").value.trim();
    const eventDescription = document
      .getElementById("event-description")
      .value.trim();
    const eventLocation = document
      .getElementById("event-location")
      .value.trim();
    const eventTags = document
      .getElementById("event-tags")
      .value.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    const eventTime = document.getElementById("event-time").value;
    const eventImage = document.getElementById("event-image").files[0];

    // Prepare the data to send as FormData
    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventDescription", eventDescription);
    formData.append("eventLocation", eventLocation);
    // Append each tag individually (Multer/Express will receive them as an array if handled correctly)
    eventTags.forEach((tag) => formData.append("eventTags", tag));
    formData.append("eventTime", eventTime);

    if (eventImage) {
      formData.append("eventImage", eventImage);
    }

    try {
      const response = await fetch("http://127.0.0.1:4000/events", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newEvent = await response.json();
        console.log("Event created successfully:", newEvent);
        alert("Event created successfully!");

        // Clear the form and close the modal
        createEventForm.reset();
        modal.style.display = "none";
      } else {
        const errorText = await response.text();
        console.error("Error creating event:", errorText);
        alert("Failed to create event. Check the console for errors.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Check the console for details.");
    }
  });
});
