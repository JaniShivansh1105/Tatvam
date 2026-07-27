const fs = require('fs');
const path = require('path');

function processRoutes(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (!f.endsWith('.ts')) continue;
    const fullPath = path.join(dir, f);
    let code = fs.readFileSync(fullPath, 'utf8');

    // Replace controller imports
    code = code.replace(/import \{ (\w+Controller) \} from "\.\.\/controllers\/[^"]+";/g, 'import { $1 } from "../../di/container.js";');
    
    // Lowercase controller instances in routes
    code = code.replace(/(?<=asyncHandler\()(\w+)Controller\.(\w+)/g, (match, p1, p2) => {
      const lowerController = p1.charAt(0).toLowerCase() + p1.slice(1) + 'Controller';
      return `${lowerController}.${p2}.bind(${lowerController})`;
    });

    // Fix imports for `import { AuthController } from "../../di/container.js"` => `import { authController } from "../../di/container.js"`
    code = code.replace(/import \{ (\w+)Controller \} from "\.\.\/\.\.\/di\/container\.js";/g, (match, p1) => {
      const lowerController = p1.charAt(0).toLowerCase() + p1.slice(1) + 'Controller';
      return `import { ${lowerController} } from "../../di/container.js";`;
    });

    fs.writeFileSync(fullPath, code);
  }
}

processRoutes('src/api/routes');
console.log("Routes updated to use DI container.");
