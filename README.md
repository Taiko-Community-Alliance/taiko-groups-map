# Taiko Groups Map
This project hosts the code and data used in the Taiko Groups map as seen on https://www.taikosource.org/.
It uses data collected by the Taiko Community Alliance from user submisssions and various sources.

## Libraries Used
 - [Leaflet.js](https://github.com/Leaflet/Leaflet)
 - [Leaflet Map Clustering](https://github.com/Leaflet/Leaflet.markercluster)
 - [Leaflet SidePanel](https://github.com/cyclingbyte/Leaflet.SidePanel)
 - [Leaflet RepeatedMarkers](https://gitlab.com/IvanSanchez/Leaflet.RepeatedMarkers) (nice to have, but not required)

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
            GSR["Submissions Sheet"] -- Cleanup --> GSP["Final Public Sheet"]
        end
    end
    GSP --> PARSE
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
