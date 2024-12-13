const tags = document.querySelectorAll('.tag'); //get all elements with 'tag' class

//add click event listener to each tag
tags.forEach(tag => {
  tag.addEventListener('click', () => {
    const genre = tag.getAttribute('data-genre'); //retrieve genre data from the clicked tag

    //remove 'active' class from all tags, then add it to the clicked tag
    tags.forEach(t => t.classList.remove('active'));
    tag.classList.add('active');

    //fetch events filtered by the selected tag's genre
    fetch(`http://127.0.0.1:4000/events/search?genre=${encodeURIComponent(genre)}`) 
      .then(response => {
        if (!response.ok) { //check if response is okay
          throw new Error('Failed to fetch events'); 
        }
        return response.json(); //parse the response to JSON
      })
      .then(events => {
        const eventsContainer = document.querySelector('.events'); //get container for events
        eventsContainer.innerHTML = ''; //clear any existing events in container

        //create a new element for each event and append it to container
        events.forEach(event => {
          const eventElement = document.createElement('div'); //create a div for event
          eventElement.classList.add('event'); //add 'event' class
          eventElement.textContent = event.name; //set text content to event's name
          eventsContainer.appendChild(eventElement); //add event div to the container
        });
      })
      .catch(error => { 
        console.error('Error fetching events:', error); //log errors
      });
  });
});
