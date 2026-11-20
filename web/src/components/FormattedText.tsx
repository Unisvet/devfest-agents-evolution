import React from 'react';

const MARKDOWN_LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const INLINE_TOKEN_RE = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|`[^`]+`)/g;

/**
 * Strips markdown link URLs so slide typography density calculations measure
 * visible text length rather than raw href strings.
 */
export function stripMarkdownLinks(text: string): string {
  return text.replace(MARKDOWN_LINK_RE, '$1');
}

/**
 * Renders inline markdown backtick spans (`code`) as crisp monospace pills
 * and markdown links ([`code`](url) or [label](url)) as interactive external links
 * so technical identifiers, flags, and commands never show raw markdown on stage.
 */
export const FormattedText: React.FC<{
  text: string;
  codeClassName?: string;
}> = ({
  text,
  codeClassName = 'px-1.5 py-0.5 rounded bg-slate-800/85 text-cyan-200 font-mono text-[0.88em] border border-slate-700/60',
}) => {
  if (!text.includes('`') && !text.includes('](')) {
    return <>{text}</>;
  }

  const parts = text.split(INLINE_TOKEN_RE);
  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;

        const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
        if (linkMatch) {
          const [, label, href] = linkMatch;
          const isCodeLabel = label.length >= 2 && label.startsWith('`') && label.endsWith('`');
          if (isCodeLabel) {
            return (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open ${href}`}
                className="inline-block px-1.5 py-0.5 rounded bg-slate-800/90 text-cyan-200 font-mono text-[0.88em] border border-cyan-400/45 hover:bg-cyan-500/20 hover:border-cyan-300 hover:text-white underline decoration-cyan-400/60 underline-offset-2 transition-colors"
              >
                {label.slice(1, -1)}
              </a>
            );
          }

          return (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${href}`}
              className="text-cyan-200 hover:text-white underline decoration-cyan-400/60 hover:decoration-cyan-200 underline-offset-2 transition-colors"
            >
              {label}
            </a>
          );
        }

        if (part.length >= 2 && part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={idx} className={codeClassName}>
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
};
