const fs = require('fs');
let content = fs.readFileSync('src/core/services/content/content.service.ts', 'utf8');
content = content.replace('import { aiService } from "../../di/container.js";', 'import { aiService } from "../../../di/container.js";');
fs.writeFileSync('src/core/services/content/content.service.ts', content);
