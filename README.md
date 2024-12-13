# LocalVibes

LocalVibes is a web application designed to connect users with live music events in their area. Users can browse popular events, search for specific genres or locations, and create their own events to share with the community

## Features
- **Browse Popular Events**: View the top-rated events based on user engagement.
- **Personalized Recommendations**: Get event suggestions tailored to your preferences.
- **Create and Manage Events**: Users can create events, upload flyers, and manage their listings.
- **Search Events**: Search by genre, location, or keywords.
- **Interactive Map**: Explore events using a dynamic map interface.

---

## Installation

Follow these steps to set up and run the project locally:

### 1. Clone the Repository
- git clone (https://github.com/ibhattacharj/LocalVibes.git)
- cd LocalVibes

### 2. Backend Setup
- Navigate to the backend directory: cd backend
- Install dependencies: npm install
- Start the server: node server.js

### Frontend Setup
- Navigate to the frontend directory
- Open source/index.html in your browser to see the home page
- To test Google authenication open source/components/login/login.html in your browser to see the home page


## Issues that we ran into

### 1. We only implemented authentication with Google, and it only works for 1/7 group members. Hence, not able to have smooth from login to home page; home page access (without login) works for everyone

### 2. Event creation form doesn't add creation to database; profiles weren't completely implemented as well. Thus, components of the event page that depended on these weren't able to be done.

### 3. We couldn't get the interactive map to work for specific events when clicked on.

---

## Demo Link

### https://drive.google.com/file/d/1cxx-WYukdRXR7-smTN5WfVNSleciR8et/view?usp=sharing