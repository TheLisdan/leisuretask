import { promises as fs } from 'fs';
import path from 'path';
import { User } from '@prisma/client';
import fg from 'fast-glob';
import _ from 'lodash';
import { env } from './env';

const getHtmlTemplates = _.memoize(async () => {
  const htmlPaths = await fg('src/emails/dist/**/*.html', { absolute: true });
  const htmlTemplates: Record<string, string> = {};

  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html');
    htmlTemplates[templateName] = await fs.readFile(htmlPath, 'utf-8');
  }

  return htmlTemplates;
});

const getHtmlTemplate = async (templateName: string) => {
  const htmlTemplates = await getHtmlTemplates();
  return htmlTemplates[templateName];
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
    const htmlTemplate = await getHtmlTemplate(templateName);
    const fullTemplateVariables = {
      ...templateVariables,
      homeUrl: env.WEBAPP_URL,
    };
    console.info('Sending email', {
      to,
      subject,
      templateName,
      fullTemplateVariables,
      htmlTemplate,
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
