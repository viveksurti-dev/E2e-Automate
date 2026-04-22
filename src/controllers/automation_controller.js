const { execSync } = require("child_process");
const path = require("path");
const aiService = require("../services/ai_service");
const browserService = require("../services/browser_service");
const fileService = require("../services/file_service");

async function extractAndGenerateScenarios(url, safeName) {
  try {
    await browserService.init();
    await browserService.navigateTo(url);
    const { cleanHtml, encodedString } = await browserService.extractDOMAndScreenshot();
    // close browser
    await browserService.quit();
    
    fileService.saveLayout(safeName, cleanHtml, encodedString);
    
    const memoryPath = fileService.getMemoryPath(safeName);
    let existingScenarios = fileService.readScenarios(memoryPath);
    let existingPromptContext = "";

    if (existingScenarios.length > 0) {
      console.log(`-> [Memory] Found ${existingScenarios.length} existing scenarios for this page.`);
      const existingTitles = existingScenarios.map((s) => s.scenario).slice(0, 30);
      existingPromptContext = `\n\nCRITICAL CONTEXT: We already have ${existingScenarios.length} scenarios. DO NOT REPEAT ANY of the following scenarios:
${JSON.stringify(existingTitles, null, 2)}

Please strictly analyze the visible page layout and generate completely new, missing scenarios. If no critical new scenarios exist, reply strictly with an empty array: []`;
    }

    const testEnvData = fileService.readTestEnvironmentData();
    let dataContext = "";
    if (Object.keys(testEnvData).length > 0) {
      console.log(`-> [Data] Injected valid environment test data into prompt.`);
      dataContext = `\n\nTEST ENVIRONMENT DATA:\nWe have the following valid test data available for you to use:\n${JSON.stringify(testEnvData, null, 2)}\n\nCRITICAL INSTRUCTION FOR DATA-DRIVEN TESTING:\nWhen generating POSITIVE test scenarios (like successful logins, valid form submissions, etc.), you MUST explicitly use the values provided in this test data. Map this exact data directly into the "testData" field of your JSON output!`;
    }

    // find scenarios
    console.log("-> [AI] Finding Missing Scenarios...");
    const safeHtml = typeof cleanHtml === "string" ? cleanHtml.substring(0, 5000) : "No HTML extracted";

    const prompt = `You are an expert QA Automation Engineer. Analyze the attached screenshot of the web page and its cleaned HTML structure.
Generate a comprehensive suite of completely NEW test scenarios for this page covering all types: positive, negative, edge cases, screen layout, security (SQL, XSS attacks), functional, non-functional, empty fields.${existingPromptContext}${dataContext}

Cleaned HTML: 
${safeHtml}

IMPORTANT: Reply ONLY with a valid JSON array of new test scenarios. Do not include markdown formatting (like \`\`\`json).
Output MUST be 100% valid JSON. Do not include trailing commas.

CRITICAL INSTRUCTIONS:
- Every "scenario" value MUST start exactly with "To verify ".
- Every "expectedResult" value MUST start exactly with "Should be ".

Write the scenarios in this exact format:
{
  "scenarioId": "Unique ID (e.g., TC-001)",
  "module": "Identify the module (e.g., Auth, Login)",
  "createdAt": "Current Date",
  "createdBy": "AI Automation Generator",
  "scenario": "To verify [Detailed description...]",
  "expectedResult": "Should be [What should happen...]",
  "testData": "Any specific data to use",
  "executedDate": "",
  "executedBy": "",
  "Status": "not tested",
  "remarks": "NA"
}`;

    const responseText = await aiService.callAIWithFallback(prompt, encodedString);

    console.log("-> [Memory] Parsing AI response and updating Memory...");
    try {
      const match = responseText.match(/\[[\s\S]*\]/);
      let cleanJsonStr = match ? match[0] : responseText;
      cleanJsonStr = cleanJsonStr.replace(/(,)(\s*[}\]])/g, "$2");

      let newScenarios = JSON.parse(cleanJsonStr);
      if (newScenarios.length > 0) {
        const currentIdCount = existingScenarios.length;
        newScenarios.forEach((s, idx) => {
          s.scenarioId = `TC-AUTO-${currentIdCount + idx + 1}`;
        });
        existingScenarios = existingScenarios.concat(newScenarios);
        fileService.saveScenarios(memoryPath, existingScenarios);
        console.log(`-> [Memory] Successfully appended ${newScenarios.length} NEW scenarios. Total: ${existingScenarios.length}`);
      } else {
        console.log(`-> [Memory] No new scenarios were found. Total remains: ${existingScenarios.length}`);
      }
    } catch (e) {
      console.error("-> [Memory Error] Failed to parse JSON from AI.", e.message);
    }
  } catch (e) {
    console.error("-> [Extraction Error]:", e.message);
  } finally {
    await browserService.quit();
  }
}

async function executeScenarios(url, safeName, targetScenariosArray) {
  const memoryPath = fileService.getMemoryPath(safeName);
  
  targetScenariosArray = targetScenariosArray.filter((s) => String(s.Status).toLowerCase() !== "skip");
  if (!targetScenariosArray || targetScenariosArray.length === 0) {
    console.log("-> No valid scenarios to execute (they might be empty or marked as 'skip').");
    return;
  }

  console.log(`\n=== Generating & Executing Automation Scripts in Batches of 10 for ${targetScenariosArray.length} Scenarios ===`);

  const htmlContent = fileService.getLayoutHtml(safeName);
  const domContext = htmlContent ? `\n\nReference HTML DOM:\n${htmlContent.substring(0, 15000)}` : "";

  for (let i = 0; i < targetScenariosArray.length; i += 10) {
    const batch = targetScenariosArray.slice(i, i + 10);
    const batchNumber = Math.floor(i / 10) + 1;
    console.log(`\n--- Processing Batch ${batchNumber} (${batch.length} Scenarios: ${i + 1} to ${i + batch.length}) ---`);

    let masterCode = `const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const scenariosFilePath = "${memoryPath.replace(/\\/g, "\\\\")}";
const targetUrl = "${url}";
const defaultTimeout = 15000;

async function runTests() {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        let scenarios = JSON.parse(fs.readFileSync(scenariosFilePath, "utf8"));
        
        for (const scenario of scenarios) {
            let executed = false;
            
            try {
                // Determine if this scenario is in the queue to be executed this run
                const targetIds = ${JSON.stringify(batch.map((s) => s.scenarioId))};
                if (!targetIds.includes(scenario.scenarioId)) continue;
                
                console.log("\\nExecuting: [" + scenario.scenarioId + "] " + scenario.scenario.substring(0, 60) + "...");

                let ranSteps = true;
                switch (scenario.scenarioId) {
`;

    const codePrompt = `You are an expert QA Automation Engineer. Write ONLY the inner JavaScript 'case' blocks for a 'switch (scenario.scenarioId)' statement using 'selenium-webdriver' for the following ${batch.length} test scenarios.

Scenarios to Automate:
${JSON.stringify(batch, null, 2)}${domContext}

Requirements:
1. ONLY return the 'case "TC-XXX": { ... break; }' code blocks. DO NOT write the surrounding switch statement, requires, or driver initialization.
2. IMPORTANT: You MUST wrap the inner code of EVERY case entirely within curly braces => \`case "TC-123": { /* code here */ break; }\` to prevent variable scope collisions between scenarios!
3. Assume 'driver', 'By', and 'until' are already globally available.
4. Each case MUST start by navigating to the global variable 'targetUrl' (e.g., await driver.get(targetUrl)). DO NOT hardcode a URL like localhost.
5. Use explicit waits (driver.wait(until.elementLocated(By...))) for robust testing.
6. Do NOT include any markdown wrappers (like \`\`\`javascript) in your response, just the raw javascript code.`;

    try {
      console.log("-> [Code Gen] Asking AI to generate script for this batch...");
      let cleanCode = await aiService.callAIWithFallback(codePrompt);
      cleanCode = cleanCode
        .replace(/```javascript/gi, "")
        .replace(/```js/gi, "")
        .replace(/```/g, "")
        .trim();
      masterCode += cleanCode + "\n\n";
    } catch (err) {
      console.error("-> [Generation Error] Failed to generate code chunk:", err.message);
    }

    masterCode += `
                    default:
                        console.log("No automated steps generated for this scenario.");
                        ranSteps = false;
                        break;
                }
                
                if (ranSteps) {
                    scenario.Status = 'Pass';
                    scenario.executedDate = new Date().toISOString();
                } else {
                    scenario.Status = 'Unautomated';
                    scenario.executedDate = new Date().toISOString();
                }
            } catch (err) {
                console.error("Test Failed for " + scenario.scenarioId + ":", err.message);
                scenario.Status = 'Fail';
                scenario.executedDate = new Date().toISOString();
            }
        }
        
        console.log("\\n-> Batch complete. Writing results to JSON memory...");
        fs.writeFileSync(scenariosFilePath, JSON.stringify(scenarios, null, 2));
    } catch (e) {
        console.error("Catastrophic script failure:", e);
    } finally {
        if(driver) await driver.quit();
    }
}
runTests();
`;

    const testFilePath = fileService.saveTestBatch(safeName, batchNumber, masterCode);
    console.log(`-> [Code Gen] Batch script saved to: auto_tests/${path.basename(testFilePath)}`);
    console.log(`=================== EXECUTING BATCH ${batchNumber} ===================`);
    
    try {
      execSync(`node "${testFilePath}"`, { stdio: "inherit" });
    } catch (e) {
      console.error(`-> [Execution Error] Batch ${batchNumber} script encountered an execution error.`);
    }
    console.log(`=================================================================\n`);
  }

  console.log("-> [Test Executor] All batched scenarios have been generated and executed successfully.");
}

async function generateSingleExecutableScript(targetUrl, scenariosToAutomate, selectedFile) {
  console.log("\n-> [Code Gen] Asking AI to write the Selenium test script...");

  const codePrompt = `You are an expert QA Automation Engineer. Write a complete, executable Node.js script using 'selenium-webdriver' for the following test scenarios.

Make sure to define const targetUrl = "${targetUrl}"; at the top of the script.

Scenarios:
${JSON.stringify(scenariosToAutomate, null, 2)}

Requirements:
1. Initialize the Chrome driver properly via 'new Builder().forBrowser("chrome").build();'.
2. Use 'By' and 'until' from 'selenium-webdriver'.
3. Each case MUST start by navigating to the variable 'targetUrl' (e.g., await driver.get(targetUrl)). DO NOT hardcode localhost or any other URL.
4. Implement explicit waits (driver.wait(until.elementLocated(By...))) for robust testing; don't rely only on sleep.
5. Output clear console.log() checkpoints for each major step.
6. Use try/catch blocks for EACH scenario independently so that one failing scenario does not crash or stop the script.
7. Handle exceptions gracefully. Ensure driver.quit() is called in the finally block.
8. At the very end of the script, generate a test Report array logging the status (Pass/Fail) of each executed scenario and save it into a 'reports' directory as a JSON file! (Create the directory using fs if it does not exist).
9. Reply ONLY with raw, valid JavaScript code. DO NOT include markdown formatting like \`\`\`javascript or any conversational text.

Generate the code now.`;

  const codeText = await aiService.callAIWithFallback(codePrompt);
  let cleanCode = codeText.replace(/```javascript/gi, '').replace(/```js/gi, '').replace(/```/g, '').trim();

  let testFileName = selectedFile.replace('_scenarios.json', `_test_${Date.now()}.js`);
  const testFilePath = fileService.saveCustomTest(testFileName, cleanCode);
  
  console.log(`-> [Code Gen] Test successfully generated and written to: auto_tests/${testFileName}\n`);
  return testFilePath;
}

module.exports = {
  extractAndGenerateScenarios,
  executeScenarios,
  generateSingleExecutableScript
};
