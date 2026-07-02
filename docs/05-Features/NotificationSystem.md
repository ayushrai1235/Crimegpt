# Feature: Notification System

## 1. Purpose
The **Notification System** ensures that critical intelligence—such as AI-detected anomalies, cross-jurisdictional matches, or urgent administrative broadcasts—reaches the right officers instantly, cutting through the noise of daily operations.

## 2. Target Users
- All authenticated KSP personnel on the platform.

## 3. Notification Types
- **System Alerts:** "Scheduled maintenance downtime at 02:00 AM."
- **AI Recommendations:** "CrimeGPT has found 3 historical cases similar to your active FIR 102/2023."
- **Anomaly Alerts (Critical):** "Unusual spike in vehicle thefts detected in Sector 4 over the last 2 hours."
- **Collaboration Pings:** "Inspector Sharma has requested access to view the network graph for Suspect X."

## 4. Technical Workflow

### 4.1. Zoho Catalyst Integration
This feature relies heavily on native Zoho Catalyst capabilities.

1. **Storage:** When an event occurs (e.g., the Anomaly Detection cron job flags a spike), a **Catalyst Function** writes a record to a `Notifications` table in the **Catalyst Data Store** (Columns: `user_id`, `message`, `type`, `is_read`, `timestamp`).
2. **Delivery (In-App):** 
   - The Next.js frontend periodically polls (or uses WebSockets/SSE if implemented) a Catalyst endpoint to fetch unread notifications for the logged-in user.
   - A standard "Bell Icon" in the top navigation bar displays the unread count.
3. **Delivery (Out-of-Band):**
   - For *Critical* alerts (like anomalies), the system cannot rely on the user looking at the dashboard.
   - The Catalyst Function utilizes **Catalyst Push Notifications** (if a mobile app exists) or integrates with an external SMS gateway (e.g., Twilio or an Indian government SMS gateway like CDAC) to text the officer's registered mobile number immediately.

## 5. Alert Fatigue Management
To ensure officers don't ignore notifications:
- **Batching:** Non-critical AI recommendations are batched into a single "Daily Digest" notification rather than pinging the officer 10 times a day.
- **User Preferences:** The UI includes a Settings page where users can toggle which types of non-critical alerts they wish to receive via In-App vs. SMS. (Critical anomalies cannot be muted).
