# Data Model for Local Music Scene Web App

## 1. Event Listings
- **Event ID:** Unique identifier for each event.
- **Event Name:** Name of the event.
- **Genre:** Musical genre associated with the event (e.g., Rock, Jazz, Indie, Hip-Hop).
- **Location:** Details of the venue or location (address, coordinates). Can use Google Maps Geocoding API to convert addresses to coordinates.
- **Event Date & Time:** Scheduled date and time of the event.
- **Event Description:** Brief description of the event.
- **Ticket Information:** Price, purchasing options, and availability.
- **Artists/Bands Performing:** List of artists or bands performing.
- **RSVP Status:** Count of attendees, RSVPs, and interest shown.

## 2. Artist Profiles
- **Artist/Band ID:** Unique identifier for each artist or band.
- **Artist/Band Name:** Name of the artist or band.
- **Bio:** Artist/band biography or description.
- **Genre:** Primary genre or genres of the artist.
- **Media Links:** Embedded music links. Integrate with Spotify API, Apple Music API, or SoundCloud API. 
- **Upcoming Events:** List of upcoming performances and shows.
- **Merchandise:** Information about available merchandise (items, prices).
- **Donation Link:** Option to donate to the artist directly.

## 3. Event Map (Implement map functionality using Google Maps JavaScript API)
- **Location ID:** Unique identifier for each event location.
- **Venue Name:** Name of the venue (if applicable).
- **Address:** Full address of the venue.
- **Coordinates:** Geographic coordinates for map plotting.
- **Venue Type:** Type of venue (e.g., Bar, Library, House Party, Theater).
- **Events at Venue:** List of events happening at this location.

## 4. User Profiles
- **User ID:** Unique identifier for each user.
- **User Name:** Display name of the user.
- **Email:** User's email address.
- **Preferences:** Genres or artists that a user prefers.
- **Attendance History:** List of past attended events.
- **Saved Events:** Events the user has saved or marked as interested.
- **Uploaded Content:** Photos, reviews, and ratings submitted by the user.
- **User Playlist:** Personalized playlist based on local talent and previous preferences.

## 5. Collaborative Gig Scheduling
- **Artist Collaboration ID:** Unique identifier for collaboration schedules.
- **Artists Involved:** List of artists collaborating for the gig.
- **Event Name:** Name of the event being planned.
- **Event Date & Time:** Scheduled date and time for the joint performance.
- **Communication:** Messages and scheduling notes between the collaborating artists.

## 6. Fan-Generated Content
- **Content ID:** Unique identifier for each piece of fan-generated content.
- **Event ID:** The event to which the content is related.
- **User ID:** The user who submitted the content.
- **Content Type:** Type of content (e.g., Photos, Reviews, Comments).
- **Description:** A brief description of the content.
- **Upload Date:** Date when the content was uploaded.

## 7. Music Networking
- **Connection ID:** Unique identifier for each networking connection.
- **User ID:** User initiating the connection.
- **Connected User ID:** User or artist being connected with.
- **Connection Type:** Type of connection (e.g., Artist-Fan, Artist-Artist, Promoter-Artist).
- **Messages:** Messages exchanged between connected users.

## 8. Event Livestreams
- **Livestream ID:** Unique identifier for each livestream.
- **Event ID:** The event that is being livestreamed.
- **Livestream URL:** URL link to access the live stream.
- **Livestream Schedule:** Date and time when the stream is live.

## 9. Venue Registration
- **Venue Registration ID:** Unique identifier for each venue registration.
- **User ID:** The user suggesting the venue.
- **Venue Name:** Name of the venue being suggested.
- **Venue Address:** Address of the venue being suggested.
- **Venue Description:** Brief description of the venue.

## 10. Playlists
- **Playlist ID:** Unique identifier for each playlist.
- **Playlist Name:** Name of the playlist.
- **Curator ID:** ID of the user or admin who created the playlist.
- **Playlist Tracks:** List of tracks included in the playlist.
- **Linked Artist Profiles:** Profiles of artists whose tracks are in the playlist.

## 11. Analytics & Insights
- **Event Analytics ID:** Unique identifier for each set of event analytics.
- **Event ID:** The event for which analytics are recorded.
- **Attendance Count:** Number of people attending the event.
- **RSVP Trends:** Insights on RSVPs and trends over time.
- **Genre Popularity:** Insights on genre popularity based on user interaction and event attendance.
- **Artist Performance Metrics:** Metrics on artist performance at events.

## 12. Newsletters & Updates
- **Newsletter ID:** Unique identifier for each newsletter.
- **Newsletter Content:** Details of the content covered in the newsletter.
- **Distribution Date:** Date when the newsletter is distributed.
- **Subscribers:** List of users subscribed to the newsletter.

## 13. Donation & Merchandise Transactions (can use Stripe, Paypal, or Venmo links)
- **Transaction ID:** Unique identifier for each transaction.
- **User ID:** The user making the transaction.
- **Artist ID:** The artist receiving the donation or purchase.
- **Transaction Type:** Type of transaction (e.g., Donation, Merchandise Purchase).
- **Amount:** Amount of the transaction.

## 14. Social Sharing & RSVPs (can integrate with Facebook/Instagram API)
- **Share ID:** Unique identifier for each shared event.
- **User ID:** The user sharing the event.
- **Event ID:** The event being shared.
- **Shared Platform:** Social media platforms where the event is shared.
- **RSVP Status:** Status of the RSVP for the event.
