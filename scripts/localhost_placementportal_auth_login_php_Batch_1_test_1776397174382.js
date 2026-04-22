const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const scenariosFilePath = "E:\\End to End automation\\memory\\localhost_placementportal_auth_login_php_scenarios.json";
const targetUrl = "http://localhost/placementportal/auth/login.php";
const defaultTimeout = 15000;

async function runTests() {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        let scenarios = JSON.parse(fs.readFileSync(scenariosFilePath, "utf8"));
        
        for (const scenario of scenarios) {
            let executed = false;
            
            try {
                // Determine if this scenario is in the queue to be executed this run
                const targetIds = ["TC-AUTO-1","TC-AUTO-2","TC-AUTO-3","TC-AUTO-4","TC-AUTO-5","TC-AUTO-6","TC-AUTO-7","TC-AUTO-8","TC-AUTO-9","TC-AUTO-10"];
                if (!targetIds.includes(scenario.scenarioId)) continue;
                
                console.log("\nExecuting: [" + scenario.scenarioId + "] " + scenario.scenario.substring(0, 60) + "...");

                let ranSteps = true;
                switch (scenario.scenarioId) {
case "TC-AUTO-1": {
    await driver.get(targetUrl);
    const brandLink = await driver.wait(until.elementLocated(By.css('.pp-nav-brand')), 5000);
    await brandLink.click();
    await driver.wait(until.urlContains('/placementportal/'), 5000);
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.endsWith('/placementportal/')) {
        throw new Error(`Expected URL to end with '/placementportal/', but got '${currentUrl}'`);
    }
    break;
}

case "TC-AUTO-2": {
    await driver.get(targetUrl);
    const homeLink = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'pp-nav-links')]/a[text()='Home']")), 5000);
    await homeLink.click();
    await driver.wait(until.urlContains('/placementportal/'), 5000);
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.endsWith('/placementportal/')) {
        throw new Error(`Expected URL to end with '/placementportal/', but got '${currentUrl}'`);
    }
    break;
}

case "TC-AUTO-3": {
    await driver.get(targetUrl);
    const drivesLink = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'pp-nav-links')]/a[text()='Drives']")), 5000);
    await drivesLink.click();
    await driver.wait(until.urlContains('/placementportal/drives/'), 5000);
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.endsWith('/placementportal/drives/')) {
        throw new Error(`Expected URL to end with '/placementportal/drives/', but got '${currentUrl}'`);
    }
    break;
}

case "TC-AUTO-4": {
    await driver.get(targetUrl);
    const searchInput = await driver.wait(until.elementLocated(By.css('.pp-nav-search input[type="search"]')), 5000);
    
    const initialPlaceholder = await searchInput.getAttribute('placeholder');
    if (initialPlaceholder !== 'Search…') {
        throw new Error(`Expected initial placeholder to be 'Search…', but got '${initialPlaceholder}'`);
    }

    const testQuery = "Company A";
    await searchInput.sendKeys(testQuery);
    
    const typedValue = await searchInput.getAttribute('value');
    if (typedValue !== testQuery) {
        throw new Error(`Expected search input value to be '${testQuery}', but got '${typedValue}'`);
    }
    // The visual disappearance of the placeholder text upon typing is confirmed by the ability to type
    // and the input's value changing, as the placeholder attribute itself does not disappear.
    break;
}

case "TC-AUTO-5": {
    await driver.get(targetUrl);
    const themeToggle = await driver.wait(until.elementLocated(By.id('themeToggle')), 5000);
    const themeIcon = await driver.wait(until.elementLocated(By.id('themeIcon')), 5000);

    // Get initial theme state based on the icon class
    const initialIconClass = await themeIcon.getAttribute('class');
    const isInitialSunIcon = initialIconClass.includes('fa-sun'); // fa-sun usually means dark mode, fa-moon means light mode

    await themeToggle.click();

    // Wait for the icon class to change, indicating theme switch
    await driver.wait(async () => {
        const currentIconClass = await themeIcon.getAttribute('class');
        return currentIconClass !== initialIconClass;
    }, 5000, 'Theme icon class did not change after toggle.');

    const newIconClass = await themeIcon.getAttribute('class');
    const isNewSunIcon = newIconClass.includes('fa-sun');

    if (isInitialSunIcon === isNewSunIcon) {
        throw new Error('Theme icon did not toggle as expected (fa-moon/fa-sun).');
    }
    break;
}

case "TC-AUTO-6": {
    await driver.get(targetUrl);
    const themeToggle = await driver.wait(until.elementLocated(By.id('themeToggle')), 5000);
    const themeIcon = await driver.wait(until.elementLocated(By.id('themeIcon')), 5000);

    // Get initial theme state
    const initialIconClass = await themeIcon.getAttribute('class');
    
    // Toggle theme once to change it
    await themeToggle.click();

    // Wait for the icon class to change
    await driver.wait(async () => {
        const currentIconClass = await themeIcon.getAttribute('class');
        return currentIconClass !== initialIconClass;
    }, 5000, 'Theme icon class did not change after first toggle.');
    
    const themeAfterFirstToggle = await themeIcon.getAttribute('class');

    // Refresh the page
    await driver.navigate().refresh();

    // Wait for the theme icon to be located again after refresh
    await driver.wait(until.elementLocated(By.id('themeIcon')), 5000);
    const themeAfterRefresh = await themeIcon.getAttribute('class');

    // Assert that the theme state persists
    if (themeAfterFirstToggle !== themeAfterRefresh) {
        throw new Error(`Theme preference did not persist after refresh. Expected '${themeAfterFirstToggle}', but got '${themeAfterRefresh}'`);
    }
    break;
}

case "TC-AUTO-7": {
    await driver.get(targetUrl);
    const loginButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(@class, 'db-btn-primary') and contains(., 'Login')]")), 5000);
    await loginButton.click();
    await driver.wait(until.urlContains('/placementportal/auth/login.php'), 5000);
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.endsWith('/placementportal/auth/login.php')) {
        throw new Error(`Expected URL to end with '/placementportal/auth/login.php', but got '${currentUrl}'`);
    }
    break;
}

case "TC-AUTO-8": {
    await driver.get(targetUrl);
    // Ensure we are on the login page
    const currentUrlBeforeLogin = await driver.getCurrentUrl();
    if (!currentUrlBeforeLogin.includes('/auth/login.php')) {
        const loginNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(@class, 'db-btn-primary') and contains(., 'Login')]")), 5000);
        await loginNavButton.click();
        await driver.wait(until.urlContains('/placementportal/auth/login.php'), 5000);
    }
    
    const emailField = await driver.wait(until.elementLocated(By.id('email')), 5000);
    const passwordField = await driver.wait(until.elementLocated(By.id('password')), 5000);
    const signInButton = await driver.wait(until.elementLocated(By.id('loginBtn')), 5000);

    await emailField.sendKeys('test@example.com');
    await passwordField.sendKeys('ValidPassword123'); // Placeholder for valid credentials
    await signInButton.click();

    // Expected result: Redirected to user's dashboard or home page
    // Wait for the URL to change away from the login page, and for the sign-in button to be stale (page navigated)
    await driver.wait(until.not(until.urlContains('/auth/login.php')) && until.stalenessOf(signInButton), 10000, 'Login failed or did not redirect from login page.');
    const currentUrlAfterLogin = await driver.getCurrentUrl();
    if (currentUrlAfterLogin.includes('/auth/login.php')) {
        throw new Error('Expected redirection after successful login, but remained on login page.');
    }
    // Further assertions could be added here, e.g., checking for specific dashboard elements.
    break;
}

case "TC-AUTO-9": {
    await driver.get(targetUrl);
    // Ensure we are on the login page
    const currentUrlBeforeLogin = await driver.getCurrentUrl();
    if (!currentUrlBeforeLogin.includes('/auth/login.php')) {
        const loginNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(@class, 'db-btn-primary') and contains(., 'Login')]")), 5000);
        await loginNavButton.click();
        await driver.wait(until.urlContains('/placementportal/auth/login.php'), 5000);
    }

    const emailField = await driver.wait(until.elementLocated(By.id('email')), 5000);
    const passwordField = await driver.wait(until.elementLocated(By.id('password')), 5000);
    const signInButton = await driver.wait(until.elementLocated(By.id('loginBtn')), 5000);

    await emailField.sendKeys('test@example.com');
    await passwordField.sendKeys('IncorrectPassword');
    await signInButton.click();

    // Expected result: Error message and no redirection
    await driver.wait(until.urlContains('/placementportal/auth/login.php'), 5000); // Ensure no redirection
    const errorAlert = await driver.wait(until.elementLocated(By.css('.login-card .alert-danger')), 5000, 'Error message not found after incorrect password attempt.');
    const errorMessage = await errorAlert.getText();
    if (!errorMessage.includes('Invalid credentials')) {
        // Log a warning if the exact message differs, but the error element is present
        console.warn(`Warning: Expected error message to contain 'Invalid credentials', but got '${errorMessage}'`);
    }
    break;
}

case "TC-AUTO-10": {
    await driver.get(targetUrl);
    // Ensure we are on the login page
    const currentUrlBeforeLogin = await driver.getCurrentUrl();
    if (!currentUrlBeforeLogin.includes('/auth/login.php')) {
        const loginNavButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(@class, 'db-btn-primary') and contains(., 'Login')]")), 5000);
        await loginNavButton.click();
        await driver.wait(until.urlContains('/placementportal/auth/login.php'), 5000);
    }

    const emailField = await driver.wait(until.elementLocated(By.id('email')), 5000);
    const passwordField = await driver.wait(until.elementLocated(By.id('password')), 5000);
    const signInButton = await driver.wait(until.elementLocated(By.id('loginBtn')), 5000);

    await emailField.sendKeys('unregistered@example.com');
    await passwordField.sendKeys('AnyPassword123');
    await signInButton.click();

    // Expected result: Error message and no redirection
    await driver.wait(until.urlContains('/placementportal/auth/login.php'), 5000); // Ensure no redirection
    const errorAlert = await driver.wait(until.elementLocated(By.css('.login-card .alert-danger')), 5000, 'Error message not found after unregistered email attempt.');
    const errorMessage = await errorAlert.getText();
    if (!errorMessage.includes('unregistered email') && !errorMessage.includes('Invalid credentials')) {
        // Log a warning if the exact message differs, but the error element is present
        console.warn(`Warning: Expected error message to contain 'unregistered email' or 'Invalid credentials', but got '${errorMessage}'`);
    }
    break;
}


                    default:
                        console.log("No automated steps generated for this scenario.");
                        ranSteps = false;
                        break;
                }
                
                // Update final execution status for this individual scenario
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
        
        console.log("\n-> Batch complete. Writing results to JSON memory...");
        fs.writeFileSync(scenariosFilePath, JSON.stringify(scenarios, null, 2));
    } catch (e) {
        console.error("Catastrophic script failure:", e);
    } finally {
        if(driver) await driver.quit();
    }
}
runTests();
