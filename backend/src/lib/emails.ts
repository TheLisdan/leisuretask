import { promises as fs } from 'fs';
import path from 'path';
import { getHomeRoute } from '@leisuretask/webapp/src/lib/routes';
import { User } from '@prisma/client';
import fg from 'fast-glob';
import Handlebars from 'handlebars';
import _ from 'lodash';
import { sendEmailThroughBrevo } from './brevo';
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
    const { loggableResponse } = await sendEmailThroughBrevo({
      to,
      subject,
      html,
    });
    console.info('Sending email', {
      to,
      templateName,
      fullTemplateVariables,
      templateVariables,
      response: loggableResponse,
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
      appUrl: `${env.WEBAPP_URL}${getHomeRoute()}`,
    },
  });
};

export const sendRemindTasksEmail = async ({
  user,
  tasksCount,
}: {
  user: Pick<User, 'name' | 'email'>;
  tasksCount: number;
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Start your day productively!',
    templateName: 'tasksReminder',
    templateVariables: {
      userName: user.name,
      tasksCount,
      appUrl: `${env.WEBAPP_URL}${getHomeRoute()}`,
    },
  });
};
