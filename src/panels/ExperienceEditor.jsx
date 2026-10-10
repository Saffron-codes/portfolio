import { useEffect, useMemo, useState } from "react";
import experience from "../data/experience";
import { useReducedMotion } from "../hooks/useReducedMotion";

export const EXPERIENCE_DESIGN = { width: 1100, height: 657 };

const T = {
  key: "text-[#82aaff]",
  str: "text-[#c3e88d]",
  punct: "text-[#89ddff]",
  kw: "text-[#c792ea]",
  comment: "text-[#6c7086] italic",
};

/** Builds the editor lines (as token arrays) from the experience data. */
function buildLines() {
  const lines = [];
  const push = (indent, tokens) => lines.push({ indent, tokens });
  push(0, [[T.comment, "// experience.ts — most recent first"]]);
  push(0, [[T.kw, "export const "], [T.key, "experience"], [T.punct, " = ["]]);
  experience.forEach((job) => {
    push(1, [[T.punct, "{"]]);
    push(2, [[T.key, "role"], [T.punct, ": "], [T.str, `"${job.role}"`], [T.punct, ","]]);
    push(2, [[T.key, "company"], [T.punct, ": "], [T.str, `"${job.company} · ${job.location}"`], [T.punct, ","]]);
    push(2, [[T.key, "period"], [T.punct, ": "], [T.str, `"${job.end ? `${job.start} – ${job.end}` : job.start}"`], [T.punct, ","]]);
    push(2, [[T.key, "highlights"], [T.punct, ": ["]]);
    job.bullets.forEach((bullet) => push(3, [[T.str, `"${bullet}"`], [T.punct, ","]]));
    push(2, [[T.punct, "],"]]);
    push(1, [[T.punct, "},"]]);
  });
  push(0, [[T.punct, "];"]]);
  return lines;
}

/** Rendered on the laptop: the roles typed in line by line as a code file. */
export default function ExperienceEditor() {
  const lines = useMemo(buildLines, []);
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? lines.length : 0);

  useEffect(() => {
    if (reducedMotion) {
      setShown(lines.length);
      return undefined;
    }
    setShown(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= lines.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [lines, reducedMotion]);

  return (
    <div className="flex h-full w-full flex-col bg-[#1e1e2e] font-mono text-[15px] leading-6 text-[#cdd6f4]">
      <div className="flex items-center gap-2 bg-[#181825] px-3 py-1.5 text-xs text-[#a6adc8]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-3">experience.ts</span>
      </div>
      <ol className="min-h-0 flex-1 overflow-y-auto py-2" aria-label="Experience, as a code file">
        {lines.slice(0, shown).map((line, index) => (
          <li key={index} className="flex">
            <span className="w-12 shrink-0 select-none pr-3 text-right text-[#585b70]" aria-hidden="true">
              {index + 1}
            </span>
            <span className="whitespace-pre-wrap pr-4" style={{ paddingLeft: `${line.indent * 1.5}rem` }}>
              {line.tokens.map(([cls, text], i) => (
                <span key={i} className={cls}>
                  {text}
                </span>
              ))}
            </span>
          </li>
        ))}
        {shown < lines.length && (
          <li className="flex" aria-hidden="true">
            <span className="w-12 shrink-0 pr-3 text-right text-[#585b70]">{shown + 1}</span>
            <span className="animate-pulse text-[#89b4fa]">▍</span>
          </li>
        )}
      </ol>
      <div className="bg-[#181825] px-3 py-1 text-xs text-[#a6adc8]">TypeScript · UTF-8 · {experience.length} roles</div>
    </div>
  );
}
