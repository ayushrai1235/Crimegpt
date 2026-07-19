# Crime Forecasting & Hotspot Prediction

## 1. Overview
The Prediction Module utilizes historical geospatial crime data and temporal patterns to forecast future crime spikes and emerging geographical hotspots.

## 2. Purpose
To transition police work from reactive investigation to proactive deployment, allowing commanders to allocate patrols to high-risk areas before incidents occur.

## 3. Functional Requirements
- **Hotspot Heatmap**: Display predicted high-density crime zones on an interactive Mapbox visualization.
- **Temporal Prediction**: Predict spikes based on time of day, day of week, or seasonal events (e.g., festivals).
- **Explainability**: Predictions must display historical comparisons (e.g., "Predicted 15% increase due to similar spike during last year's Diwali").

## 4. Technical Design
1. **Data Aggregation**: A Catalyst Cron function aggregates FIR geospatial data from the Catalyst Data Store weekly.
2. **Algorithm**: Uses a time-series clustering approach (K-Means on geospatial coordinates combined with ARIMA for temporal frequency) orchestrated within a Catalyst Prediction Function.
3. **Frontend**: The data is fed to the Next.js frontend and rendered using Deck.gl / Mapbox GL JS as a predictive heat layer.

## 5. Data Flow
Catalyst Data Store -> Catalyst Cron Job (Aggregation) -> Catalyst Prediction Function (Modeling) -> Next.js Map UI.

## 6. Edge Cases
- **Sparse Data**: If a rural police station has insufficient historical data to run a meaningful ARIMA model, the UI falls back to showing simple historical density rather than a low-confidence prediction.

## 7. Future Enhancements
- Integration with external variables such as weather APIs, lunar cycles, and public event schedules to improve prediction accuracy.
