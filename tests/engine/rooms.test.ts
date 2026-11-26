import { describe, expect, it } from 'vitest';
import { routeFromHash } from '../../src/App';
import { HOME_ITEMS, ROOMS, ROOM_BY_ID, roomOf } from '../../src/content/home';
import { BUILTIN_WORLDS } from '../../src/content/worlds';
import { isRoomUnlocked, passedWorldsCount, roomOpenedAt } from '../../src/state/progress';

const settings = { rate: 1, voiceName: null, muted: true, unlockAll: false };
const passed = (n: number, extra: Record<string, boolean> = {}) => ({
  lessonStars: {},
  settings,
  bossDefeated: { ...Object.fromEntries(BUILTIN_WORLDS.slice(0, n).map((w) => [w.id, true])), ...extra },
});

describe('home rooms', () => {
  it('open after 5, 10 and 15 passed levels', () => {
    expect(ROOMS.map((r) => [r.id, r.unlockAt])).toEqual([['living', 0], ['bathroom', 5], ['kitchen', 10], ['disco', 15]]);
    expect(BUILTIN_WORLDS.length).toBeGreaterThanOrEqual(15);
    const open = (n: number) => ROOMS.filter((r) => isRoomUnlocked(passed(n), r)).map((r) => r.id);
    expect(open(0)).toEqual(['living']);
    expect(open(4)).toEqual(['living']);
    expect(open(5)).toEqual(['living', 'bathroom']);
    expect(open(10)).toEqual(['living', 'bathroom', 'kitchen']);
    expect(open(15)).toEqual(['living', 'bathroom', 'kitchen', 'disco']);
  });

  it('counts only main-story levels and opens everything with «unlock all»', () => {
    expect(passedWorldsCount(passed(4, { 'custom-x': true }))).toBe(4);
    expect(isRoomUnlocked({ ...passed(0), settings: { ...settings, unlockAll: true } }, ROOM_BY_ID.disco)).toBe(true);
  });

  it('announces the room exactly on its level', () => {
    expect(roomOpenedAt(5)?.id).toBe('bathroom');
    expect(roomOpenedAt(10)?.id).toBe('kitchen');
    expect(roomOpenedAt(15)?.id).toBe('disco');
    expect(roomOpenedAt(0)).toBeUndefined();
    expect(roomOpenedAt(6)).toBeUndefined();
  });

  it('every new room has its own goods in the shop', () => {
    for (const room of ROOMS) {
      const goods = HOME_ITEMS.filter((i) => roomOf(i) === room.id);
      expect(goods.length, room.id).toBeGreaterThanOrEqual(8);
      for (const i of goods) {
        expect(i.price, i.id).toBeGreaterThan(0);
        expect(i.y, i.id).toBeGreaterThan(0);
        expect(i.y, i.id).toBeLessThan(100);
      }
    }
  });

  it('home route keeps a known room and ignores junk', () => {
    expect(routeFromHash('#/home/kitchen')).toEqual({ name: 'home', room: 'kitchen' });
    expect(routeFromHash('#/home')).toEqual({ name: 'home', room: undefined });
    expect(routeFromHash('#/home/toString')).toEqual({ name: 'home', room: undefined });
  });
});
