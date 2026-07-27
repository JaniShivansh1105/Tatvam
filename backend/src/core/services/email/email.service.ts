import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { DomainEvents } from "../../events/domain-events.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";
import { Resend } from "resend";

export class EmailService  {
  constructor(private readonly eventBus: IEventBus) {}
  private static resend: Resend | null = null;
  private static isDev = process.env.NODE_ENV !== "production";

  private static getClient() {
    if (this.resend) return this.resend;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
    return this.resend;
  }

  async sendOTP(email: string, otp: string) {
    const client = EmailService.getClient();

    if (!client) {
      // Fallback to Development Mode (console logging)
      console.log(`\n======================================================`);
      console.log(`[EMAIL DEVELOPMENT MODE]`);
      console.log(`To: ${email}`);
      console.log(`Subject: Password Reset OTP`);
      console.log(`Body: Your Tatvam OTP is ${otp}. It expires in 2 minutes.`);
      console.log(`======================================================\n`);
      return true;
    }

    try {
      await client.emails.send({
        from: "Tatvam <noreply@tatvam.app>", // Update with verified domain later
        to: email,
        subject: "Your Tatvam Password Reset Code",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Password Reset</h2>
            <p>You requested a password reset. Here is your One-Time Password (OTP):</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #6C5CE7;">${otp}</h1>
            <p>This code expires in 2 minutes. Do not share it with anyone.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      console.error("[EMAIL ERROR] Failed to send OTP via Resend:", error);
      // Fallback to console in dev if Resend fails
      if (EmailService.isDev) {
        console.log(`[EMAIL DEV FALLBACK] OTP: ${otp}`);
        return true;
      }
      throw new Error("Failed to send email");
    }
  }
}
