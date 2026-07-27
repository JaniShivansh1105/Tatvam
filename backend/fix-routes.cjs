const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.route.ts') || file.endsWith('.routes.ts')) {
      results.push(file);
    }
  });
  return results;
}

const routes = getFiles('src/api/routes');
for (const file of routes) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace CapitalizedController with camelCaseController
  content = content.replace(/([A-Z]\w+Controller)\./g, (match, controllerName) => {
    // For AIController -> aiController, not aIController
    let camel = controllerName.charAt(0).toLowerCase() + controllerName.slice(1);
    if (controllerName === 'AIController') camel = 'aiController';
    return camel + '.';
  });
  
  // Also fix imports if AIController was imported as aIController
  content = content.replace(/aIController/g, 'aiController');
  
  fs.writeFileSync(file, content);
}

console.log("Routes fixed");
