const fs = require('fs');
const path = require('path');

function generateAuthUseCases() {
  const dir = path.join('src', 'application', 'auth');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const usecases = [
    { name: 'RegisterUseCase', method: 'register' },
    { name: 'LoginUseCase', method: 'login' },
    { name: 'RefreshUseCase', method: 'refresh' },
    { name: 'LogoutUseCase', method: 'logout' },
    { name: 'GetMeUseCase', method: 'getMe' },
    { name: 'UpdatePreferencesUseCase', method: 'updatePreferences' },
    { name: 'UpdateProfileUseCase', method: 'updateProfile' },
    { name: 'ForgotPasswordUseCase', method: 'forgotPassword' },
    { name: 'VerifyOTPUseCase', method: 'verifyOTP' },
    { name: 'ResetPasswordUseCase', method: 'resetPassword' },
  ];

  let fileContent = `import { AuthService } from "../../core/services/auth/auth.service.js";\n\n`;

  for (const uc of usecases) {
    fileContent += `export class ${uc.name} {
  static async execute(...args: any[]) {
    // @ts-ignore
    return AuthService.${uc.method}(...args);
  }
}\n\n`;
  }

  fs.writeFileSync(path.join(dir, 'auth.use-cases.ts'), fileContent);
  
  // Now modify auth controller
  const controllerFile = 'src/api/controllers/auth/auth.controller.ts';
  let controllerCode = fs.readFileSync(controllerFile, 'utf8');
  
  const imports = usecases.map(u => u.name).join(', ');
  controllerCode = controllerCode.replace(
    'import { AuthService } from "../../../core/services/auth/auth.service.js";',
    `import { ${imports} } from "../../../application/auth/auth.use-cases.js";`
  );
  
  for (const uc of usecases) {
    controllerCode = controllerCode.replace(new RegExp(`AuthService\\.${uc.method}`, 'g'), `${uc.name}.execute`);
  }
  
  fs.writeFileSync(controllerFile, controllerCode);
}

generateAuthUseCases();
console.log("Auth Use Cases generated.");
