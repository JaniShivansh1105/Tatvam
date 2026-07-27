import { AuthService } from "../../core/services/auth/auth.service.js";

export class RegisterUseCase {
  constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.authService.register(...args);
  }
}

export class LoginUseCase {
  constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.authService.login(...args);
  }
}

export class RefreshUseCase {
  constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.authService.refresh(...args);
  }
}

export class LogoutUseCase {
  constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.authService.logout(...args);
  }
}

export class GetMeUseCase {
  constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.authService.getMe(...args);
  }
}

export class UpdatePreferencesUseCase {
  constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.authService.updatePreferences(...args);
  }
}

export class UpdateProfileUseCase {
  constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.authService.updateProfile(...args);
  }
}

export class ForgotPasswordUseCase {
  constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.authService.forgotPassword(...args);
  }
}

export class VerifyOTPUseCase {
  constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.authService.verifyOTP(...args);
  }
}

export class ResetPasswordUseCase {
  constructor(private readonly authService: IAuthService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.authService.resetPassword(...args);
  }
}

