import 'leaflet.sidepanel';
import 'leaflet.sidepanel/dist/leaflet.sidepanel.css';
import { createApp, ref, computed, reactive, watch } from 'vue/dist/vue.esm-bundler.js';
import L from 'leaflet';
import { haversine } from './util.js';

export const createSideBar = (map, points) => {
  L.control.sidepanel('side-panel', {
    panelPosition: 'left',
    startTab: 'tab-1'
  }).addTo(map);

  // Determine the earliest and latest years for the year filter
  const years = points.map(({yearest}) => yearest).filter(Boolean).sort();
  const yearMax = years.pop();
  const yearMin = years.shift();

  const pointsJoinedData = new Map();

  points.forEach((point) => {
    pointsJoinedData.set(point, {
      searchableText: [
        point.name,
        point.city,
        point.state,
        point.country,
        point.region
      ].join(" ").toLowerCase()
    });
  });

  const emitter = new EventTarget();

  const SidePanelApp = {
    template: `
      <div class="sidebar-app-container">
        <h2>Filters</h2>
        <div class="search-filters">
          <input v-model="filterStr" placeholder="Search..." class="search-input" />
          <p v-if="yearFilter == ${yearMax + 1}">Established date: All groups</p><p v-else>Established date: between ${yearMin} and {{ yearFilter }}</p>
          <input id="year-filter" name="year-filter" type="range" min="${yearMin}" max="${yearMax + 1}" step="1" v-model.number="yearFilter" />
          </div>
        <h2>Results ({{ visiblePoints.length }})</h2>
        <p v-if="invisibleMatches > 0">(<a href="javascript:void(0)" @click="emitZoomInvisible">{{ invisibleMatches }} matching group<span v-if="invisibleMatches > 1">s</span></a> are hidden from view)</p>
        <div class="sidebar-list">
          <div
            v-for="point in visiblePoints"
            :key="point.index"
            class="point-entry"
            :class="[{ active: point.active, matchesFilter: point.matchesFilter }, point.regionInternalName]"
          >
            <h3 class="point-name-action" @click="emitVisit(point)">{{ point.name }}</h3>
            <p v-if="point.yearest">Est. {{ point.yearest }}</p>
            <p>{{ [[point.city, point.state].filter(Boolean).join(' '), point.country].filter(Boolean).join(', ') }}<span v-if="point.region"> ({{ point.region }})</span></p>
            <p v-if="point.website">
              <a :href="point.website" target="_blank">{{ point.website }}</a>
            </p>
          </div>
          <p v-if="visiblePoints.length == 0 && invisibleMatches == 0">No matching groups found.</p>
        </div>
      </div>
    `,
    setup() {
      const filterStr = ref('');
      const yearFilter = ref(yearMax + 1);
      const emitVisit = (point) => {
        emitter.dispatchEvent(new CustomEvent('visit', { detail: { point: points.find(p => p.index === point.index) } }));
      };

      const emitZoomInvisible = () => {
        emitter.dispatchEvent(new CustomEvent('zoom-to-points', { detail: { points: searchSortedFilteredPoints.value.map(({index}) => points.find((p) => p.index === index)) } }));
      }

      const matchedFilter = computed(() => {
        const f = filterStr.value.toLowerCase().trim();
        return points.filter(p => {
          if(p.yearest > yearFilter.value) return false;
          if(!p.yearest && yearFilter.value !== yearMax + 1) return false;
          if(f && !pointsJoinedData.get(p).searchableText.includes(f)) return false;
          return true;
        }); 
      });
      const searchSortedFilteredPoints = computed(() => {
        return matchedFilter.value
          .map(p => {
            return {
              ...p,
              distanceFromCenter: haversine(map.getCenter().lat, map.getCenter().lng, p.latitude, p.longitude),
              matchesFilter: true,
            };
          })
          .sort((a, b) => {
            if(b.matchesFilter !== a.matchesFilter) return b.matchesFilter - a.matchesFilter;
            if(b.active !== a.active) {
              return b.active - a.active;
            } else if(b.active) {
              // Both are active
              return a.name.localeCompare(b.name);
            } else {
              // both are inactive
              return Math.sign(a.distanceFromCenter - b.distanceFromCenter);
            }
          });
      });
      const visiblePoints = computed(() => {
        return searchSortedFilteredPoints.value
          .filter(p => p.visible || p.active)
      });

      const invisibleMatches = computed(() => {
        return searchSortedFilteredPoints.value.filter(point => !visiblePoints.value.includes(point)).length;
      });
  
      const center = reactive({
        latitude: map.getCenter().lat,
        longitude: L.Util.wrapNum(map.getCenter().lng, [0, 360], true)
      });

      watch(matchedFilter, (newValue, oldValue) => {
        emitter.dispatchEvent(new CustomEvent('visible-points', {
          detail: {
            points: points
              .filter(p => 
                newValue.find(({index}) => index === p.index)
              )
          }
        }));
      });

      return {
        points,
        filterStr,
        yearFilter,
        visiblePoints,
        center,
        emitVisit,
        emitZoomInvisible,
        invisibleMatches
      };
    }
  };
  
  if (window.innerWidth >= 1024) { // assuming desktop is width >= 1024px
    const panel = document.getElementById('side-panel');
    if (!L.DomUtil.hasClass(panel, 'opened')) {
      L.DomUtil.addClass(panel, 'opened');
      L.DomUtil.removeClass(panel, 'closed');
    }
  }

  const app = createApp(SidePanelApp);
  const vm = app.mount('#vue-sidepanel-app');
  vm.$events = emitter;
  return vm;
}