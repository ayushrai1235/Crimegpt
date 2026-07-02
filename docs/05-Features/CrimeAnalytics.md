# Feature: Crime Analytics Dashboard

## 1. Purpose
The **Crime Analytics Dashboard** provides high-level, aggregate intelligence to police leadership. Instead of focusing on individual cases, it focuses on macro-trends, clearance rates, and resource allocation.

## 2. Target Users
- District Superintendents of Police (DSPs)
- State Commissioners

## 3. Core Visualizations (Widgets)
- **Crime Rate Timeline:** A line graph showing the volume of reported crimes over the last 12 months, filterable by Crime Type (e.g., Cyber, Property, Violent).
- **Clearance Rate Gauge:** A percentage indicator showing how many cases have been solved versus how many remain open.
- **Jurisdictional Comparison:** A bar chart comparing crime rates across different Police Stations within a zone.
- **M.O. Breakdown:** A pie chart breaking down the Modus Operandi for a specific crime type (e.g., showing that 40% of vehicle thefts happen via "Duplicate Keys").

## 4. Technical Workflow

### 4.1. The Performance Problem
Calculating these statistics in real-time requires running complex SQL `GROUP BY` and `COUNT` queries across millions of rows in the `FIR_Metadata` table. If the Commissioner loads the dashboard, executing these queries synchronously would take 10+ seconds, resulting in a poor UX.

### 4.2. The Catalyst Cache Solution
- A **Catalyst Cron** job runs at 01:00 AM IST every day.
- This job executes all the heavy analytical SQL queries against the **Catalyst Data Store**.
- The resulting structured JSON object (containing all the chart data) is pushed into **Catalyst Cache** with the key `global_analytics_dashboard`.
- When the Commissioner logs in at 9:00 AM, the frontend simply requests this cached JSON. Load time is < 50ms.

## 5. Real-Time Overrides
While the dashboard relies on 24-hour cached data, certain widgets (like "Active Critical Incidents") bypass the cache and query the Data Store directly to ensure absolute real-time accuracy for emergencies.

## 6. Frontend Libraries
- The Next.js frontend utilizes libraries like **Recharts** or **Chart.js** to render the JSON data into responsive, interactive SVGs. 
- The UI must support exporting these charts directly to PDF or PNG for official KSP press briefings.
