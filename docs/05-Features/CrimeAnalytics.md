# Crime Analytics Dashboard

## 1. Overview
The Crime Analytics Dashboard provides a high-level, aggregate view of crime data across districts. It is the entry point for supervisors and analysts to gauge overall law enforcement performance and crime trends.

## 2. Purpose
To transform thousands of individual FIRs into digestible, actionable intelligence via charts, rankings, and alerts.

## 3. Functional Requirements
The dashboard must include the following widgets:
- **Today's FIRs**: A real-time count of FIRs uploaded today.
- **Crime Distribution**: A pie chart breaking down cases by category (Theft, Assault, Cyber).
- **Crime Heatmap**: A macro-level map showing overall density across the state/district.
- **District Rankings**: A leaderboard of districts by crime volume or resolution rate.
- **Repeat Offenders**: A list of individuals flagged by the AI Orchestrator as highly active.
- **AI Alerts**: Real-time notifications of emerging hotspots or suspicious network growth.
- **Crime Trends**: A line chart mapping crime frequency over the last 30 days.

## 4. Technical Design
- **Frontend**: Utilizes `Recharts` or `Chart.js` for data visualization.
- **Backend**: The Analytics Module within the Catalyst Backend queries the Catalyst Data Store.
- **Performance**: To prevent slow database `GROUP BY` queries on every page load, the Analytics Module caches the dashboard payload in **Catalyst Cache** every 15 minutes.

## 5. Data Flow
Catalyst Data Store -> Catalyst Analytics Function -> Catalyst Cache -> Next.js Dashboard.

## 6. Edge Cases
- **Stale Cache**: If a high-priority alert is generated, the Catalyst Event Function invalidates the dashboard cache immediately so supervisors see the alert instantly.

## 7. Future Enhancements
- Implement real-time WebSocket connections (or Catalyst Notifications) for live-updating charts without page refreshes.
