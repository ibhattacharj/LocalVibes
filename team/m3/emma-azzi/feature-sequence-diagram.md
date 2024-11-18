## Event Creation Form

### Description
The Event Creation Form allows users to create new events by filling in key details. Below is the workflow:

1. **Opening the Form**:
   - The user initiates the process by navigating to the Event Creation Form (e.g., by clicking a "Create Event" button).

2. **Form Display**:
   - The browser displays a form with the following input fields:
     - **Event Name**: A required text field for the event's title.
     - **Description**: A required text area for event details.
     - **Location**: A required text field for the event venue.
     - **Tags**: An optional text field to specify event categories or genres.
     - **Date and Time**: A required date-time picker to schedule the event.
     - **Image Upload**: An optional file input for uploading a flyer or poster.

3. **User Interaction**:
   - The user fills out the form fields and clicks the **Submit** button to proceed.

4. **Validation**:
   - The browser checks the form inputs:
     - Ensures all required fields are filled.
     - Verifies that the date and time are valid.
     - Optionally validates the uploaded image format.

5. **System Response**:
   - If all inputs are valid:
     - The form submission is successful, and a **success message** is displayed to the user.
   - If any inputs are invalid:
     - The browser displays **error messages** prompting the user to correct the issues.

---

### Mermaid Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser

    User->>Browser: Open Event Creation Form
    Browser->>User: Display Form Fields (Event Name, Description, Location, Tags, Date and Time, Image Upload)
    User->>Browser: Fill out fields
    User->>Browser: Click "Submit"
    Browser->>Browser: Validate Inputs
    alt Inputs are valid
        Browser->>User: Show success message
    else Inputs are invalid
        Browser->>User: Show error messages
    end
