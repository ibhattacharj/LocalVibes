## RSVP Feature Description
The RSVP feature enables users to indicate their interest in attending an event. When a user clicks the "RSVP" button, a modal window appears, presenting a form to fill out details such as attendance confirmation, number of attendees, and additional comments. Upon form submission, the user's inputs are logged, and the modal is closed.

## Mermaid Diagram
```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant DOM
    participant Console
    
    User->>Browser: Click "RSVP" button
    Browser->>DOM: Check if "rsvp-modal" exists
    alt Modal does not exist
        DOM->>DOM: Create modal element
        DOM->>Browser: Add modal to the DOM
    end
    Browser->>DOM: Display modal
    User->>Browser: Fill out RSVP form and click "Submit RSVP"
    Browser->>DOM: Capture form inputs
    DOM->>Console: Log attendance details
    Browser->>DOM: Close modal
