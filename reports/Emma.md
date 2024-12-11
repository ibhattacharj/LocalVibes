## October 18, 2024

1: Created and pushed ui-diagrams.md, the markdown file for the UI diagrams of our project.
2: Took notes during our group's meeting on Sunday, October 20th.
3: Helped with wireframing the frontend

# Milestone 3
## November 17, 2024

### Event Creation Form
- Designed and implemented a form with the following fields:
  - **Event Name**: Required text field for the event's title.
  - **Description**: Required text area for event details.
  - **Location**: Required text field for the event venue.
  - **Tags**: Optional text field for event categories or genres.
  - **Date and Time**: Required date-time picker for scheduling the event.
  - **Image Upload**: Optional file input for uploading a flyer or poster.
- Ensured proper validation for required fields and implemented a user-friendly layout.

### Dynamic Styles
- Updated CSS to ensure the Event Creation Form is responsive and consistent with the application's design.


### Image Upload Feature
- Integrated a file input field for uploading event images, enhancing the event creation process.


### Git Workflow
- Followed proper git practices:
  - Created and worked on a dedicated branch for the Event Creation Form.
  - Committed changes with descriptive messages.
  - Prepared for a pull request to merge the changes into the main branch.

### Mermaid Diagram
- Created a Mermaid sequence diagram to illustrate the interaction flow for the Event Creation Form:

# Milestone 4
## Back-End Architecture & Database Integration
- Ensured proper handling of data retrieval, creation, and updates with full CRUD operations.

## Image Upload & Serving
- Integrated Multer for image uploads, allowing event creators to attach images.
- Configured a static /uploads route to serve event images directly.
- Stored uploaded file paths in the database and displayed images dynamically on the front-end.

## Connected eventCreationForm details to backend
- Connected the form to the back-end /events POST route using fetch, sending data and images as FormData.
