graph TD
    A[User Interface] -->|Clicks Home Icon| B[Home Page (index.html)]
    A -->|Clicks Profile Icon| C[Profile Page (profile.html)]

    subgraph Navbar
        D[Home Icon] --> B
        E[Profile Icon] --> C
    end

    subgraph Home Page (index.html)
        F[Event Search Section]
        F --> G[Search Bar]
        F --> H[Filters: Genre, Location, Venue Type]
        F --> I[Interactive Map Section]
        J[Popular Events Section] -->|Scroll Buttons| K[Horizontal Scroll for Popular Events]
        L[Events For You Section] -->|Scroll Buttons| M[Horizontal Scroll for Personalized Events]
    end

    subgraph Profile Page (profile.html)
        N[Profile Header: "Welcome, [User Name]!"]
        N --> O[Tags Section: Tags like Rock, Jazz, etc.]
        P[Interested Events Section] -->|Dynamic Events| Q[Horizontal Scroll for Interested Events]
        R[Upcoming Events Section] -->|Dynamic Events| S[Horizontal Scroll for Upcoming Events]
        T[Past Events Section] -->|Dynamic Events| U[Horizontal Scroll for Past Events]
        V[Create Event Button]
    end

    subgraph Styling (CSS)
        W[main.css]
        W --> Navbar
        W --> Home Page
        W --> Profile Page
    end

    subgraph Scripts (JS)
        X[fakeData.js]
        X -->|Dynamic Event Data| Home Page
        X -->|Dynamic Event Data| Profile Page
        Y[main.js]
        Y -->|Scroll Functionality| J
        Y -->|Scroll Functionality| L
    end