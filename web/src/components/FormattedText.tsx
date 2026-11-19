import React from 'react';

/**
 * Renders inline markdown backtick spans (`code`) as crisp monospace pills
 * so technical identifiers, flags, and commands never show raw backticks on stage.
 */
export const FormattedText: React.FC<{
  text: string;
  codeClassName?: string;
}> = ({
  text,
  codeClassName = 'px-1.5 py-0.5 rounded bg-slate-800/85 text-cyan-200 font-mono text-[0.88em] border border-slate-700/60',
}) => {
  if (!text.includes('`')) {
    return <>{text}</>;
  }

  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, idx) => {
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
