const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  content = content.replace(/import \{.*\} from ".*repositories\.interface\.js";\r?\n?/g, '');
  content = content.replace(/import \{.*\} from ".*events\/event-bus\.js";\r?\n?/g, '');
  content = content.replace(/import \{.*\} from ".*events\/domain-events\.js";\r?\n?/g, '');
  content = content.replace(/import \{.*\} from ".*services\.interface\.js";\r?\n?/g, '');
  
  // also some duplicate ones:
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
