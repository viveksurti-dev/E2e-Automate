const fs = require("fs");
const path = require("path");
let xlsx;
try {
  xlsx = require("xlsx");
} catch (e) {
  xlsx = null;
}

class FileService {
  constructor(basePath) {
    this.basePath = basePath;
    this.dataDir = path.join(this.basePath, "data");
    this.layoutsDir = path.join(this.basePath, "layouts");
    this.memoryDir = path.join(this.basePath, "memory");
    this.testsDir = path.join(this.basePath, "auto_tests");
    this.reportsDir = path.join(this.basePath, "reports");
    this.obsDir = path.join(this.basePath, "observations");

    [this.dataDir, this.layoutsDir, this.memoryDir, this.testsDir, this.reportsDir, this.obsDir].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
  }

  saveLayout(safeName, cleanHtml, base64Image) {
    fs.writeFileSync(path.join(this.layoutsDir, `${safeName}.png`), base64Image, "base64");
    fs.writeFileSync(path.join(this.layoutsDir, `${safeName}.html`), cleanHtml || "No HTML generated");
    console.log(`-> [Extraction] Saved screenshot & HTML DOM to layouts/`);
  }

  getLayoutHtml(safeName) {
    try {
      return fs.readFileSync(path.join(this.layoutsDir, `${safeName}.html`), "utf8");
    } catch (e) {
      return "";
    }
  }

  getMemoryPath(safeName) {
    return path.join(this.memoryDir, `${safeName}_scenarios.json`);
  }

  readScenarios(memoryPath) {
    if (!fs.existsSync(memoryPath)) return [];
    try {
      return JSON.parse(fs.readFileSync(memoryPath, "utf8"));
    } catch (e) {
      return [];
    }
  }

  saveScenarios(memoryPath, scenarios) {
    fs.writeFileSync(memoryPath, JSON.stringify(scenarios, null, 2));
  }

  saveTestBatch(safeName, batchIndex, code) {
    const testFilePath = path.join(this.testsDir, `${safeName}_Batch_${batchIndex}_test_${Date.now()}.js`);
    fs.writeFileSync(testFilePath, code);
    return testFilePath;
  }

  saveCustomTest(testFileName, code) {
    const testFilePath = path.join(this.testsDir, testFileName);
    fs.writeFileSync(testFilePath, code);
    return testFilePath;
  }

  getMemoryFiles() {
    if (!fs.existsSync(this.memoryDir)) return [];
    return fs.readdirSync(this.memoryDir).filter(f => f.endsWith('.json'));
  }

  exportToExcel(scenarios, safeExcelName) {
    if (!xlsx) throw new Error("The 'xlsx' library is not installed.");
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(scenarios);
    xlsx.utils.book_append_sheet(wb, ws, "AI Scenarios");
    const excelPath = path.join(this.reportsDir, `${safeExcelName}.xlsx`);
    xlsx.writeFile(wb, excelPath);
    return excelPath;
  }

  readTestEnvironmentData() {
    const envData = {};
    if (fs.existsSync(this.dataDir)) {
      const files = fs.readdirSync(this.dataDir).filter(file => file.endsWith('.json'));
      for (const file of files) {
        try {
          const filePath = path.join(this.dataDir, file);
          const fileContent = fs.readFileSync(filePath, "utf8");
          const parsedData = JSON.parse(fileContent);
          const keyName = path.basename(file, '.json');
          envData[keyName] = parsedData;
        } catch (e) {
          console.error(`-> [Data Error] Failed to read or parse ${file}: ${e.message}`);
        }
      }
    }
    return envData;
  }
}

module.exports = new FileService(path.join(__dirname, "..", ".."));
