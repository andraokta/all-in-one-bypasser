// Function to fetch the bypass rules from rules.json
async function fetchRules() {
  const rulesUrl = chrome.runtime.getURL("rules.json");
  const response = await fetch(rulesUrl);
  return await response.json();
}

// Function to decode Base64 URLs
function bypassBase64(rule) {
  console.log(`[Bypasser] Executing Base64 decode for: ${rule.name}`);
  const urlParams = new URLSearchParams(window.location.search);
  const encodedUrl = urlParams.get(rule.url_parameter);

  if (encodedUrl) {
    try {
      // Decode the Base64 string
      const decodedUrl = atob(encodedUrl);
      console.log(`[Bypasser] Redirecting to: ${decodedUrl}`);
      window.location.href = decodedUrl; // Redirect to the original link
    } catch (error) {
      console.error("[Bypasser] Failed to decode URL:", error);
    }
  }
}

// Function to automatically click a button after a delay
function bypassTimer(rule) {
  console.log(`[Bypasser] Waiting to click button for: ${rule.name}`);

  setTimeout(() => {
    const button = document.querySelector(rule.selector);
    if (button) {
      console.log("[Bypasser] Button found! Clicking now...");
      button.click();
    } else {
      console.log("[Bypasser] Button not found on the page.");
    }
  }, rule.delay); // Delay in milliseconds
}

// Main Engine: Matches current URL with the rules
async function initBypasser() {
  const currentDomain = window.location.hostname;
  const rules = await fetchRules();

  // Find if the current website is in our rules list
  const activeRule = rules.find((r) => currentDomain.includes(r.domain));

  if (activeRule) {
    console.log(`[Bypasser] Rule matched: ${activeRule.name}`);

    // Execute action based on the rule
    if (activeRule.action === "decode_url") {
      bypassBase64(activeRule);
    } else if (activeRule.action === "click_button") {
      bypassTimer(activeRule);
    }
  }
}

// Start the engine
initBypasser();
