# Feature: Predictive Heatmaps

## 1. Purpose
The **Predictive Heatmaps** feature translates the output of the ML prediction models into a visual, map-based interface. It enables Station House Officers (SHOs) to optimize their patrol routes (Beat Policing) by showing them exactly where specific crimes are most likely to occur.

## 2. Target Users
- Station House Officers (SHOs)
- Patrol Planners / Dispatchers

## 3. User Journey
1. The SHO logs into their jurisdiction dashboard and opens the "Map View".
2. They select a filter: "Predicted Vehicle Thefts - Next 72 Hours".
3. The system renders an interactive city map with glowing "hotspots" (red/orange/yellow overlays) indicating high probability areas.
4. The SHO clicks on a hotspot to view the underlying statistics (e.g., "75% probability of two-wheeler theft between 2 AM and 4 AM on weekends").

## 4. Technical Workflow

### 4.1. Data Generation (Backend)
- As defined in the `PredictionModels.md` architecture, a **Catalyst Cron** job running Python ML scripts calculates the geospatial probabilities based on historical data.
- The output is formatted as a standard **GeoJSON FeatureCollection** and stored in **Catalyst Cache**.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [77.5946, 12.9716] },
      "properties": { "intensity": 0.85, "crime_type": "Theft" }
    }
  ]
}
```

### 4.2. Frontend Rendering (Mapbox/Leaflet)
- The Next.js frontend uses a mapping library (e.g., Mapbox GL JS or React-Leaflet).
- The frontend fetches the GeoJSON from the Catalyst API.
- The mapping library applies a `heatmap` layer style to the GeoJSON data, automatically rendering the gradient blurs based on the `intensity` property of each point.

## 5. Privacy and Security Constraints
- **No Victim PII on Map:** Heatmaps represent *aggregate probabilities*, not specific historical crimes. The map must never display the exact residential address of a past victim. Data points are slightly fuzzed (rounded to the nearest block) to protect victim privacy while still remaining actionable for patrol routing.
- **RBAC:** An SHO from Zone A cannot view the detailed predictive heatmaps for Zone B unless explicitly granted cross-jurisdictional access during a joint operation.
