import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @EventPattern('email.otp.key')
  async handleSendOtpEmail(
    @Payload() payload: any,
    @Ctx() context: RmqContext 
  ) {
    const fullMessage = context.getMessage().content.toString();
    const envelope = JSON.parse(fullMessage);
    const type = envelope.type;

    const subject = type === 'RESET' ? 'Password Reset OTP' : 'Account Verification OTP';
    const message = type === 'RESET' ?
      'Use the following OTP to reset your password:' :
      'Welcome! Use the following OTP to verify your account:';

    console.log('Received OTP email request:', payload);

    await this.appService.sendVerificationEmail(payload.email, payload.otp, subject, message);
  }
}
