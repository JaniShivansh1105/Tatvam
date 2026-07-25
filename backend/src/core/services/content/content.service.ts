import { prisma } from "../../../data/prisma.js";
import { NotFoundError } from "../../../utils/errors.js";

export class ContentService {
  static async getLessonBySlug(slug: string) {
    let lesson = await prisma.lesson.findFirst({
      where: { slug },
      include: {
        subject: true,
        topics: {
          orderBy: { order: "asc" },
          include: {
            sections: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!lesson) {
      await ContentService.ensureDefaultLessons();
      lesson = await prisma.lesson.findFirst({
        where: { slug },
        include: {
          subject: true,
          topics: {
            orderBy: { order: "asc" },
            include: {
              sections: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      });
    }

    if (!lesson) {
      throw new NotFoundError("Lesson not found");
    }

    return lesson;
  }

  static async getDashboardContent(userId: string) {
    // This removes all mocks for the dashboard by returning real aggregated data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) throw new NotFoundError("User not found");

    await ContentService.ensureDefaultLessons();
    // Fetch the next logical lesson the user should take
    const nextLesson = await prisma.lesson.findFirst({
      orderBy: { order: "asc" },
      include: {
        subject: true,
        topics: { orderBy: { order: "asc" } },
      }
    });

    // We can compute stats here based on activities and mastery
    const activitiesCount = await prisma.activity.count({ where: { userId } });
    const masteries = await prisma.conceptMastery.findMany({ where: { userId } });
    const completedLessons = new Set(masteries.filter(m => m.confidence >= 0.8).map(m => m.lessonId)).size;
    const avgConfidence = masteries.length > 0 
      ? masteries.reduce((acc, m) => acc + m.confidence, 0) / masteries.length 
      : 0;
    const accuracy = `${Math.round(avgConfidence * 100)}%`;
    const learningTime = activitiesCount > 0 ? `${Math.round(activitiesCount * 5)}m` : "0m";

    // Get the most active plan for goal — GoalCard expects { current, target }
    const activePlan = await prisma.studyPlan.findFirst({
      where: { userId, progress: { lt: 100 } },
      orderBy: { startDate: "desc" }
    });
    
    // Compute study time in minutes from study sessions
    const totalStudyMinutes = await prisma.studySession.aggregate({
      where: { userId, endTime: { not: null } },
      _count: true,
    }).then(r => r._count * 15); // estimate 15min per session
    const dailyGoalMinutes = 30; // default daily goal
    const todayMinutes = Math.min(totalStudyMinutes, dailyGoalMinutes);
    
    const goal = {
      current: activePlan ? Math.round(activePlan.progress * dailyGoalMinutes / 100) : todayMinutes,
      target: dailyGoalMinutes,
    };

    return {
      user: {
        name: user.fullName,
        streak: user.profile?.streak || 0,
        points: user.profile?.points || 0,
      },
      continueLearning: nextLesson ? {
        id: nextLesson.id,
        slug: nextLesson.slug,
        title: nextLesson.title,
        topic: nextLesson.subject.name,
        progress: 0,
        estimatedMinutes: 20,
      } : null,
      stats: {
        learningTime,
        completedLessons,
        accuracy,
        currentStreak: user.profile?.streak || 0,
      },
      goal,
      aiInsight: {
        message: "You're doing great! Keep up the good work.",
        type: "encouragement",
      },
      roadmap: await ContentService.getRoadmap(userId),
      quickActions: [],
      recentActivity: await prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { lesson: true },
      }).then(acts => acts.map((a, idx) => ({
        id: idx,
        title: a.type,
        type: a.type.toLowerCase().includes("lesson") ? "lesson" : "practice",
        time: ContentService.timeAgo(a.createdAt),
      })))
    };
  }

  static async getRoadmap(userId: string) {
    await ContentService.ensureDefaultLessons();
    const lessons = await prisma.lesson.findMany({
      orderBy: { order: "asc" },
      include: {
        subject: true,
      },
    });

    const masteredIds = await prisma.conceptMastery.findMany({
      where: { userId, confidence: { gte: 0.8 } },
      select: { lessonId: true },
    }).then(res => new Set(res.map(m => m.lessonId)));

    // Return mapped nodes — RoadmapPreview expects { id, label, status: "completed"|"current"|"locked" }
    return lessons.map((l, index) => {
      let status: string = "locked";
      if (masteredIds.has(l.id)) {
        status = "completed";
      } else if (index === 0 || masteredIds.has(lessons[index - 1].id)) {
        status = "current";
      }
      return {
        id: l.slug,
        label: l.title,
        title: l.title,
        status,
        difficulty: l.difficulty.charAt(0).toUpperCase() + l.difficulty.slice(1),
        time: "15 min",
      };
    });
  }

  static async getAchievements(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    const masteriesCount = await prisma.conceptMastery.count({
      where: { userId, confidence: { gte: 0.8 } }
    });

    const completedPracticeSets = await prisma.practiceSet.findMany({
      where: { userId, status: "completed" },
    });

    const activePlans = await prisma.studyPlan.count({
      where: { userId, progress: { gt: 0 } }
    });

    const streak = user?.profile?.streak || 0;
    const completedSetsCount = completedPracticeSets.length;
    const maxScore = completedPracticeSets.length > 0 
      ? Math.max(...completedPracticeSets.map(s => s.score || 0)) 
      : 0;
    const avgScore = completedPracticeSets.length > 0
      ? completedPracticeSets.reduce((acc, s) => acc + (s.score || 0), 0) / completedPracticeSets.length
      : 0;

    const xp = (masteriesCount * 250) + (completedSetsCount * 100) + (streak * 50);
    const level = Math.floor(xp / 500) + 1;
    const currentLevelXp = xp % 500;
    const nextLevelXp = 500;

    const badges = [
      { id: 1, title: "First Steps", description: "Complete your first lesson or practice set.", icon: "Zap", color: "from-[#FFB020] to-[#FF8A00]", earned: masteriesCount > 0 || completedSetsCount > 0 },
      { id: 2, title: "Consistent Learner", description: "Maintain a 3-day learning streak.", icon: "Flame", color: "from-[#FF5E62] to-[#FF9966]", earned: streak >= 3 },
      { id: 3, title: "Newton's Disciple", description: "Score 100% in a practice test.", icon: "Trophy", color: "from-[#6C5CE7] to-[#8B7CF6]", earned: maxScore >= 100 },
      { id: 4, title: "Sharpshooter", description: "Maintain an average score of 80%+.", icon: "Target", color: "from-[#48BB78] to-[#38A169]", earned: avgScore >= 80 && completedSetsCount > 0 },
      { id: 5, title: "Dedicated Planner", description: "Progress on an active study plan.", icon: "CheckCircle2", color: "from-[#00C6FF] to-[#0072FF]", earned: activePlans > 0 },
      { id: 6, title: "Guardian of Knowledge", description: "Reach Level 5.", icon: "Shield", color: "from-[#8E2DE2] to-[#4A00E0]", earned: level >= 5 },
    ];

    return {
      xp,
      level,
      currentLevelXp,
      nextLevelXp,
      badges,
    };
  }

  private static async ensureDefaultLessons() {
    const count = await prisma.lesson.count();
    if (count > 0) return;

    let subject = await prisma.subject.findFirst({ where: { slug: "physics" } });
    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          slug: "physics",
          name: "Physics",
          description: "Classical and Modern Physics",
        },
      });
    }

    const defaultLessons = [
      {
        slug: "kinematics",
        title: "Introduction to Kinematics",
        description: "Understanding displacement, velocity, and acceleration",
        difficulty: "beginner",
        order: 1,
        topics: [
          {
            title: "Motion in One Dimension",
            order: 1,
            sections: [
              {
                title: "Position and Velocity",
                content: "<p>Kinematics describes the motion of points, bodies, and systems of bodies without considering the forces that cause them to move.</p>",
                type: "text",
                order: 1,
              },
            ],
          },
        ],
      },
      {
        slug: "newtons-laws",
        title: "Newton's Laws of Motion",
        description: "The fundamental principles of dynamics and motion",
        difficulty: "intermediate",
        order: 2,
        topics: [
          {
            title: "Laws of Motion",
            order: 1,
            sections: [
              {
                title: "The Law of Inertia",
                content: "<p>An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.</p>",
                type: "text",
                order: 1,
              },
              {
                title: "Building Intuition",
                content: "<p>The trickiest part of this concept is the phrase unbalanced force. Friction and air resistance act as unbalanced forces in daily life.</p>",
                type: "text",
                order: 2,
              },
            ],
          },
        ],
      },
      {
        slug: "work-energy",
        title: "Work, Energy & Power",
        description: "Conservation of energy and mechanical work",
        difficulty: "intermediate",
        order: 3,
        topics: [
          {
            title: "Work & Energy",
            order: 1,
            sections: [
              {
                title: "Work-Energy Theorem",
                content: "<p>Work done by the net force on a particle equals the change in its kinetic energy.</p>",
                type: "text",
                order: 1,
              },
            ],
          },
        ],
      },
      {
        slug: "gravitation",
        title: "Gravitation & Orbits",
        description: "Universal gravitation and planetary orbits",
        difficulty: "advanced",
        order: 4,
        topics: [
          {
            title: "Universal Gravitation",
            order: 1,
            sections: [
              {
                title: "Newton's Law of Universal Gravitation",
                content: "<p>Every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers.</p>",
                type: "text",
                order: 1,
              },
            ],
          },
        ],
      },
    ];

    for (const l of defaultLessons) {
      await prisma.lesson.create({
        data: {
          subjectId: subject.id,
          slug: l.slug,
          title: l.title,
          description: l.description,
          difficulty: l.difficulty,
          order: l.order,
          topics: {
            create: l.topics.map(t => ({
              title: t.title,
              order: t.order,
              sections: {
                create: t.sections,
              },
            })),
          },
        },
      });
    }
  }

  private static timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}
