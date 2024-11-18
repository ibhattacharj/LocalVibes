```mermaid
sequenceDiagram
    participant User
    participant Database
    participant loginHTML
    participant signupHTML
    participant Profiles
    participant EventsForYou
    participant HomePage

    User->>loginHTML: Loads Webpage (login.html)
    loginHTML->>signupHTML: Loads register webpage (signup.html)
    User->>signupHTML: User fills out required input fields to register a new account
    signupHTML->>loginHTML: Prompts user to login page (login.html) after registering a new account
    loginHTML->>Database: Search through database to validate login credentials
    loginHTML->>HomePage: Once credentials are validated, user is brought to HomePage (index.html)
    loginHTML->>Profiles: User information is gathered to access profile page (profile.html)
    loginHTML->>EventsForYou: User information is gathered to generate EventsForYou (index.html)
    User->>UI: Clicks on Event Card