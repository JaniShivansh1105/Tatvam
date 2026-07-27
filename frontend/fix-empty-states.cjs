const fs = require('fs');

// 1. Dashboard Page
let dashboard = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
dashboard = dashboard.replace('if (!dashboardData) {\n    return <DashboardSkeleton />;\n  }', 'if (!dashboardData) {\n    return (\n      <PageContainer>\n        <ContentArea>\n          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/70 rounded-3xl border border-white/80">\n            <h2 className="text-xl font-bold text-gray-800 mb-2">Could not load dashboard</h2>\n            <p className="text-gray-600">There was a problem retrieving your learning data. Please try refreshing the page.</p>\n          </div>\n        </ContentArea>\n      </PageContainer>\n    );\n  }');
fs.writeFileSync('src/app/dashboard/page.tsx', dashboard);

// 2. Learn Page
let learn = fs.readFileSync('src/app/dashboard/learn/page.tsx', 'utf8');
learn = learn.replace('if (!KNOWLEDGE_GRAPH) {\n    return (\n      <PageContainer>\n        <ContentArea>\n          <div className="w-full h-full flex items-center justify-center bg-[#F8F9FF] rounded-[32px]">\n            <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />\n          </div>\n        </ContentArea>\n      </PageContainer>\n    );\n  }', 'if (!KNOWLEDGE_GRAPH) {\n    return (\n      <PageContainer>\n        <ContentArea>\n          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8F9FF] rounded-[32px] p-8 text-center">\n            <h2 className="text-xl font-bold text-gray-800 mb-2">Roadmap not available</h2>\n            <p className="text-gray-600">We could not load your learning roadmap at this time.</p>\n          </div>\n        </ContentArea>\n      </PageContainer>\n    );\n  }');
fs.writeFileSync('src/app/dashboard/learn/page.tsx', learn);

// 3. Lesson Page
let lesson = fs.readFileSync('src/app/dashboard/learn/[topicId]/page.tsx', 'utf8');
lesson = lesson.replace('if (!lessonData) {\n    return (\n      <LearningShell>\n        <div className="w-full h-[600px] flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E2E8F0]">\n          <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />\n        </div>\n      </LearningShell>\n    );\n  }', 'if (!lessonData) {\n    return (\n      <LearningShell>\n        <div className="w-full h-[600px] flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center">\n            <h2 className="text-xl font-bold text-gray-800 mb-2">Lesson not available</h2>\n            <p className="text-gray-600">We could not load this lesson at this time.</p>\n        </div>\n      </LearningShell>\n    );\n  }');
fs.writeFileSync('src/app/dashboard/learn/[topicId]/page.tsx', lesson);

console.log("Empty states fixed.");
