const tags = document.querySelectorAll(".tag");

tags.forEach((tag) => {
  tag.addEventListener("click", () => {
    const genre = tag.getAttribute("data-genre");

    tags.forEach((t) => t.classList.remove("active"));
    tag.classList.add("active");

    fetch(
      `http://127.0.0.1:4000/events/search?genre=${encodeURIComponent(genre)}`
    ) //fetch events filtered by selected tag
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((events) => {
        const eventsContainer = document.querySelector(".events");
        eventsContainer.innerHTML = ""; //clear existing events

        events.forEach((event) => {
          const eventElement = document.createElement("div");
          eventElement.classList.add("event");
          eventElement.textContent = event.name;
          eventsContainer.appendChild(eventElement);
        });
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  });
});
