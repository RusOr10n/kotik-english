import { speak } from '../audio/speech';

/** Строка правила «I am hungry. — Я голодный.»: английская часть озвучивается */
function splitExample(line: string): { en: string; rest: string } | null {
  const m = line.match(/^([^—а-яё]*[a-z][^—а-яё]*?)\s+—\s+(.+)$/i);
  if (!m) return null;
  return { en: m[1].trim(), rest: m[2] };
}

export function RuleCard({ lines, title = '📘 Правило' }: { lines: string[]; title?: string }) {
  return (
    <div className="card col gap-12" style={{ width: '100%', maxWidth: 520, boxSizing: 'border-box', padding: 'clamp(16px, 4vw, 28px)', background: '#fffdf4', border: '4px solid #ffe9a8' }}>
      <b style={{ fontSize: 22 }}>{title}</b>
      {lines.map((line) => {
        const ex = splitExample(line);
        if (!ex) {
          return (
            <div key={line} style={{ fontWeight: 700, fontSize: 'clamp(15px, 3.8vw, 18px)', lineHeight: 1.4 }}>
              {line}
            </div>
          );
        }
        return (
          <button
            key={line}
            onClick={() => speak(ex.en)}
            className="row gap-8"
            style={{
              textAlign: 'left', border: 'none', cursor: 'pointer', background: '#fff3c4', borderRadius: 12, alignItems: 'flex-start', overflowWrap: 'anywhere',
              padding: '8px 12px', fontSize: 'clamp(15px, 3.8vw, 18px)', lineHeight: 1.35,
            }}
          >
            <span className="pic">🔊</span>
            <span>
              <b style={{ color: 'var(--violet)' }}>{ex.en}</b> — {ex.rest}
            </span>
          </button>
        );
      })}
    </div>
  );
}
