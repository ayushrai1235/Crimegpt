# Feature: Crime Forecasting

## 1. Purpose
While Heatmaps focus on *where* crimes will happen geospatially, **Crime Forecasting** focuses on *when* and *what volume* of crimes will occur over a specific temporal horizon. This feature is designed for strategic resource planning rather than daily patrol routing.

## 2. Target Users
- Police Leadership (Commissioners, DSPs)
- Strategic Resource Planners

## 3. User Journey
1. The user opens the "Forecasting" module.
2. They select a crime category (e.g., "Cyber Fraud") and a time horizon (e.g., "Next 3 Months").
3. The UI displays a time-series line chart with a "Historical" solid line and a "Predicted" dotted line extending into the future.
4. The predicted line is surrounded by a shaded "Confidence Interval" band (e.g., indicating the actual number might fall between 150 and 200 cases).

## 4. Technical Workflow

### 4.1. ML Execution (Catalyst Background Job)
- The forecasting relies on the **Facebook Prophet** (or ARIMA) time-series model running within a Python **Catalyst Function**.
- Because time-series forecasting across different horizons (1 week vs 3 months) requires different ML parameters, this cannot be pre-computed easily for every possible user combination.
- **Execution:** When the user requests a 3-month forecast, the Catalyst Function fetches the historical aggregated data (from Catalyst Cache or Data Store) and runs the Prophet model *on-the-fly*.
- **Optimization:** To prevent UI timeouts, the frontend implements a loading skeleton while the ML model runs (typically 2-4 seconds).

### 4.2. Handling Seasonality and External Variables
The accuracy of the forecast depends on providing the ML model with context. The Catalyst Function is programmed to inject "holidays" or "known events" into the Prophet model (e.g., injecting the dates for Diwali, which historically correlates with a spike in property crimes as people travel).

## 5. UI Representation
The Next.js frontend uses a charting library (like Recharts). The JSON payload returned by the Catalyst API must include the upper and lower bounds to render the confidence interval:

```json
[
  { "date": "2024-01-01", "actual": 105, "predicted": null, "lower_bound": null, "upper_bound": null },
  { "date": "2024-01-02", "actual": null, "predicted": 110, "lower_bound": 95, "upper_bound": 125 }
]
```

## 6. Audit and Accuracy Tracking
To build trust with police leadership, the system tracks its own accuracy.
- Every month, a **Catalyst Cron** job compares the *Predicted* crime numbers against the *Actual* FIRs registered in the Catalyst Data Store.
- The UI displays an "Accuracy Score" (e.g., "Last Month's Prediction Accuracy: 92%"), ensuring transparency regarding the model's reliability.
