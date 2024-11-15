```mermaid
sequenceDiagram
    participant User
    participant SearchBar
    participant LocalStorage
    participant MainJS
    participant SearchResults
    participant PopularEvents
    participant EventsForYou
    participant Map

    User->>SearchBar: Types in search term
    SearchBar->>MainJS: input event with search term
    MainJS->>LocalStorage: setItem("search", searchTerm)
    MainJS->>MainJS: updateState(searchTerm)
    alt searchTerm is not empty
        MainJS->>PopularEvents: style.display = 'none'
        MainJS->>EventsForYou: style.display = 'none'
        MainJS->>SearchResults: style.display = 'block'
        MainJS->>Map: style.display = 'block'
        MainJS->>allEvents: filter(event => event.title.includes(searchTerm))
        loop for each filtered event
            MainJS->>SearchResults: appendChild(event.element)
        end
        alt no filtered events
            MainJS->>SearchResults: appendChild("No events found")
        end
    else searchTerm is empty
        MainJS->>SearchResults: style.display = 'none'
        MainJS->>Map: style.display = 'none'
        MainJS->>PopularEvents: style.display = 'block'
        MainJS->>EventsForYou: style.display = 'block'
    end
    activate MainJS
    MainJS->>LocalStorage: getItem("search")
    deactivate MainJS
    LocalStorage-->>MainJS: stored search term (can be null)
    MainJS->>MainJS: updateState(stored search term)
