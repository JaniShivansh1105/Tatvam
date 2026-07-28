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

const getRelativePath = (from, to) => {
  let rel = path.relative(path.dirname(from), to).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel.replace(/\.ts$/, '.js');
};

const reposInterfacePath = 'src/domain/interfaces/repositories.interface.ts';
const servicesInterfacePath = 'src/domain/interfaces/services.interface.ts';
const eventBusPath = 'src/core/events/event-bus.ts';
const domainEventsPath = 'src/core/events/domain-events.ts';

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Add event bus import if IEventBus is used but not imported
  if (content.includes('IEventBus') && !content.includes(path.basename(eventBusPath).replace('.ts', ''))) {
    content = `import { IEventBus } from "${getRelativePath(file, eventBusPath)}";\n` + content;
  }
  if (content.includes('DomainEvents') && !content.includes(path.basename(domainEventsPath).replace('.ts', ''))) {
    content = `import { DomainEvents } from "${getRelativePath(file, domainEventsPath)}";\n` + content;
  }
  
  // Repositories
  const repoMatches = ['IAuthRepository', 'IWorkspaceRepository', 'IProgressRepository', 'IContentRepository', 'IChatRepository', 'IPlansRepository', 'IPracticeRepository'];
  const usedRepos = repoMatches.filter(r => content.includes(r));
  if (usedRepos.length > 0 && !content.includes('repositories.interface')) {
    content = `import { ${usedRepos.join(', ')} } from "${getRelativePath(file, reposInterfacePath)}";\n` + content;
  }

  // Services
  const serviceMatches = ['IAuthService', 'IWorkspaceService', 'IProgressService', 'IContentService', 'IAIService'];
  const usedServices = serviceMatches.filter(s => content.includes(s));
  if (usedServices.length > 0 && !content.includes('services.interface')) {
    content = `import { ${usedServices.join(', ')} } from "${getRelativePath(file, servicesInterfacePath)}";\n` + content;
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});

console.log('Fixed imports again using path.relative');
