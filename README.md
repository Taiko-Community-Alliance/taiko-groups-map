# Taiko Groups Map
This project hosts the code and data used in the Taiko Groups map as seen on https://www.taikosource.org/.
It uses data collected by the Taiko Community Alliance from user submisssions and various sources.

## Looking to Update or Add Data?
The groups that are shown on this map are managed by Taiko Community Alliance volunteers. If you want to add your group or update your group's information, just fill out this form here: https://docs.google.com/forms/d/e/1FAIpQLSesYmefC6XYIYyQ-JqY4bUnQvMnHF84CCZqWgH9OGmEOEz3LA/viewform

## Libraries Used
 - [Leaflet.js](https://github.com/Leaflet/Leaflet)
 - [Leaflet Map Clustering](https://github.com/Leaflet/Leaflet.markercluster)
 - [Leaflet SidePanel](https://github.com/cyclingbyte/Leaflet.SidePanel)

## Build Workflow and Hosting
The following flow chart outlines how the Taiko Groups Map is generated, built, and hosted on Taiko Source.

```mermaid
---
config:
  theme: neutral
---
flowchart BT
    subgraph GL["Google"]
        GF["Google Forms"] -- User Submit --> GSR
        subgraph GS["Google Sheet"]
            GEO["Lat/Long Lookup"] -- Apps Script --> GSP
            GSR["Submissions Sheet"] -- Cleanup --> GSP["Final Public Sheet"]
        end
    end
    GSP -- fetch --> PARSE
    subgraph GH["Github"]
        subgraph GHR["Taiko Groups Repository"]
            subgraph SRC["src"]
                PARSE["Google Sheets Fetch/Parse"]
            end
            subgraph ST["Static Assets"]
                GHJSONST["Map JSON"]
                HTML
                JS
            end
            SRC -- Build --> ST
        end
        ST --> GHP
        subgraph GHP["Taiko Groups Page"]
            WEBPAGE["taiko-community-alliance.github.io/taiko-groups-map/"]
        end
    end
    GHP -- iframe --> TGPAGE
    subgraph TS["Taiko Source"]
        TGPAGE["Taiko Groups Page"]
    end
```

## TODO

### Nice to Have
 
 - [x] Include group website
 - [x] Search-able
 - [x] Improve styles/UX for side panel
 - [x] Custom Map Markers
 - [x] Work out UI bugs with sidepanel/clicking
 - [ ] Show groups out of view at the bottom of list
 - [ ] Include group contact info
 - [ ] Regional markers/colors
 - [ ] Images from groups? Logos or photos?
 - [ ] Include group estaablished years
