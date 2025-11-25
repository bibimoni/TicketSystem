import { Injectable, Logger } from '@nestjs/common';
import { config } from 'src/config/config';
import * as fs from 'fs-extra';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { RenderTemplateDto, SendMailDto, SendOtpEmailDto } from './dtos';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost || "smtp.gmail.com",
      port: Number(config.smtpPort) || 465,
      secure: true,
      auth: {
        user: config.smtpUser,    // gmail address
        pass: config.smtpPass,    // app password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendMail(sendMailDto: SendMailDto): Promise<{}> {
    const { to, subject, html } = sendMailDto;
    const from = config.smtpUser;

    if (!from) {
      this.logger.error('SMTP_USER is not configured.');
      throw new Error('SMTP_USER is not configured.');
    }

    this.logger.log(`Preparing to send email to ${to} with subject "${subject}"`);

    const recipients = Array.isArray(to) ? to : [to];

    try {
      const response = await this.transporter.sendMail({
        from,
        to: recipients,
        subject,
        html,
      });

      if (response) {
        this.logger.log('Email sent successfully');
        return { success: true };
      } else {
        this.logger.error('Failed to send email, no data returned:', response);
        return { success: false };
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  private getTemplatePath(templateName: string): string {
    const basePath = process.env.NODE_ENV === 'production'
      ? path.join(__dirname, 'templates')
      : path.join(process.cwd(), 'src', 'mail', 'templates');

    return path.join(basePath, `${templateName}.hbs`);
  }

  private async renderTemplate(renderTemplateDto: RenderTemplateDto): Promise<string> {
    const { templateName, data } = renderTemplateDto;
    this.logger.log(`Rendering email template: ${templateName}`);
    const filePath = this.getTemplatePath(templateName)
    const source = await fs.readFile(filePath, 'utf8');
    const compiled = Handlebars.compile(source);
    return compiled(data);
  }

  async sendOtpEmail(sendOtpEmailDto: SendOtpEmailDto) {
    const { to, data } = sendOtpEmailDto;
    const html = await this.renderTemplate({
      templateName: 'verify-otp',
      data: {
        ...data,
        purpose: data.purpose || 'account verification',
        validity: data.validity || 10,
        year: new Date().getFullYear(),
      },
    });

    return this.sendMail({
      to,
      subject: 'TickeZ Verification Code',
      html,
    });
  }
}
