const fs = require('fs');

// 1. Dashboard Page
let dashboard = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
dashboard = dashboard.replace('if (isLoading || !dashboardData) {', 'if (isLoading) {\n    return <DashboardSkeleton />;\n  }\n  if (!dashboardData) {');
fs.writeFileSync('src/app/dashboard/page.tsx', dashboard);

// 2. Learn Page
let learn = fs.readFileSync('src/app/dashboard/learn/page.tsx', 'utf8');
// replace `if (isLoading || !KNOWLEDGE_GRAPH) { ... }` with `if (isLoading) { ... } if (!KNOWLEDGE_GRAPH) { return null; }`
// The `return` block is large, so we just replace the condition.
learn = learn.replace('if (isLoading || !KNOWLEDGE_GRAPH) {', 'if (isLoading) {\n    return (\n      <PageContainer>\n        <ContentArea>\n          <div className="w-full h-full flex items-center justify-center bg-[#F8F9FF] rounded-[32px]">\n            <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />\n          </div>\n        </ContentArea>\n      </PageContainer>\n    );\n  }\n  if (!KNOWLEDGE_GRAPH) {');
fs.writeFileSync('src/app/dashboard/learn/page.tsx', learn);

// 3. Lesson Page
let lesson = fs.readFileSync('src/app/dashboard/learn/[topicId]/page.tsx', 'utf8');
lesson = lesson.replace('if (isLoading || !lessonData) {', 'if (isLoading) {\n    return (\n      <LearningShell>\n        <div className="w-full h-[600px] flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E2E8F0]">\n          <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />\n        </div>\n      </LearningShell>\n    );\n  }\n  if (!lessonData) {');
fs.writeFileSync('src/app/dashboard/learn/[topicId]/page.tsx', lesson);

console.log("Frontend loading states fixed.");
