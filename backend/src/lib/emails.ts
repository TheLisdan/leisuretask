import { promises as fs } from 'fs';
import path from 'path';
import { User } from '@prisma/client';
import fg from 'fast-glob';
import Handlebars from 'handlebars';
import _ from 'lodash';
import { env } from './env';

const getHbrTemplates = _.memoize(async () => {
  const htmlPaths = await fg('src/emails/dist/**/*.html', { absolute: true });
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {};

  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html');
    const htmlTemplate = await fs.readFile(htmlPath, 'utf-8');
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate);
  }

  return hbrTemplates;
});

const getEmailHtml = async (
  templateName: string,
  templateVariables: Record<string, string>
) => {
  const hbrTemplates = await getHbrTemplates();
  const hbrTemplate = hbrTemplates[templateName];
  const html = hbrTemplate(templateVariables);
  return html;
};

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string;
  subject: string;
  templateName: string;
  templateVariables?: Record<string, any>;
}) => {
  try {
    const fullTemplateVariables = {
      ...templateVariables,
      homeUrl: env.WEBAPP_URL,
    };
    const html = await getEmailHtml(templateName, fullTemplateVariables);
    console.info('Sending email', {
      to,
      subject,
      templateName,
      fullTemplateVariables,
      html,
    });
    return { ok: true };
  } catch (error) {
    console.error('Error sending email', { to, subject, templateName, error });
    return { ok: false };
  }
};

export const sendWelcomeEmail = async ({
  user,
}: {
  user: Pick<User, 'name' | 'email'>;
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Thanks for signing up!',
    templateName: 'welcome',
    templateVariables: {
      userName: user.name,
      appUrl: `${env.WEBAPP_URL}/app/home`,
    },
  });
};
