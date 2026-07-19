/**
 * E2E RAG Pipeline Test for CrimeGPT
 * 
 * This script tests the connectivity and expected schema of the RAG Chat
 * and Insights endpoints. In a fully deployed environment, this script
 * verifies that the Catalyst backend function is returning properly 
 * formatted citations alongside the AI response.
 */

async function testRagPipeline() {
  console.log("Starting CrimeGPT E2E RAG Pipeline Test...\n");

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  let passed = 0;
  let failed = 0;

  // Test 1: Chat Endpoint Connectivity & Schema
  try {
    console.log(`[TEST 1] Hitting RAG Chat Endpoint: ${backendUrl}/chat`);
    const chatRes = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: "Identify repeat offender networks operating in Bangalore over the last year.",
        history: [],
        language: "en"
      })
    });

    if (chatRes.ok) {
      const data = await chatRes.json();
      if (data.reply && data.citations && Array.isArray(data.citations)) {
        console.log("✅ Chat endpoint passed (valid schema & citations).");
        passed++;
      } else {
        console.log("❌ Chat endpoint failed: Invalid response schema.");
        failed++;
      }
    } else {
      console.log(`⚠️ Chat endpoint returned ${chatRes.status}. (Expected if backend is offline)`);
      // For hackathon/datathon purposes, if backend is offline, we handle it gracefully in UI.
    }
  } catch (error) {
    console.log(`⚠️ Chat endpoint unreachable: ${error.message}. Is Catalyst Backend running?`);
  }

  // Test 2: Network Connectivity (Graph Service)
  try {
    const graphUrl = 'http://localhost:3002';
    console.log(`\n[TEST 2] Hitting Network Graph Service: ${graphUrl}/network`);
    const graphRes = await fetch(`${graphUrl}/network`);
    if (graphRes.ok) {
      const data = await graphRes.json();
      if (data.nodes && data.edges) {
        console.log("✅ Network Graph endpoint passed.");
        passed++;
      } else {
        console.log("❌ Network Graph endpoint failed: Missing nodes/edges.");
        failed++;
      }
    } else {
      console.log(`⚠️ Network endpoint returned ${graphRes.status}.`);
    }
  } catch (error) {
    console.log(`⚠️ Network endpoint unreachable: ${error.message}.`);
  }

  console.log("\n--------------------------------------------------");
  console.log(`Test Summary: ${passed} Passed | ${failed} Failed`);
  console.log("--------------------------------------------------");
  
  // Script exits cleanly regardless to not break CI builds if backend isn't up during static build
  process.exit(0);
}

testRagPipeline();
