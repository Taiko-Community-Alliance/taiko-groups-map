import 'leaflet.sidepanel';
import 'leaflet.sidepanel/dist/leaflet.sidepanel.css';
import { createApp, ref, computed, reactive } from 'vue/dist/vue.esm-bundler.js';
import L from 'leaflet';
import { haversine } from './util.js';

export const createSideBar = (map, points) => {
  L.control.sidepanel('side-panel', {
    panelPosition: 'left',
    startTab: 'tab-1'
  }).addTo(map);

  const emitter = new EventTarget();

  const SidePanelApp = {
    template: `
      <div>
        <input v-model="filter" placeholder="Search..." class="search-input" />
        <div class="sidebar-list">
          <div
            v-for="point in visiblePoints"
            :key="point.index"
            class="point-entry"
            :class="{ active: point.active, matchesFilter: point.matchesFilter }"
          >
            <h3 class="point-name-action" @click="emitVisit(point)">{{ point.name }}</h3>
            <p>{{ [point.city, point.state, point.province, point.country].filter(Boolean).join(', ') }}</p>
            <p v-if="point.website">
              <a :href="point.website" target="_blank">{{ point.website }}</a>
            </p>
          </div>
          <p v-if="!visiblePoints.length">No matching groups found.</p>
          <h4 v-if="invisiblePoints.length">Results out of view</h4>
          <div
            v-for="point in invisiblePoints"
            :key="point.index"
            class="point-entry out-of-view"
            :class="{ active: point.active, matchesFilter: point.matchesFilter }"
          >
            <h3 class="point-name-action" @click="emitVisit(point)">{{ point.name }}</h3>
            <p>{{ [point.city, point.state,  point.province, point.country].filter(Boolean).join(', ') }}</p>
            <p v-if="point.website">
              <a :href="point.website" target="_blank">{{ point.website }}</a>
            </p>
          </div>
        </div>
      </div>
    `,
    setup() {
      const filter = ref('');
      const emitVisit = (point) => {
        emitter.dispatchEvent(new CustomEvent('visit', { detail: { point: points.find(p => p.index === point.index) } }));
      };
      const searchSortedFilteredPoints = computed(() => {
        const f = filter.value.toLowerCase();
        return points
          .map(p => {
            const matchesFilter = p.name.toLowerCase().includes(f) ||
              (p.city && p.city.toLowerCase().includes(f)) ||
              (p.state && p.state.toLowerCase().includes(f)) ||
              (p.province && p.province.toLowerCase().includes(f)) ||
              (p.country && p.country.toLowerCase().includes(f));
            return {
              ...p,
              distanceFromCenter: haversine(map.getCenter().lat, map.getCenter().lng, p.latitude, p.longitude),
              matchesFilter,
            };
          })
          .sort((a, b) => {
            return b.matchesFilter - a.matchesFilter ||
              Math.sign(a.distanceFromCenter - b.distanceFromCenter) || b.active - a.active;
          });
      });
      const visiblePoints = computed(() => {
        return searchSortedFilteredPoints.value.filter(p => p.visible);
      });
      const invisiblePoints = computed(() => {
        return searchSortedFilteredPoints.value.filter(p => !p.visible);
      });

      const center = reactive({
        latitude: map.getCenter().lat,
        longitude: L.Util.wrapNum(map.getCenter().lng, [0, 360], true)
      });

      return {
        points,
        filter,
        visiblePoints,
        invisiblePoints,
        center,
        emitVisit,
      };
    }
  };

  if (window.innerWidth >= 1024) {
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