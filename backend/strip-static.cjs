const fs = require('fs');

['src/core/services/auth/auth.service.ts', 'src/core/services/content/content.service.ts', 'src/core/services/ai/ai.service.ts', 'src/core/services/workspace/workspace.service.ts', 'src/core/services/progress/progress.service.ts'].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/static async/g, 'async');
    content = content.replace(/static get/g, 'get');
    content = content.replace(/AuthService\./g, 'this.');
    content = content.replace(/ContentService\./g, 'this.'); 
    fs.writeFileSync(file, content);
  }
});
console.log("Services modified");
