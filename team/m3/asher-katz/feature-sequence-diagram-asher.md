sequenceDiagram
    participant User
    participant HomeIcon
    participant ProfileIcon
    participant HomePage
    participant ProfilePage
    participant Navbar
    participant EventSearch
    participant PopularEvents
    participant EventsForYou
    participant ProfileHeader
    participant TagsSection
    participant InterestedEvents
    participant UpcomingEvents
    participant PastEvents
    participant CreateEventButton
    participant CSS
    participant JS

    User->>HomeIcon: Clicks Home Icon
    HomeIcon->>HomePage: Navigate to index.html
    User->>ProfileIcon: Clicks Profile Icon
    ProfileIcon->>ProfilePage: Navigate to profile.html

    HomePage->>EventSearch: Displays Search Bar, Filters, and Interactive Map
    EventSearch->>CSS: Apply styles from main.css
    EventSearch->>JS: Add dynamic event data via fakeData.js
    HomePage->>PopularEvents: Displays popular events with scroll functionality
    HomePage->>EventsForYou: Displays personalized events with scroll functionality

    ProfilePage->>ProfileHeader: Displays "Welcome, [User Name]!"
    ProfileHeader->>CSS: Apply styles from main.css
    ProfilePage->>TagsSection: Displays user tags like Rock, Jazz, etc.
    TagsSection->>CSS: Apply styles from main.css
    ProfilePage->>InterestedEvents: Displays dynamic interested events
    InterestedEvents->>JS: Add dynamic event data via fakeData.js
    ProfilePage->>UpcomingEvents: Displays dynamic upcoming events
    UpcomingEvents->>JS: Add dynamic event data via fakeData.js
    ProfilePage->>PastEvents: Displays dynamic past events
    PastEvents->>JS: Add dynamic event data via fakeData.js
    ProfilePage->>CreateEventButton: Displays "Create Event" button
    CreateEventButton->>CSS: Apply styles from main.css
