# 🤖 End-to-End Automation Testing Framework

A powerful AI-driven end-to-end automation testing framework that combines **Selenium WebDriver** with cutting-edge AI models (Google Gemini & OpenAI) to intelligently generate, execute, and analyze automated tests.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Supported AI Models](#supported-ai-models)
- [Project Structure Details](#project-structure-details)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This project automates web application testing by leveraging AI capabilities to:
- 🧠 **Intelligently generate test cases** from application behavior
- 📸 **Analyze visual elements** using computer vision
- 🔄 **Execute automated tests** using Selenium WebDriver
- 📊 **Generate comprehensive reports** in Excel format
- 🌐 **Support multi-browser testing** (Chrome, Firefox, Safari, Edge)

**Perfect for:** Testing web applications, API endpoints, user authentication flows, and complex application workflows.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Test Generation** | Automatically generates test cases using Gemini & OpenAI |
| 🎬 **Browser Automation** | Selenium WebDriver integration for real browser testing |
| 🖼️ **Visual Analysis** | Screenshot analysis with AI vision capabilities |
| 🔄 **Fallback Mechanism** | Automatic fallback between multiple AI providers |
| 📝 **Test Scenarios** | JSON-based scenario definitions for flexible test cases |
| 📊 **Report Generation** | Automated Excel reports with detailed test results |
| 🔐 **Environment Management** | Secure API key and configuration management via .env |
| 🌍 **Multi-Domain Support** | Test multiple applications/domains simultaneously |

---

## 📁 Project Structure

```
end-to-end-automation/
├── 📄 index.js                          # Main entry point for test execution
├── 📄 generate_test.js                  # AI-powered test case generator
├── 📄 package.json                      # Project dependencies & metadata
├── 📄 README.md                         # This file
├── 📄 .env                              # Environment variables (API keys) [GITIGNORED]
│
├── 📂 auto_tests/                       # Generated automated test files
│   ├── localhost_placementportal_auth_login_php_Batch_1_test_*.js
│   └── localhost_placementportal_auth_login_php_Batch_2_test_*.js
│
├── 📂 layouts/                          # HTML layout templates for testing
│   └── localhost_placementportal_auth_login_php.html
│
├── 📂 memory/                           # Test scenario definitions & configurations
│   └── localhost_placementportal_auth_login_php_scenarios.json
│
└── 📂 reports/                          # Generated test reports
    └── *.xlsx                           # Excel test result reports
```

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Git** (for version control)
- **API Keys** (at least one of the following):
  - 🔑 Google Gemini API Key
  - 🔑 OpenAI API Key (ChatGPT/GPT-4)

---

## 💾 Installation

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd "End to End automation"
```

### 2️⃣ Install Dependencies
```bash
npm install
```

**Dependencies include:**
- `selenium-webdriver` - Browser automation framework
- `@google/generative-ai` - Google Gemini API integration
- `openai` - OpenAI/ChatGPT API integration
- `dotenv` - Environment variable management
- `xlsx` - Excel report generation

### 3️⃣ Verify Installation
```bash
npm list
```

---

## ⚙️ Configuration

### 1️⃣ Create `.env` File

Create a `.env` file in the project root with your API credentials:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API
CHATGPT_API_KEY=your_openai_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here
```

### 2️⃣ Security Best Practices

⚠️ **IMPORTANT:**
- Never commit `.env` file to version control
- Use strong, unique API keys
- Regenerate keys if accidentally exposed
- Consider using environment variables in CI/CD pipelines

### 3️⃣ Configuration File Structure

Create test scenario files in `memory/` directory:

```json
{
  "domain": "localhost:8080",
  "application": "placementportal",
  "testScenarios": [
    {
      "name": "User Login",
      "steps": [
        "Navigate to /auth/login",
        "Enter valid credentials",
        "Click login button",
        "Verify dashboard appears"
      ]
    }
  ]
}
```

---

## 🚀 Usage

### Run Main Test Suite
```bash
node index.js
```

### Generate New Tests with AI
```bash
node generate_test.js
```

### Run Specific Test File
```bash
node auto_tests/localhost_placementportal_auth_login_php_Batch_1_test_*.js
```

### View Generated Reports
Reports are automatically generated in the `reports/` directory in Excel format.

---

## 🤖 Supported AI Models

The framework uses intelligent fallback mechanism across multiple AI providers:

### Google Gemini Models
| Model | Speed | Accuracy | Vision |
|-------|-------|----------|--------|
| `gemini-2.5-flash` | ⚡⚡⚡ | ✅✅✅ | ✅ |
| `gemini-2.0-flash` | ⚡⚡⚡ | ✅✅✅ | ✅ |
| `gemini-1.5-flash` | ⚡⚡ | ✅✅ | ✅ |

### OpenAI Models
| Model | Speed | Accuracy | Vision |
|-------|-------|----------|--------|
| `gpt-4o` | ⚡⚡ | ✅✅✅ | ✅ |
| `gpt-4o-mini` | ⚡⚡⚡ | ✅✅ | ✅ |
| `gpt-3.5-turbo` | ⚡⚡⚡ | ✅ | ❌ |

**Fallback Strategy:**
The framework automatically tries models in priority order and falls back to alternatives if one fails or is unavailable.

---

## 📂 Project Structure Details

### `index.js`
**Main orchestrator** for test execution
- Initializes Selenium WebDriver
- Loads test scenarios from JSON files
- Executes test batches
- Generates reports
- Handles error management & logging

### `generate_test.js`
**AI-powered test generator**
- Analyzes application layouts
- Uses AI to generate intelligent test cases
- Creates executable test scripts
- Saves generated tests to `auto_tests/`

### `auto_tests/`
**Generated test files**
- Batch-based test execution (Batch_1, Batch_2, etc.)
- Timestamped filenames for version control
- Selenium WebDriver test implementations
- Independent and concurrent executable

### `layouts/`
**HTML layout templates**
- Application UI definitions
- Element selectors for Selenium
- Reference for test generation
- Can be auto-captured from live applications

### `memory/`
**Test scenario definitions**
- JSON configuration files
- Test case descriptions
- Expected outcomes
- Application-specific settings

### `reports/`
**Generated test reports**
- Excel (.xlsx) format
- Test results summary
- Pass/fail statistics
- Detailed execution logs
- Screenshots & error traces

---

## 🔧 Common Issues & Troubleshooting

### API Key Not Found
```
Error: GEMINI_API_KEY not set
```
**Solution:** Ensure `.env` file exists and contains valid API keys.

### Browser Driver Issues
```
Error: Cannot find Chrome driver
```
**Solution:** Selenium WebDriver auto-downloads drivers. Check Chrome/Firefox installation.

### Test Timeout
**Solution:** Increase timeout in test configuration or check application responsiveness.

### AI Model Unavailable
The framework automatically falls back to alternative models. Check API quota and rate limits.

---

## 📚 Best Practices

✅ **DO:**
- Use meaningful test scenario names
- Keep scenario files organized by application
- Store API keys in environment variables
- Run tests in isolated browser sessions
- Review generated tests before execution
- Generate reports after each test run

❌ **DON'T:**
- Commit `.env` files to version control
- Share API keys in repositories
- Run multiple concurrent tests on same application
- Modify generated test files (regenerate instead)
- Rely on single AI model (use fallback feature)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** - see package.json for details.

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- 📧 Open an issue in the repository
- 💬 Check existing documentation
- 🐛 Report bugs with test logs and screenshots

---

## 🎉 Quick Start Checklist

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env` file with API keys
- [ ] Review test scenarios in `memory/`
- [ ] Run `node index.js`
- [ ] Check reports in `reports/` directory
- [ ] Customize scenarios for your application

---

**Last Updated:** April 21, 2026  
**Version:** 1.0.0  
**Status:** Active Development
