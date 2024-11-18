```mermaid
sequenceDiagram
    participant User
    participant HTML
    participant FakeDataJS
    participant UI

    User->>HTML: Loads Webpage (index.html)
    HTML->>FakeDataJS: Execute `fakeData.js` Script
    FakeDataJS->>FakeDataJS: Generate Fake Events using Faker.js
    FakeDataJS->>HTML: Add Event Cards to "Popular Events" Section
    FakeDataJS->>HTML: Add Event Cards to "Events for You" Section
    HTML->>UI: Update UI with Event Cards

    User->>UI: Clicks on Event Card