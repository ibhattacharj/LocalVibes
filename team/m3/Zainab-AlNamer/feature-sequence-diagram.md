## Add/ remove description:
The "Add/Remove" button enables users to manage their interest in events. When a user clicks "Add," the event is added to their "Interested In" section in the profile, and the button label changes to "Remove." Clicking "Remove" removes the event from their "Interested In" section, and the button reverts to "Add."

## Mermaid Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant DOM
    participant Profile

    User->>Browser: Click "Add" button
    Browser->>DOM: Update button label to "Remove"
    Browser->>Profile: Add event to "Interested In" section

    User->>Browser: Click "Remove" button
    Browser->>DOM: Update button label to "Add"
    Browser->>Profile: Remove event from "Interested In" section
