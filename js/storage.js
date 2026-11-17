/* =========================================================
   storage.js — LocalStorage manager for JAVA QUEST
   All data lives in the browser on this device only.
   Keys are namespaced under "javaquest.*".
   ========================================================= */

const KEY = 'javaquest.v1';
const KEY_SESSION = 'javaquest.session';

const Store = {
  // ---- internal ----
  _read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Store read failed:', e);
      return null;
    }
  },
  _write(obj) {
    try {
      localStorage.setItem(KEY, JSON.stringify(obj));
      return true;
    } catch (e) {
      console.error('Store write failed:', e);
      return false;
    }
  },
  _default() {
    return {
      version: 1,
      player: { name: '', avatar: '', createdAt: 0 },
      xp: 0,
      badges: [],            // array of badge ids earned
      bookmarks: [],         // array of question ids
      missions: {},          // missionId -> { completed, bestScore, bestAccuracy, attempts, lastPlayed, mistakes:[] }
      history: [],           // array of session result objects
      teams: [],             // saved team configs
      competitions: [],      // local competition history
      hostRoster: [],        // saved host roster
      hostScores: {}         // name -> points (last host session)
    };
  },

  // ---- public API ----
  all() {
    const data = this._read();
    if (!data) {
      const fresh = this._default();
      this._write(fresh);
      return fresh;
    }
    // merge in any new default keys added in later versions
    return Object.assign(this._default(), data);
  },

  save(data) {
    this._write(data);
  },

  getPlayer() { return this.all().player; },
  setPlayer(p) {
    const d = this.all();
    d.player = Object.assign(d.player, p);
    if (!d.player.createdAt) d.player.createdAt = Date.now();
    this.save(d);
  },

  getXP() { return this.all().xp; },
  addXP(amount) {
    const d = this.all();
    d.xp = Math.max(0, d.xp + amount);
    this.save(d);
    return d.xp;
  },

  getBadges() { return this.all().badges; },
  addBadge(id) {
    const d = this.all();
    if (!d.badges.includes(id)) {
      d.badges.push(id);
      this.save(d);
      return true; // newly earned
    }
    return false;
  },

  getBookmarks() { return this.all().bookmarks; },
  toggleBookmark(qid) {
    const d = this.all();
    const i = d.bookmarks.indexOf(qid);
    let added;
    if (i === -1) { d.bookmarks.push(qid); added = true; }
    else { d.bookmarks.splice(i, 1); added = false; }
    this.save(d);
    return added;
  },

  getMissions() { return this.all().missions; },
  getMission(mid) { return this.all().missions[mid] || null; },
  recordMissionResult(mid, result) {
    // result: { score, total, accuracy, correct, wrong, mistakes:[{qid, your, correct}], xpGained }
    const d = this.all();
    const prev = d.missions[mid] || { completed: false, attempts: 0, mistakes: [] };
    prev.attempts = (prev.attempts || 0) + 1;
    prev.completed = prev.completed || result.accuracy >= 0.5;
    prev.bestScore = Math.max(prev.bestScore || 0, result.score);
    prev.bestAccuracy = Math.max(prev.bestAccuracy || 0, result.accuracy);
    prev.lastPlayed = Date.now();
    // merge mistakes (unique by qid)
    const merge = {};
    (prev.mistakes || []).forEach(m => merge[m.qid] = m);
    (result.mistakes || []).forEach(m => merge[m.qid] = m);
    prev.mistakes = Object.values(merge);
    d.missions[mid] = prev;
    this.save(d);
  },
  isMissionUnlocked(mid) {
    const missions = window.MISSIONS;
    const idx = missions.findIndex(m => m.id === mid);
    if (idx <= 0) return true; // first mission always unlocked
    const prev = missions[idx - 1];
    const prevData = this.getMission(prev.id);
    return !!(prevData && prevData.completed);
  },

  getHistory() { return this.all().history; },
  addHistory(entry) {
    const d = this.all();
    entry.at = Date.now();
    d.history.unshift(entry);
    if (d.history.length > 100) d.history = d.history.slice(0, 100);
    this.save(d);
  },

  getTeams() { return this.all().teams; },
  saveTeams(teams) {
    const d = this.all();
    d.teams = teams;
    this.save(d);
  },

  getCompetitions() { return this.all().competitions; },
  addCompetition(comp) {
    const d = this.all();
    comp.at = Date.now();
    d.competitions.unshift(comp);
    if (d.competitions.length > 50) d.competitions = d.competitions.slice(0, 50);
    this.save(d);
  },

  getHostRoster() { return this.all().hostRoster; },
  setHostRoster(arr) {
    const d = this.all();
    d.hostRoster = arr;
    this.save(d);
  },
  getHostScores() { return this.all().hostScores; },
  setHostScores(obj) {
    const d = this.all();
    d.hostScores = obj;
    this.save(d);
  },

  // ---- session (in-progress game state, ephemeral but persisted) ----
  saveSession(state) {
    try { localStorage.setItem(KEY_SESSION, JSON.stringify(state)); } catch (e) {}
  },
  loadSession() {
    try {
      const raw = localStorage.getItem(KEY_SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },
  clearSession() {
    localStorage.removeItem(KEY_SESSION);
  },

  // ---- bulk operations ----
  exportJSON() {
    return JSON.stringify(this.all(), null, 2);
  },
  importJSON(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || parsed === null) throw new Error('Invalid JSON structure');
    const merged = Object.assign(this._default(), parsed);
    merged.version = 1;
    this.save(merged);
    return merged;
  },
  resetProgress() {
    const fresh = this._default();
    this.save(fresh);
    this.clearSession();
    return fresh;
  },

  // ---- derived helpers ----
  level() {
    // simple XP leveling: each level needs 100*level XP cumulative
    // L1: 0, L2: 100, L3: 300, L4: 600, L5: 1000 ... sum 100*(n*(n-1)/2)
    const xp = this.getXP();
    let lvl = 1;
    while (xp >= 100 * lvl * (lvl + 1) / 2) lvl++;
    return lvl;
  },
  xpForNextLevel() {
    const lvl = this.level();
    const needed = 100 * lvl * (lvl + 1) / 2;
    const xp = this.getXP();
    const nextThreshold = 100 * (lvl + 1) * (lvl + 2) / 2;
    return { current: xp, intoLevel: xp - needed, span: nextThreshold - needed, nextAt: nextThreshold };
  }
};

window.Store = Store;
