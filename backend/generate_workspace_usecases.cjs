const fs = require('fs');
const path = require('path');

function generateWorkspaceUseCases() {
  const dir = path.join('src', 'application', 'workspace');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const bookmarksContent = `import { WorkspaceService } from "../../core/services/workspace/workspace.service.js";

export class GetBookmarksUseCase {
  static async execute(userId: string, lessonId: string, query?: any) {
    return WorkspaceService.getBookmarks(userId, lessonId, query);
  }
}

export class AddBookmarkUseCase {
  static async execute(userId: string, lessonId: string, data: any) {
    return WorkspaceService.addBookmark(userId, lessonId, data);
  }
}

export class UpdateBookmarkUseCase {
  static async execute(userId: string, id: string, data: any) {
    return WorkspaceService.updateBookmark(userId, id, data);
  }
}

export class RemoveBookmarkUseCase {
  static async execute(userId: string, id: string) {
    return WorkspaceService.removeBookmark(userId, id);
  }
}

export class RestoreBookmarkUseCase {
  static async execute(userId: string, id: string) {
    return WorkspaceService.restoreBookmark(userId, id);
  }
}
`;
  fs.writeFileSync(path.join(dir, 'bookmarks.use-case.ts'), bookmarksContent);

  const notesContent = `import { WorkspaceService } from "../../core/services/workspace/workspace.service.js";

export class GetNotesUseCase {
  static async execute(userId: string, lessonId: string, query?: any) {
    return WorkspaceService.getNotes(userId, lessonId, query);
  }
}

export class AddNoteUseCase {
  static async execute(userId: string, lessonId: string, data: any) {
    return WorkspaceService.addNote(userId, lessonId, data);
  }
}

export class UpdateNoteUseCase {
  static async execute(userId: string, id: string, data: any) {
    return WorkspaceService.updateNote(userId, id, data);
  }
}

export class RemoveNoteUseCase {
  static async execute(userId: string, id: string) {
    return WorkspaceService.removeNote(userId, id);
  }
}
`;
  fs.writeFileSync(path.join(dir, 'notes.use-case.ts'), notesContent);

  const flashcardsContent = `import { WorkspaceService } from "../../core/services/workspace/workspace.service.js";

export class GetFlashcardsUseCase {
  static async execute(userId: string, lessonId: string) {
    return WorkspaceService.getFlashcards(userId, lessonId);
  }
}

export class GenerateFlashcardUseCase {
  static async execute(userId: string, lessonId: string, data: any) {
    return WorkspaceService.generateFlashcard(userId, lessonId, data);
  }
}

export class ReviewFlashcardUseCase {
  static async execute(userId: string, id: string, data: any) {
    return WorkspaceService.reviewFlashcard(userId, id, data);
  }
}
`;
  fs.writeFileSync(path.join(dir, 'flashcards.use-case.ts'), flashcardsContent);
  
  // Now modify workspace controller
  const controllerFile = 'src/api/controllers/workspace/workspace.controller.ts';
  let controllerCode = fs.readFileSync(controllerFile, 'utf8');
  
  // replace imports
  controllerCode = controllerCode.replace(
    'import { WorkspaceService } from "../../../core/services/workspace/workspace.service.js";',
    `import { GetBookmarksUseCase, AddBookmarkUseCase, UpdateBookmarkUseCase, RemoveBookmarkUseCase, RestoreBookmarkUseCase } from "../../../application/workspace/bookmarks.use-case.js";
import { GetNotesUseCase, AddNoteUseCase, UpdateNoteUseCase, RemoveNoteUseCase } from "../../../application/workspace/notes.use-case.js";
import { GetFlashcardsUseCase, GenerateFlashcardUseCase, ReviewFlashcardUseCase } from "../../../application/workspace/flashcards.use-case.js";`
  );
  
  controllerCode = controllerCode.replace(/WorkspaceService\.getBookmarks/g, 'GetBookmarksUseCase.execute');
  controllerCode = controllerCode.replace(/WorkspaceService\.addBookmark/g, 'AddBookmarkUseCase.execute');
  controllerCode = controllerCode.replace(/WorkspaceService\.updateBookmark/g, 'UpdateBookmarkUseCase.execute');
  controllerCode = controllerCode.replace(/WorkspaceService\.removeBookmark/g, 'RemoveBookmarkUseCase.execute');
  controllerCode = controllerCode.replace(/WorkspaceService\.restoreBookmark/g, 'RestoreBookmarkUseCase.execute');
  
  controllerCode = controllerCode.replace(/WorkspaceService\.getNotes/g, 'GetNotesUseCase.execute');
  controllerCode = controllerCode.replace(/WorkspaceService\.addNote/g, 'AddNoteUseCase.execute');
  controllerCode = controllerCode.replace(/WorkspaceService\.updateNote/g, 'UpdateNoteUseCase.execute');
  controllerCode = controllerCode.replace(/WorkspaceService\.removeNote/g, 'RemoveNoteUseCase.execute');
  
  controllerCode = controllerCode.replace(/WorkspaceService\.getFlashcards/g, 'GetFlashcardsUseCase.execute');
  controllerCode = controllerCode.replace(/WorkspaceService\.generateFlashcard/g, 'GenerateFlashcardUseCase.execute');
  controllerCode = controllerCode.replace(/WorkspaceService\.reviewFlashcard/g, 'ReviewFlashcardUseCase.execute');
  
  fs.writeFileSync(controllerFile, controllerCode);
}

generateWorkspaceUseCases();
console.log("Workspace Use Cases generated.");
