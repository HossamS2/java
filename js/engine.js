/* =========================================================
   engine.js — Question engine for JAVA QUEST
   Filtering, randomized options, scoring, XP, badges, timer,
   HTML escaping & syntax highlight, helpers.
   ========================================================= */

const Engine = {
  // ---------- filtering ----------
  all() { return window.QUESTIONS || []; },

  filter(opts = {}) {
    let list = this.all().slice();
    if (opts.category && opts.category !== 'any') list = list.filter(q => q.category === opts.category);
    if (opts.difficulty && opts.difficulty !== 'any') list = list.filter(q => q.difficulty === opts.difficulty);
    if (opts.source && opts.source !== 'any') list = list.filter(q => q.source === opts.source);
    if (opts.type && opts.type !== 'any') list = list.filter(q => q.type === opts.type);
    if (opts.originalOnly) list = list.filter(q => q.original === true);
    if (opts.search) {
      const s = opts.search.toLowerCase();
      list = list.filter(q =>
        (q.question || '').toLowerCase().includes(s) ||
        (q.code || '').toLowerCase().includes(s) ||
        (q.explanation || '').toLowerCase().includes(s)
      );
    }
    return list;
  },

  byId(id) { return this.all().find(q => q.id === id); },

  byCategory(cat) { return this.all().filter(q => q.category === cat); },

  // ---------- randomization ----------
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // Build a presentation for a question.
  // For option-based types we optionally shuffle the options, returning
  // { q, displayOptions, correctIndex, isOptionBased }.
  // For open-ended (write/explain) there are no options; the caller shows a reference.
  prepareQuestion(q, { randomizeOptions = true } = {}) {
    const optionTypes = ['mcq', 'tf', 'predict', 'debug', 'complete', 'oopScenario', 'arrayProblem', 'recursionProblem'];
    const isOptionBased = optionTypes.includes(q.type) && Array.isArray(q.options) && q.options.length > 0;
    if (!isOptionBased) {
      return { q, isOptionBased: false, displayOptions: [], correctIndex: -1 };
    }
    if (!randomizeOptions || q.type === 'tf') {
      // keep T/F order canonical; keep others as-is when not randomizing
      return { q, isOptionBased: true, displayOptions: q.options.slice(), correctIndex: q.answer };
    }
    const correctText = q.options[q.answer];
    const shuffled = this.shuffle(q.options);
    const correctIndex = shuffled.indexOf(correctText);
    return { q, isOptionBased: true, displayOptions: shuffled, correctIndex };
  },

  // pick N questions for a session
  pickQuestions(pool, n, { shuffle = true } = {}) {
    const arr = shuffle ? this.shuffle(pool) : pool.slice();
    return arr.slice(0, Math.min(n, arr.length));
  },

  // ---------- scoring ----------
  // returns { score, correct, wrong, xpGained }
  scoreRun(results, scoring = 'standard') {
    let score = 0, correct = 0, wrong = 0, streak = 0;
    results.forEach(r => {
      if (r.correct) {
        correct++;
        streak++;
        let pts = 10;
        if (scoring === 'streak') pts += 5 * (streak - 1);
        else if (scoring === 'speed' && typeof r.timeLeft === 'number') pts += Math.max(0, Math.min(5, Math.round(r.timeLeft / 6)));
        else if (scoring === 'double') pts = 10;
        score += pts;
      } else if (r.skipped) {
        // neutral
        streak = 0;
      } else {
        wrong++;
        streak = 0;
        if (scoring === 'double') score -= 5;
      }
    });
    const xpGained = correct * 12; // XP per correct
    return { score: Math.max(0, score), correct, wrong, xpGained };
  },

  // difficulty config
  difficultyConfig(d) {
    return ({
      easy:   { count: 10, time: 0,   multiplier: 1 },
      medium: { count: 15, time: 45,  multiplier: 1.25 },
      hard:   { count: 20, time: 30,  multiplier: 1.5 }
    })[d] || { count: 10, time: 0, multiplier: 1 };
  },

  // ---------- badges ----------
  BADGES: [
    { id: 'first_step',    icon: '👟', name: 'First Step',       desc: 'Complete your first mission.' },
    { id: 'streak_5',      icon: '🔥', name: 'On Fire',          desc: 'Get a 5-question correct streak.' },
    { id: 'streak_10',     icon: '⚡', name: 'Lightning',        desc: 'Get a 10-question correct streak.' },
    { id: 'mission_1',     icon: '🌱', name: 'Foundation',       desc: 'Complete Java Foundation.' },
    { id: 'mission_2',     icon: '🧭', name: 'Navigator',        desc: 'Complete Control Flow Lab.' },
    { id: 'mission_3',     icon: '🏙️', name: 'Memory Hacker',   desc: 'Complete Arrays & Memory City.' },
    { id: 'mission_4',     icon: '🌀', name: 'Recursor',         desc: 'Complete Methods & Recursion.' },
    { id: 'mission_5',     icon: '🏰', name: 'OOP Architect',    desc: 'Complete OOP City.' },
    { id: 'mission_6',     icon: '🛠️', name: 'Recovery Expert',  desc: 'Complete System Recovery.' },
    { id: 'mission_7',     icon: '🚀', name: 'Final Boss Slayer',desc: 'Complete Advanced Systems.' },
    { id: 'perfect_run',   icon: '💯', name: 'Perfect Run',      desc: '100% accuracy in any mission.' },
    { id: 'all_missions',  icon: '👑', name: 'JAVA CORE Master', desc: 'Complete all 7 missions.' },
    { id: 'scholar',       icon: '📚', name: 'Scholar',          desc: 'Reach 500 XP.' },
    { id: 'sage',          icon: '🧙', name: 'Sage',             desc: 'Reach 1500 XP.' },
    { id: 'team_player',   icon: '🤝', name: 'Team Player',      desc: 'Finish a team game.' },
    { id: 'host_master',   icon: '🎙️', name: 'Host Master',     desc: 'Run a host session.' }
  ],

  badgeById(id) { return this.BADGES.find(b => b.id === id); },

  // evaluate & award badges given current state (missions completed, streaks, xp)
  evaluateBadges(ctx) {
    // ctx: { missionsDone:number, maxStreak:number, xp:number, modeFlags:{team,host} }
    const earned = [];
    const list = this.BADGES;
    list.forEach(b => {
      let got = false;
      switch (b.id) {
        case 'first_step':    got = ctx.missionsDone >= 1; break;
        case 'streak_5':      got = ctx.maxStreak >= 5; break;
        case 'streak_10':     got = ctx.maxStreak >= 10; break;
        case 'mission_1':     got = ctx.missionsDone >= 1 && Store.getMission('m1')?.completed; break;
        case 'mission_2':     got = !!Store.getMission('m2')?.completed; break;
        case 'mission_3':     got = !!Store.getMission('m3')?.completed; break;
        case 'mission_4':     got = !!Store.getMission('m4')?.completed; break;
        case 'mission_5':     got = !!Store.getMission('m5')?.completed; break;
        case 'mission_6':     got = !!Store.getMission('m6')?.completed; break;
        case 'mission_7':     got = !!Store.getMission('m7')?.completed; break;
        case 'perfect_run':   got = !!ctx.perfect; break;
        case 'all_missions':  got = ctx.missionsDone >= 7; break;
        case 'scholar':       got = ctx.xp >= 500; break;
        case 'sage':          got = ctx.xp >= 1500; break;
        case 'team_player':   got = !!ctx.modeFlags?.team; break;
        case 'host_master':   got = !!ctx.modeFlags?.host; break;
      }
      if (got) earned.push(b.id);
    });
    return earned;
  },

  // ---------- rendering helpers ----------
  esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  // minimal Java syntax highlighter (returns HTML string)
  highlight(code) {
    const KW = ['abstract','assert','boolean','break','byte','case','catch','char','class','const','continue','default','do','double','else','enum','extends','final','finally','float','for','goto','if','implements','import','instanceof','int','interface','long','native','new','null','package','private','protected','public','return','short','static','strictfp','super','switch','synchronized','this','throw','throws','transient','try','void','volatile','while','true','false','String','System','Scanner','Math','Integer','Double','Object','Thread','Runnable','ArrayList','Exception','RuntimeException','IOException','BufferedReader','FileReader'];
    let s = this.esc(code);
    // strings first to avoid keyword replacement inside them
    s = s.replace(/(&quot;|").*?\1/g, m => `<span class="st">${m}</span>`);
    // comments
    s = s.replace(/(\/\/[^\n]*)/g, '<span class="cm">$1</span>');
    s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cm">$1</span>');
    // numbers
    s = s.replace(/\b(\d+(\.\d+)?[fdLl]?)\b/g, '<span class="nm">$1</span>');
    // keywords
    const kwRe = new RegExp('\\b(' + KW.join('|') + ')\\b', 'g');
    s = s.replace(kwRe, '<span class="kw">$1</span>');
    // method calls: name(
    s = s.replace(/([a-zA-Z_]\w*)(\s*\()/g, '<span class="fn">$1</span>$2');
    return s;
  },

  codeBlockHTML(code) {
    if (!code) return '';
    return `<pre class="code-block">${this.highlight(code)}</pre>`;
  },

  // for option text: if it looks like code (contains ; or Java syntax), render in mono
  optionHTML(text) {
    const t = this.esc(text);
    const looksCode = /[;{}]|=>|System\.|new |\bint\b|\bString\b/.test(text);
    return looksCode ? `<span class="code mono">${this.highlight(text)}</span>` : `<span>${t}</span>`;
  },

  // ---------- weak topics analysis ----------
  weakTopics(mistakes) {
    // mistakes: array of { qid } -> look up category
    const counts = {};
    mistakes.forEach(m => {
      const q = this.byId(m.qid);
      if (!q) return;
      counts[q.category] = (counts[q.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([cat, n]) => ({ category: cat, label: window.CATEGORY_LABELS[cat] || cat, count: n }))
      .sort((a, b) => b.count - a.count);
  },

  // ---------- timer ----------
  startTimer(seconds, onTick, onEnd) {
    let remaining = seconds;
    if (seconds <= 0) return { stop() {}, getRemaining() { return 0; } };
    const id = setInterval(() => {
      remaining--;
      if (onTick) onTick(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        if (onEnd) onEnd();
      }
    }, 1000);
    return {
      stop() { clearInterval(id); },
      getRemaining() { return remaining; }
    };
  }
};

window.Engine = Engine;
