# 🤖 End-to-End Automation Testing Framework (MVC Architecture)

A powerful AI-driven end-to-end automation testing framework that combines **Selenium WebDriver** with cutting-edge AI models (Google Gemini, OpenAI, Anthropic Claude, and xAI Grok) to intelligently generate, execute, and analyze automated tests.

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
| 🤖 **AI-Powered Test Generation** | Automatically generates test cases using Gemini, OpenAI, Claude, and Grok |
| 🎬 **Browser Automation** | Selenium WebDriver integration for real browser testing |
| 🖼️ **Visual Analysis** | Screenshot analysis with AI vision capabilities |
| 🔄 **Smart Fallback Mechanism** | Optimized to try cheaper/faster models first, falling back to powerful ones |
| 📝 **Test Scenarios** | JSON-based scenario definitions for flexible test cases |
| 📊 **Report Generation** | Automated Excel reports with detailed test results |
| 🔐 **Environment Management** | Secure API key management via `.env` |
| 🌍 **Multi-Domain Support** | Test multiple applications/domains simultaneously |
| 🏗️ **MVC Architecture** | Clean, modular code separated into Models, Views, and Controllers |

---

## 📁 Project Structure (MVC)

The application has been refactored into a highly maintainable Model-View-Controller (Service) architecture:

```
end-to-end-automation/
├── 📄 index.js                          # Main entry point for the application
├── 📄 package.json                      # Project dependencies & metadata
├── 📄 README.md                         # This file
├── 📄 .env                              # Environment variables (API keys)
│
├── 📂 src/
│   ├── 📂 controllers/
│   │   └── 📄 automation_controller.js  # Orchestrates extraction, AI generation, and execution
│   │
│   ├── 📂 services/
│   │   ├── 📄 ai_service.js             # Handles AI API calls & smart fallback logic
│   │   ├── 📄 browser_service.js        # Manages Selenium WebDriver & DOM extraction
│   │   └── 📄 file_service.js           # Handles saving/reading layouts, scenarios, and tests
│   │
│   └── 📂 views/
│       └── 📄 view.js                   # The interactive CLI menu interface
│
├── 📂 auto_tests/                       # Generated automated test scripts
├── 📂 layouts/                          # Captured HTML DOM & Screenshots
├── 📂 memory/                           # Generated JSON test scenarios
└── 📂 reports/                          # Generated test execution Excel reports
```

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Git** (for version control)
- **API Keys** (You only need one, but having multiple enables fallbacks):
  - 🔑 Google Gemini API Key
  - 🔑 OpenAI API Key (ChatGPT)
  - 🔑 Anthropic API Key (Claude)
  - 🔑 Grok API Key (xAI)

---

## 💾 Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/viveksurti-dev/E2e-Automate.git
cd E2e-Automate
```

### 2️⃣ Install Dependencies
```bash
npm install
```

---

## ⚙️ Configuration

### 1️⃣ Create `.env` File

Create a `.env` file in the project root with your API credentials. You can provide multiple Gemini API keys separated by commas for automatic rate-limit rotation!

```env
# Google Gemini API (Comma separated for multiple keys)
GEMINI_API_KEY=key_1,key_2,key_3

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Grok API
GROK_API_KEY=your_grok_api_key_here
```

---

## 🚀 Usage

### Start the Interactive Framework
Simply run the entry point to launch the CLI view:
```bash
node index.js
```

You will be presented with a menu where you can:
1. Extract UI & Automate all scenarios natively
2. Extract UI & Generate JSON scenarios only
3. Execute specific scenarios
4. Execute failed scenarios
5. Execute untested scenarios
6. Export scenarios to Excel
7. Generate an executable test script manually

---

## 🤖 Supported AI Models & Fallback Strategy

To optimize API token costs and speed, the `ai_service.js` automatically tries **cheapest and fastest models first**, only falling back to more expensive "heavyweight" models if the cheap ones fail or hit rate limits.

### ⚡ FAST & CHEAP (Optimized for Tokens)
1. `gpt-4o-mini` (OpenAI)
2. `gemini-2.5-flash` (Google)
3. `gemini-2.0-flash` (Google)
4. `gemini-1.5-flash` (Google)
5. `gpt-3.5-turbo` (OpenAI - Non-vision only)

### 🏋️ POWERFUL (Fallback Only)
6. `claude-3-5-sonnet-20241022` (Anthropic)
7. `gpt-4o` (OpenAI)
8. `grok-2-vision-1212` (xAI)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 📜 Changelog

### v0.2.0 (Current)
- **MVC Architecture Refactor**: Completely modularized the monolithic script into separate Models (Services), Views, and Controllers.
- **Anthropic & xAI Integration**: Added support for Claude 3.5 Sonnet and Grok 2 Vision models.
- **Optimized Token Usage**: Re-ordered the model fallback array to prioritize the fastest and cheapest models (e.g., `gpt-4o-mini`, `gemini-2.5-flash`) before falling back to heavier models.
- **Multiple API Key Support**: Allowed comma-separated Gemini API keys in `.env` to automatically rotate keys when hitting rate limits or low credit balances.
- **Auto-Close Browser**: Ensured Selenium automatically closes immediately after DOM/Screenshot extraction, saving memory while the AI generates test cases.

### v0.1.0
- **Initial Release**: Built the foundational AI-powered end-to-end automation testing script.
- **Monolithic CLI**: Interactive terminal menu using `readline`.
- **Gemini & OpenAI Integration**: Support for automatic test generation.
- **Selenium Extraction**: Visual testing via computer vision and DOM extraction.
- **JSON Scenario Storage**: Local storage for test cases in `memory/`.
- **Excel Reporting**: Export functionality using `xlsx`.

---

## 📄 License

This project is licensed under the **ISC License**.
