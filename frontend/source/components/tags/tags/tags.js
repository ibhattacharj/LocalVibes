const tags = document.querySelectorAll('.tag');
const appEvents = document.querySelectorAll('.event');

tags.forEach(tag => {
    tag.addEventListener('click', () => {
        const genre = tag.getAttribute('data-genre');
        
        tags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');

        // Filter songs based on the genre
        appEvent.forEach(event => {
            if (event.getAttribute('data-genre') === genre || genre === "all") {
                event.classList.remove('hidden');
            } else {
                event.classList.add('hidden');
            }
        });
    });
});