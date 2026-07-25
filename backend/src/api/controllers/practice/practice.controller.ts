import { Request, Response } from "express";
import { prisma } from "../../../data/prisma.js";

// ─── Reusable Question Bank ─────────────────────────────────────────────────
// Isolated here for maintainability. In a production system, these would live
// in the database or be AI-generated. For now, this is the single source.
const QUESTION_BANK = [
  {
    text: "What is Newton's First Law?",
    options: ["F=ma", "Law of Inertia", "Action and Reaction", "Gravity"],
    correctAnswer: "Law of Inertia",
    explanation: "Newton's first law states that an object at rest stays at rest unless acted upon by an outside force, known as Inertia.",
    hint: "Think about laziness of objects",
    difficulty: "easy",
  },
  {
    text: "If you push a 10kg block with 50N of force on a frictionless surface, what is the acceleration?",
    options: ["5 m/s²", "10 m/s²", "50 m/s²", "0.2 m/s²"],
    correctAnswer: "5 m/s²",
    explanation: "F = ma, so a = F/m = 50/10 = 5 m/s²",
    hint: "Use F = m * a",
    difficulty: "medium",
  },
  {
    text: "Which quantity is a vector?",
    options: ["Speed", "Mass", "Velocity", "Temperature"],
    correctAnswer: "Velocity",
    explanation: "Velocity has both magnitude and direction, making it a vector quantity.",
    hint: "Vectors have direction",
    difficulty: "easy",
  },
  {
    text: "A 5kg object accelerates at 3 m/s². What is the net force?",
    options: ["15 N", "8 N", "1.67 N", "2 N"],
    correctAnswer: "15 N",
    explanation: "F = ma = 5 × 3 = 15 N",
    hint: "Newton's second law",
    difficulty: "easy",
  },
  {
    text: "What happens to an astronaut floating in space with no external forces?",
    options: ["They slow down", "They speed up", "They continue at constant velocity", "They stop immediately"],
    correctAnswer: "They continue at constant velocity",
    explanation: "Newton's First Law: without external forces, an object maintains its velocity.",
    hint: "Think about inertia in space",
    difficulty: "medium",
  },
  {
    text: "When a ball is thrown upward, at the highest point, what is its velocity?",
    options: ["Maximum", "Zero", "Negative", "Equal to initial"],
    correctAnswer: "Zero",
    explanation: "At the highest point, the ball momentarily stops before falling back down.",
    hint: "Think about what happens before it falls",
    difficulty: "easy",
  },
  {
    text: "The SI unit of force is:",
    options: ["Joule", "Newton", "Pascal", "Watt"],
    correctAnswer: "Newton",
    explanation: "The SI unit of force is the Newton (N), defined as kg·m/s².",
    hint: "Named after a famous physicist",
    difficulty: "easy",
  },
  {
    text: "Which of Newton's laws explains why a rocket propels forward?",
    options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
    correctAnswer: "Third Law",
    explanation: "The rocket pushes exhaust gases backward (action), and the gases push the rocket forward (reaction).",
    hint: "Every action has an equal and opposite reaction",
    difficulty: "medium",
  },
  {
    text: "An object moving in a circle at constant speed has:",
    options: ["Zero acceleration", "Constant velocity", "Changing velocity", "No net force"],
    correctAnswer: "Changing velocity",
    explanation: "Even though speed is constant, direction changes continuously, so velocity (a vector) is changing.",
    hint: "Velocity includes direction",
    difficulty: "hard",
  },
  {
    text: "What is the acceleration due to gravity near Earth's surface?",
    options: ["9.8 m/s²", "10.8 m/s²", "8.9 m/s²", "6.67 m/s²"],
    correctAnswer: "9.8 m/s²",
    explanation: "The standard acceleration due to gravity is approximately 9.8 m/s² near Earth's surface.",
    hint: "It's close to 10",
    difficulty: "easy",
  },
  {
    text: "Two forces of 3N and 4N act perpendicular to each other. What is the resultant?",
    options: ["7 N", "1 N", "5 N", "12 N"],
    correctAnswer: "5 N",
    explanation: "Using Pythagorean theorem: √(3² + 4²) = √(9+16) = √25 = 5 N",
    hint: "Think Pythagoras",
    difficulty: "medium",
  },
  {
    text: "Inertia of an object depends on:",
    options: ["Speed", "Acceleration", "Mass", "Force"],
    correctAnswer: "Mass",
    explanation: "Inertia is the resistance to change in motion, and it depends directly on the object's mass.",
    hint: "Heavier objects are harder to move",
    difficulty: "easy",
  },
  {
    text: "A car traveling at 60 km/h applies brakes. The friction force is an example of:",
    options: ["Centripetal force", "Gravitational force", "Retarding force", "Nuclear force"],
    correctAnswer: "Retarding force",
    explanation: "The friction force opposes motion and decelerates the car, making it a retarding force.",
    hint: "It slows things down",
    difficulty: "medium",
  },
  {
    text: "What is the weight of a 10 kg object on Earth?",
    options: ["10 N", "98 N", "100 N", "9.8 N"],
    correctAnswer: "98 N",
    explanation: "Weight = mg = 10 × 9.8 = 98 N",
    hint: "Weight = mass × g",
    difficulty: "easy",
  },
  {
    text: "Which of the following is NOT a contact force?",
    options: ["Friction", "Tension", "Normal force", "Gravitational force"],
    correctAnswer: "Gravitational force",
    explanation: "Gravity acts at a distance without physical contact, unlike friction, tension, and normal force.",
    hint: "Which one works without touching?",
    difficulty: "medium",
  },
  {
    text: "If the net force on an object is zero, the object:",
    options: ["Must be stationary", "Must be accelerating", "Is in equilibrium", "Has no mass"],
    correctAnswer: "Is in equilibrium",
    explanation: "Zero net force means the object is in equilibrium — it could be at rest OR moving at constant velocity.",
    hint: "Newton's First Law",
    difficulty: "medium",
  },
  {
    text: "A ball dropped from 20m height (g=10 m/s²) hits the ground with velocity:",
    options: ["10 m/s", "20 m/s", "14.1 m/s", "40 m/s"],
    correctAnswer: "20 m/s",
    explanation: "v² = u² + 2as = 0 + 2(10)(20) = 400, so v = 20 m/s",
    hint: "Use v² = u² + 2as",
    difficulty: "hard",
  },
  {
    text: "Action and reaction forces act on:",
    options: ["The same body", "Different bodies", "Only heavy objects", "Only light objects"],
    correctAnswer: "Different bodies",
    explanation: "Newton's Third Law states that action and reaction forces always act on two different bodies.",
    hint: "Third law pairs",
    difficulty: "medium",
  },
  {
    text: "The rate of change of velocity is called:",
    options: ["Speed", "Displacement", "Acceleration", "Momentum"],
    correctAnswer: "Acceleration",
    explanation: "Acceleration is defined as the rate of change of velocity with respect to time.",
    hint: "It tells how quickly velocity changes",
    difficulty: "easy",
  },
  {
    text: "A body of mass 2 kg is moving with velocity 10 m/s. Its momentum is:",
    options: ["5 kg·m/s", "20 kg·m/s", "12 kg·m/s", "0.2 kg·m/s"],
    correctAnswer: "20 kg·m/s",
    explanation: "Momentum p = mv = 2 × 10 = 20 kg·m/s",
    hint: "p = mass × velocity",
    difficulty: "easy",
  },
];

function selectRandomQuestions(count: number, difficulty: string): typeof QUESTION_BANK {
  let pool = [...QUESTION_BANK];
  
  // Filter by difficulty if not mixed
  if (difficulty !== "mixed") {
    const filtered = pool.filter(q => q.difficulty === difficulty);
    if (filtered.length >= count) pool = filtered;
  }
  
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  return pool.slice(0, Math.min(count, pool.length));
}

export class PracticeController {
  static async getPracticeSets(req: Request, res: Response) {
    const userId = req.user!.userId;
    try {
      const sets = await prisma.practiceSet.findMany({
        where: { userId },
        include: {
          questions: true
        },
        orderBy: { createdAt: "desc" }
      });
      res.json({ success: true, data: sets });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch practice sets" });
    }
  }

  static async generateSet(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { lessonId, type = "practice", difficulty = "mixed" } = req.body;
    try {
      const questionCount = type === "mock_test" ? 10 : 5;
      const selected = selectRandomQuestions(questionCount, difficulty);

      const set = await prisma.practiceSet.create({
        data: {
          userId,
          lessonId,
          type,
          difficulty,
          status: "in_progress",
          questions: {
            create: selected.map(q => ({
              text: q.text,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              hint: q.hint,
            }))
          }
        },
        include: { questions: true }
      });
      res.json({ success: true, data: set });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to generate practice set" });
    }
  }

  static async submitAnswer(req: Request, res: Response) {
    const questionId = req.params.questionId as string;
    const { answer, timeSpentMs } = req.body;
    try {
      const question = await prisma.question.findUnique({ where: { id: questionId } });
      if (!question) return res.status(404).json({ error: "Question not found" });

      const isCorrect = question.correctAnswer === answer;
      const updated = await prisma.question.update({
        where: { id: questionId },
        data: { userAnswer: answer, isCorrect, timeSpentMs }
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to submit answer" });
    }
  }

  static async completeSet(req: Request, res: Response) {
    const setId = req.params.setId as string;
    try {
      const set = await prisma.practiceSet.findUnique({
        where: { id: setId },
        include: { questions: true }
      });
      if (!set) return res.status(404).json({ error: "Set not found" });

      const answered = (set as any).questions.filter((q: any) => q.isCorrect !== null);
      const correct = answered.filter((q: any) => q.isCorrect === true).length;
      const score = answered.length > 0 ? (correct / answered.length) * 100 : 0;

      const updated = await prisma.practiceSet.update({
        where: { id: setId },
        data: { status: "completed", score }
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to complete set" });
    }
  }
}
