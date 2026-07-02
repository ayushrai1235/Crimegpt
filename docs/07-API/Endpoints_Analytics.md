# API Endpoints: Analytics & Heatmaps

## Overview
This document details the REST API endpoints provided by the `crimegpt-analytics-service` **Catalyst Function**. These endpoints serve pre-computed statistical data and geospatial coordinates to populate the executive dashboards.

---

## 1. Retrieve Dashboard Metrics

### `GET /api/v1/analytics/metrics`
Fetches the high-level aggregate statistics (Total Crimes, Clearance Rates) for a given jurisdiction.

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `jurisdiction_id` (string, required): e.g., "STN_045" or "ZONE_SOUTH".
  - `timeframe` (string, default: "last_30_days"): e.g., "last_7_days", "ytd".
- **Response (200 OK):**
*Note: This endpoint fetches data almost instantly from Catalyst Cache.*
```json
{
  "status": "success",
  "data": {
    "total_firs": 142,
    "clearance_rate_pct": 65.4,
    "top_crime_category": "Vehicle Theft",
    "trend_vs_last_period": "+5.2%"
  }
}
```

## 2. Retrieve Crime Timeline Data

### `GET /api/v1/analytics/timeline`
Fetches time-series data to populate the line charts on the dashboard.

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** Same as `/metrics`.
- **Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    { "date": "2024-10-01", "count": 5 },
    { "date": "2024-10-02", "count": 8 },
    { "date": "2024-10-03", "count": 2 }
  ]
}
```

## 3. Retrieve Predictive Heatmap Data

### `GET /api/v1/analytics/heatmap`
Fetches the ML-generated geospatial clusters for the map UI.

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `crime_type` (string, required): e.g., "Theft", "Assault".
- **Response (200 OK):**
Returns a standard GeoJSON FeatureCollection.
```json
{
  "status": "success",
  "data": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [77.5946, 12.9716] },
        "properties": { 
          "probability": 0.85, 
          "time_window": "22:00 - 02:00" 
        }
      }
    ]
  }
}
```
