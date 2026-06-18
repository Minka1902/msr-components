import * as React from "react";
import { cx } from "../../lib/cx";
import { CopyableCodeBlock } from "../CopyableCodeBlock/CopyableCodeBlock";

export interface MarkdownRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Markdown source. */
  children: string;
  /** Open links in a new tab. */
  openLinksInNewTab?: boolean;
}

let keySeq = 0;
function nextKey() {
  return `md-${keySeq++}`;
}

/** Parse inline markdown (code, bold, italic, links) into React nodes. */
function renderInline(text: string, newTab: boolean): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Order matters: code spans first (protect), then links, bold, italic.
  const regex =
    /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*|__[^_]+__)|(\*[^*]+\*|_[^_]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (m[1]) {
      nodes.push(<code key={nextKey()} className="msr-Markdown__code">{token.slice(1, -1)}</code>);
    } else if (m[2]) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token)!;
      nodes.push(
        <a
          key={nextKey()}
          className="msr-Markdown__link"
          href={linkMatch[2]}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {linkMatch[1]}
        </a>,
      );
    } else if (m[3]) {
      nodes.push(<strong key={nextKey()}>{token.slice(2, -2)}</strong>);
    } else if (m[4]) {
      nodes.push(<em key={nextKey()}>{token.slice(1, -1)}</em>);
    }
    last = regex.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

interface Block {
  type: "h" | "p" | "ul" | "ol" | "quote" | "code" | "hr";
  level?: number;
  lines: string[];
  lang?: string;
}

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Fenced code
    const fence = /^```(\w*)\s*$/.exec(line);
    if (fence) {
      const lang = fence[1];
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) code.push(lines[i++]);
      i++; // skip closing fence
      blocks.push({ type: "code", lines: code, lang });
      continue;
    }
    if (!line.trim()) { i++; continue; }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { blocks.push({ type: "hr", lines: [] }); i++; continue; }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) { blocks.push({ type: "h", level: heading[1].length, lines: [heading[2]] }); i++; continue; }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push({ type: "quote", lines: quote });
      continue;
    }
    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) items.push(lines[i++].replace(/^[-*+]\s+/, ""));
      blocks.push({ type: "ul", lines: items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s+/, ""));
      blocks.push({ type: "ol", lines: items });
      continue;
    }
    // Paragraph: gather until blank line or another block start
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|>\s?|[-*+]\s|\d+\.\s|```)/.test(lines[i])) {
      para.push(lines[i++]);
    }
    blocks.push({ type: "p", lines: para });
  }
  return blocks;
}

/** Minimal, dependency-free Markdown renderer themed via msr tokens. */
export const MarkdownRenderer = React.forwardRef<HTMLDivElement, MarkdownRendererProps>(
  function MarkdownRenderer({ children, openLinksInNewTab = true, className, ...rest }, ref) {
    const blocks = React.useMemo(() => parseBlocks(children ?? ""), [children]);
    const inline = (t: string) => renderInline(t, openLinksInNewTab);

    return (
      <div ref={ref} className={cx("msr-Markdown", className)} {...rest}>
        {blocks.map((b) => {
          switch (b.type) {
            case "h": {
              const Tag = (`h${Math.min(6, b.level ?? 1)}`) as React.ElementType;
              return <Tag key={nextKey()} className="msr-Markdown__h">{inline(b.lines[0])}</Tag>;
            }
            case "hr":
              return <hr key={nextKey()} className="msr-Markdown__hr" />;
            case "code":
              return <CopyableCodeBlock key={nextKey()} code={b.lines.join("\n")} language={b.lang || undefined} />;
            case "quote":
              return <blockquote key={nextKey()} className="msr-Markdown__quote">{inline(b.lines.join(" "))}</blockquote>;
            case "ul":
              return <ul key={nextKey()} className="msr-Markdown__list">{b.lines.map((li) => <li key={nextKey()}>{inline(li)}</li>)}</ul>;
            case "ol":
              return <ol key={nextKey()} className="msr-Markdown__list">{b.lines.map((li) => <li key={nextKey()}>{inline(li)}</li>)}</ol>;
            default:
              return <p key={nextKey()} className="msr-Markdown__p">{inline(b.lines.join(" "))}</p>;
          }
        })}
      </div>
    );
  },
);
