import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TRANSFER_ELEMENT_ID, decideImport, embedPayload, extractPayload, makePayload, makeSave } from '../../src/transfer/transfer';

const RAW = JSON.stringify({
  version: 1,
  state: {
    profile: { catName: 'Мурзик', fur: 'gray' },
    coins: 340,
    lessonStars: { 'home-1': 3 },
    customThemes: [{ id: 'custom-x', name: 'Погода' }],
    settings: { rate: 0.8, voiceName: 'Samantha', muted: false, unlockAll: true },
  },
});

describe('transfer', () => {
  it('keeps progress and resets the mac-specific voice', () => {
    const s = JSON.parse(makeSave(RAW, { withProgress: true, includeThemes: true }));
    expect(s.state.coins).toBe(340);
    expect(s.state.profile.catName).toBe('Мурзик');
    expect(s.state.settings).toMatchObject({ voiceName: null, rate: 0.8 });
  });

  it('fresh start keeps only themes (optionally) and settings', () => {
    const s = JSON.parse(makeSave(RAW, { withProgress: false, includeThemes: true }));
    expect(s.state.profile).toBeUndefined();
    expect(s.state.coins).toBeUndefined();
    expect(s.state.customThemes).toHaveLength(1);
    expect(s.state.settings.unlockAll).toBe(false);
    expect(JSON.parse(makeSave(RAW, { withProgress: false, includeThemes: false })).state.customThemes).toEqual([]);
  });

  it('embeds payload safely before the last </body>', () => {
    const html = '<html><head><script type="module">const s="</body>";</script></head><body><div id="root"></div></body></html>';
    const payload = makePayload(JSON.stringify({ state: { note: '</script><b>' } }), true);
    const out = embedPayload(html, payload);
    expect(out.indexOf(`id="${TRANSFER_ELEMENT_ID}"`)).toBeGreaterThan(out.indexOf('<div id="root">'));
    expect(out.match(/<\/script>/g)).toHaveLength(2); // наша вставка не «закрыла» тег раньше времени
    const json = out.slice(out.indexOf(`id="${TRANSFER_ELEMENT_ID}">`) + `id="${TRANSFER_ELEMENT_ID}">`.length, out.lastIndexOf('</script>'));
    expect(JSON.parse(json)).toEqual(payload);
  });

  it('extracts the payload back from a transfer file', () => {
    const html = '<html><head><script type="module">const s="</body>";</script></head><body><div id="root"></div></body></html>';
    const payload = makePayload(makeSave(RAW, { withProgress: true, includeThemes: true }), true);
    expect(extractPayload(embedPayload(html, payload))).toEqual(payload);
    expect(extractPayload(html)).toBeNull();
  });

  it('applies once, asks before overwriting an existing cat', () => {
    const p = makePayload('{}', true);
    expect(decideImport(p, null, [])).toBe('apply');
    expect(decideImport(p, JSON.stringify({ state: { profile: null } }), [])).toBe('apply');
    expect(decideImport(p, RAW, [])).toBe('ask');
    expect(decideImport(p, RAW, [p.id])).toBe('skip');
  });

  it('production build is a single self-contained html file', () => {
    if (!fs.existsSync('dist/index.html')) return;
    const html = fs.readFileSync('dist/index.html', 'utf8');
    expect(html).not.toMatch(/<script[^>]+src=/);
    expect(html).not.toMatch(/<link[^>]+stylesheet[^>]+href="\.?\/?assets/);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });
});
