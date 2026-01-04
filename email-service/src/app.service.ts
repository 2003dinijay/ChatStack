import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) { }
  async sendVerificationEmail(email: string, otp: string, subject: string, message: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4A90E2;">${subject}</h2>
            <p>${message}</p>
            <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px;">${otp}</h1>
            <p>This code will expire in 15 minutes.</p>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <small>If you didn't request this, please ignore this email.</small>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }
}
