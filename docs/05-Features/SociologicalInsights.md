# Feature: Sociological Insights

## 1. Purpose
The **Sociological Insights** module represents an advanced, AI-driven capability that moves beyond tracking criminals to understanding the underlying root causes of crime clusters. It acts as an AI sociologist, analyzing text to identify systemic issues (e.g., lack of street lighting, sudden unemployment, gang rivalries) driving up crime rates in specific areas.

## 2. Target Users
- Community Policing Units
- State Policymakers and Commissioners

## 3. User Journey
1. A Commissioner notices a 20% spike in violent crimes in District X via the Analytics Dashboard.
2. They click "Generate Insights" for District X.
3. The system presents an AI-generated briefing document, not just listing the crimes, but synthesizing the *context* found within the FIR texts.
4. *Example Output:* "The recent spike in assaults in District X is highly correlated with disputes occurring near three specific unregulated liquor shops. 40% of the relevant FIRs explicitly mention intoxication-related arguments originating from these locations."

## 4. Technical Workflow (LLM Synthesis)

This feature relies heavily on the LLM's ability to synthesize large volumes of text and identify abstract patterns, a task traditional SQL cannot perform.

1. **Trigger:** The user requests insights for District X for the last 30 days.
2. **Data Retrieval:** A **Catalyst Function** queries the Vector DB or Catalyst Search to retrieve all FIR chunks for District X in that timeframe.
3. **Map-Reduce Summarization:** Because 500 FIRs will exceed the LLM's context window, the Catalyst Function executes a Map-Reduce pipeline:
   - *Map:* The function groups the FIRs into batches of 20 and sends them to the LLM with the prompt: "Identify any common sociological themes, recurring locations, or recurring motives in these 20 case files."
   - *Reduce:* The function collects the summaries from all batches and sends *them* to the LLM with the prompt: "Synthesize these batch summaries into a final, executive-level sociological insight report."
4. **Delivery:** The final Markdown report is streamed to the frontend UI.

## 5. Integration with External Data (Future Scope)
Currently, insights are drawn solely from FIR text. In the future, this Catalyst Function will be expanded via API integrations to pull in municipal data (e.g., BBMP street light outage reports, economic data) to cross-reference against crime spikes, providing even deeper causal analysis.

## 6. Actionable Outputs
The insights generated must be actionable. The LLM prompt is engineered to conclude every report with a "Suggested Preventive Actions" section based on the identified root causes (e.g., "Recommendation: Increase beat patrols near unregulated liquor shops between 22:00 and 01:00").
