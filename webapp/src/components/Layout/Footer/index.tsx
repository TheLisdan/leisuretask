import React from 'react';
import css from './index.module.scss';

type FooterProps = {
  links?: Array<{
    text: string;
    url: string;
  }>;
  copyright?: string;
};

export const Footer: React.FC<FooterProps> = ({
  links = [],
  copyright = `© ${new Date().getFullYear()} LeisureTask. All rights reserved.`,
}) => {
  return (
    <footer className={css.footer}>
      {links.length > 0 && (
        <nav className={css.footerNav}>
          {links.map((link, index) => (
            <React.Fragment key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={css.footerLink}
              >
                {link.text}
              </a>
              {index < links.length - 1 && (
                <span className={css.divider}>•</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className={css.copyright}>{copyright}</div>
    </footer>
  );
};
