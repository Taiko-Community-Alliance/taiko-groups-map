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
        <div v-if="invisibleMatches > 0 && filter" class="info-message">
          {{ invisibleMatches }} matching result<span v-if="invisibleMatches > 1">s</span> hidden from view.
        </div>
        <div class="sidebar-list" v-if="visiblePoints.length">
          <div
            v-for="point in visiblePoints"
            :key="point.index"
            class="point-entry"
            :class="{ active: point.active, matchesFilter: point.matchesFilter }"
          >
            <h3 class="point-name-action" @click="emitVisit(point)">{{ point.name }}</h3>
            <p>{{ [point.city, point.state, point.country].filter(Boolean).join(', ') }}</p>
            <p v-if="point.website">
              <a :href="point.website" target="_blank">{{ point.website }}</a>
            </p>
          </div>
        </div>
        <p v-else>No matching groups found.</p>
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
            (p.country && p.country.toLowerCase().includes(f))
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
        return searchSortedFilteredPoints.value
          .filter(p => p.visible || p.active)
      });

      const invisibleMatches = computed(() => {
        return searchSortedFilteredPoints.value.filter(point => point.matchesFilter && !visiblePoints.value.includes(point)).length;
      });
  
      const center = reactive({
        latitude: map.getCenter().lat,
        longitude: L.Util.wrapNum(map.getCenter().lng, [0, 360], true)
      });

      return {
        points,
        filter,
        visiblePoints,
        center,
        emitVisit,
        invisibleMatches
      };
    }
  };
  
  const app = createApp(SidePanelApp);
  const vm = app.mount('#vue-sidepanel-app');
  vm.$events = emitter;
  return vm;
}