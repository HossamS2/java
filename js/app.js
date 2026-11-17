/* =========================================================
   app.js — Main controller for JAVA QUEST
   Navigation, mission map, home, profile, question bank,
   mission detail (lessons), confetti, toasts, modals,
   export/import/reset, XP chip.
   ========================================================= */

const App = {
  // ---------- navigation ----------
  go(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + screenId);
    if (!el) return;
    el.classList.add('active');
    // top nav active state
    document.querySelectorAll('#topNav button').forEach(b => {
      b.classList.toggle('active', b.dataset.nav === screenId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // per-screen init
    if (screenId === 'home') this.renderHome();
    if (screenId === 'missions') this.renderMissionMap();
    if (screenId === 'solo') Solo.initSetup();
    if (screenId === 'team') Team.initSetup();
    if (screenId === 'host') Host.initSetup();
    if (screenId === 'bank') this.renderBank();
    if (screenId === 'profile') this.renderProfile();
  },

  // ---------- init ----------
  init() {
    // top nav
    document.querySelectorAll('#topNav button').forEach(b => {
      b.onclick = () => this.go(b.dataset.nav);
    });
    // data-nav anywhere
    document.querySelectorAll('[data-nav]').forEach(el => {
      if (el.id && el.id.startsWith('topNav')) return;
      if (el.closest('#topNav')) return;
      el.onclick = () => this.go(el.dataset.nav);
    });
    document.getElementById('brandHome').onclick = () => this.go('home');

    // mode-card mouse tracking for radial glow
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });

    // export / import / reset
    document.getElementById('exportBtn').onclick = () => this.exportResults();
    document.getElementById('importBtn').onclick = () => document.getElementById('importFile').click();
    document.getElementById('importFile').onchange = (e) => this.importResults(e);
    document.getElementById('resetBtn').onclick = () => this.resetProgress();

    // modal close
    document.getElementById('modalBg').addEventListener('click', (e) => {
      if (e.target.id === 'modalBg') this.closeModal();
    });

    // keyboard: Esc closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    this.updateXPChip();
    this.renderHome();
    this.renderMissionMap();
    // bank filter listeners will be attached in renderBank on first visit; pre-attach here too
    this.prepBankFilters();
  },

  // ---------- XP chip ----------
  updateXPChip() {
    const lvl = Store.level();
    const xp = Store.getXP();
    document.getElementById('xpLvl').textContent = lvl;
    document.getElementById('xpVal').textContent = xp + ' XP';
  },

  // ---------- home ----------
  renderHome() {
    // region grid
    const grid = document.getElementById('homeRegionGrid');
    grid.innerHTML = window.MISSIONS.map(m => {
      const done = Store.getMission(m.id);
      const unlocked = Store.isMissionUnlocked(m.id);
      const pct = done && done.bestAccuracy != null ? Math.round(done.bestAccuracy * 100) : 0;
      const statusLine = done
        ? `<div class="text-cyan" style="font-size:.78rem; margin-top:6px;">${done.completed?'✅':'▶️'} ${pct}% best</div>`
        : (unlocked ? '<div class="text-cyan" style="font-size:.78rem; margin-top:6px;">🔓 Unlocked</div>' : '<div class="text-dim" style="font-size:.78rem; margin-top:6px;">🔒 Locked</div>');
      return `<div class="building" ${unlocked ? `onclick="App.openMission('${m.id}')"` : 'style="opacity:.5; cursor:not-allowed;"'}>
        <div class="b-icon">${m.icon}</div>
        <h4>${m.name}</h4>
        <p>${m.tagline}</p>
        ${statusLine}
      </div>`;
    }).join('');

    // stats tiles
    const missions = Store.getMissions();
    const completed = Object.values(missions).filter(m => m.completed).length;
    const history = Store.getHistory();
    const totalAnswered = history.reduce((s, h) => s + (h.correct || 0) + (h.wrong || 0), 0);
    const totalCorrect = history.reduce((s, h) => s + (h.correct || 0), 0);
    const acc = totalAnswered ? Math.round(totalCorrect / totalAnswered * 100) : 0;
    const stats = document.getElementById('homeStats');
    stats.innerHTML = `
      <div class="report-tile pct"><div class="big">${Store.level()}</div><div class="lbl">Level</div></div>
      <div class="report-tile xp"><div class="big">${Store.getXP()}</div><div class="lbl">Total XP</div></div>
      <div class="report-tile acc"><div class="big">${completed}/${window.MISSIONS.length}</div><div class="lbl">Missions</div></div>
      <div class="report-tile score"><div class="big">${acc}%</div><div class="lbl">Avg Accuracy</div></div>
      <div class="report-tile"><div class="big">${Store.getBadges().length}</div><div class="lbl">Badges</div></div>
      <div class="report-tile"><div class="big">${Store.getBookmarks().length}</div><div class="lbl">Bookmarks</div></div>
    `;

    this.updateXPChip();
  },

  // ---------- mission map ----------
  renderMissionMap() {
    const path = document.getElementById('missionPath');
    path.innerHTML = window.MISSIONS.map(m => {
      const unlocked = Store.isMissionUnlocked(m.id);
      const done = Store.getMission(m.id);
      const pct = done && done.bestAccuracy != null ? Math.round(done.bestAccuracy * 100) : 0;
      const qCount = Engine.byCategory(m.category).length;
      return `<div class="mission-node ${unlocked ? '' : 'locked'}" onclick="${unlocked ? `App.openMission('${m.id}')` : ''}">
        <div class="num">${m.icon}</div>
        <div class="info">
          <h3>${m.name}</h3>
          <p>${m.tagline}</p>
          <div class="tags">
            <span class="chip">${qCount} questions</span>
            <span class="chip purple">${m.lessons.length} lessons</span>
            ${done?.completed ? '<span class="chip gold">✅ Completed</span>' : ''}
            ${done && !done.completed ? '<span class="chip">▶️ In progress</span>' : ''}
            ${!unlocked ? '<span class="chip">🔒 Locked</span>' : ''}
          </div>
        </div>
        <div class="progress-ring" style="--p:${pct}"><span>${pct}%</span></div>
      </div>`;
    }).join('');
  },

  refreshMissionMap() { this.renderMissionMap(); this.renderHome(); },

  // ---------- mission detail (lesson view) ----------
  openMission(mid) {
    const m = window.MISSIONS.find(x => x.id === mid);
    if (!m) return;
    if (!Store.isMissionUnlocked(mid)) {
      this.toast('This region is locked. Complete the previous mission first.', 'info');
      return;
    }
    this.go('missionDetail');
    const body = document.getElementById('missionDetailBody');
    const done = Store.getMission(mid);
    const pct = done && done.bestAccuracy != null ? Math.round(done.bestAccuracy * 100) : 0;

    let html = `
      <div class="glass pad text-center">
        <div style="font-size:3rem;">${m.icon}</div>
        <h2 class="mt-8" style="color:${m.color};">${m.name}</h2>
        <p class="text-dim">${m.tagline}</p>
        <div class="flex gap-8 mt-16" style="justify-content:center; flex-wrap:wrap;">
          <span class="chip">${m.lessons.length} lessons</span>
          <span class="chip purple">${Engine.byCategory(m.category).length} questions</span>
          ${done?.completed ? '<span class="chip gold">✅ Completed</span>' : '<span class="chip">Not yet completed</span>'}
          ${pct ? `<span class="chip">Best: ${pct}%</span>` : ''}
        </div>
      </div>

      <div class="glass pad mt-16">
        <h3 class="mb-8">📖 Story</h3>
        <p style="white-space:pre-wrap; color:var(--txt);">${Engine.esc(m.story)}</p>
      </div>
    `;

    // OOP city: show interactive buildings
    if (m.buildings && m.buildings.length) {
      html += `<div class="glass pad mt-16">
        <h3 class="mb-8">🏙️ Interactive Buildings</h3>
        <p class="text-dim mb-16">Each building teaches one OOP concept through real-life analogy. Click a building to jump to its lesson.</p>
        <div class="city-grid">
          ${m.buildings.map((b, i) => `
            <div class="building" onclick="App.scrollToLesson(${i})">
              <div class="b-icon">${b.icon}</div>
              <h4>${b.name}</h4>
              <p>${b.concept}</p>
            </div>
          `).join('')}
        </div>
      </div>`;
    }

    // lessons
    html += `<div class="glass pad mt-16"><h3 class="mb-16">📚 Lessons</h3>`;
    m.lessons.forEach((L, i) => {
      html += `
        <div class="lesson" id="lesson-${i}">
          <h3>${i+1}. ${L.title}</h3>
          ${L.body.map(p => `<p>${p}</p>`).join('')}
          ${L.analogy ? `<div class="analogy"><h4>💡 REAL-LIFE ANALOGY</h4><p>${L.analogy}</p></div>` : ''}
          ${L.code ? Engine.codeBlockHTML(L.code) : ''}
        </div>
      `;
    });
    html += `</div>`;

    // exercises
    if (m.exercises && m.exercises.length) {
      html += `<div class="glass pad mt-16"><h3 class="mb-16">✏️ Practice Exercises</h3>`;
      m.exercises.forEach((ex, i) => {
        html += `
          <div class="review-item">
            <div class="q">${i+1}. ${ex.q}</div>
            <button class="btn btn-ghost btn-sm mt-8" onclick="App.toggleAns(this)">Show answer</button>
            <div class="hidden mt-8"><pre class="code-block">${Engine.highlight(ex.a)}</pre></div>
          </div>
        `;
      });
      html += `</div>`;
    }

    // actions: study the lesson, play the quiz, debugging challenge, boss battle
    html += `
      <div class="glass pad mt-16">
        <h3 class="mb-16">⚔️ Challenges</h3>
        <div class="flex gap-12" style="flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="App.startMissionQuiz('${m.id}', 'easy')">🎯 Quiz (Easy)</button>
          <button class="btn btn-primary" onclick="App.startMissionQuiz('${m.id}', 'medium')">🎯 Quiz (Medium)</button>
          <button class="btn btn-primary" onclick="App.startMissionQuiz('${m.id}', 'hard')">🎯 Quiz (Hard)</button>
          <button class="btn btn-purple" onclick="App.startBossBattle('${m.id}')">⚔️ Boss Battle (Random)</button>
          <button class="btn btn-ghost" onclick="App.startDebugChallenge('${m.id}')">🐞 Debug Challenge</button>
        </div>
        <p class="text-dim mt-16" style="font-size:.85rem;">Boss Battle: a randomized gauntlet of 15 questions across this mission's topics. Debug Challenge: only debugging &amp; predict-the-output questions.</p>
      </div>

      <div class="flex gap-12 mt-24" style="flex-wrap:wrap;">
        <button class="btn btn-ghost" onclick="App.go('missions')">⬅️ Back to Map</button>
      </div>
    `;

    body.innerHTML = html;
  },

  scrollToLesson(i) {
    const el = document.getElementById('lesson-' + i);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  toggleAns(btn) {
    const ans = btn.nextElementSibling;
    ans.classList.toggle('hidden');
    btn.textContent = ans.classList.contains('hidden') ? 'Show answer' : 'Hide answer';
  },

  startMissionQuiz(mid, difficulty) {
    this.go('solo');
    Solo.initSetup();
    const m = window.MISSIONS.find(x => x.id === mid);
    document.getElementById('soloMission').value = mid;
    // set difficulty pill
    document.querySelectorAll('#soloDiff .diff-pill').forEach(p => {
      p.classList.toggle('selected', p.dataset.diff === difficulty);
    });
    this.toast(`Ready! Mission: ${m.name} · ${difficulty}. Press Start Quest.`, 'info');
  },

  startBossBattle(mid) {
    const m = window.MISSIONS.find(x => x.id === mid);
    const pool = Engine.byCategory(m.category);
    if (!pool.length) { this.toast('No questions in this mission.', 'error'); return; }
    const questions = Engine.pickQuestions(pool, 15);
    // run as a solo-style run directly
    this.go('solo');
    Solo.initSetup();
    document.getElementById('soloMission').value = mid;
    document.querySelectorAll('#soloDiff .diff-pill').forEach(p => {
      p.classList.toggle('selected', p.dataset.diff === 'hard');
    });
    this.toast('⚔️ Boss Battle armed! Press Start Quest to begin.', 'info');
  },

  startDebugChallenge(mid) {
    const m = window.MISSIONS.find(x => x.id === mid);
    const pool = Engine.byCategory(m.category).filter(q => q.type === 'debug' || q.type === 'predict');
    if (!pool.length) { this.toast('No debug/predict questions in this mission.', 'error'); return; }
    this.go('solo');
    Solo.initSetup();
    document.getElementById('soloMission').value = mid;
    document.querySelectorAll('#soloDiff .diff-pill').forEach(p => {
      p.classList.toggle('selected', p.dataset.diff === 'medium');
    });
    this.toast('🐞 Debug Challenge ready! Press Start Quest.', 'info');
  },

  // ---------- question bank ----------
  prepBankFilters() {
    const srcSel = document.getElementById('bankSource');
    if (!srcSel.options.length || srcSel.options.length === 1) {
      Object.entries(window.SOURCES).forEach(([k, v]) => {
        const o = document.createElement('option');
        o.value = k; o.textContent = v;
        srcSel.appendChild(o);
      });
    }
    const catSel = document.getElementById('bankCategory');
    if (catSel.options.length <= 1) {
      Object.entries(window.CATEGORY_LABELS).forEach(([k, v]) => {
        const o = document.createElement('option'); o.value = k; o.textContent = v; catSel.appendChild(o);
      });
    }
    const typeSel = document.getElementById('bankType');
    if (typeSel.options.length <= 1) {
      Object.entries(window.TYPE_LABELS).forEach(([k, v]) => {
        const o = document.createElement('option'); o.value = k; o.textContent = v; typeSel.appendChild(o);
      });
    }
    const diffSel = document.getElementById('bankDiff');
    if (diffSel.options.length <= 1) {
      ['easy','medium','hard'].forEach(d => {
        const o = document.createElement('option'); o.value = d; o.textContent = window.DIFFICULTY_LABELS[d]; diffSel.appendChild(o);
      });
    }

    ['bankSource','bankCategory','bankType','bankDiff','bankSearch'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.dataset.bound) {
        el.addEventListener('input', () => this.renderBank());
        el.addEventListener('change', () => this.renderBank());
        el.dataset.bound = '1';
      }
    });
    const origBtn = document.getElementById('bankOrigOnly');
    if (origBtn && !origBtn.dataset.bound) {
      origBtn.onclick = () => {
        origBtn.classList.toggle('active');
        origBtn.dataset.active = origBtn.classList.contains('active') ? '1' : '';
        this.renderBank();
      };
      origBtn.dataset.bound = '1';
    }
    const clearBtn = document.getElementById('bankClearFilters');
    if (clearBtn && !clearBtn.dataset.bound) {
      clearBtn.onclick = () => {
        ['bankSource','bankCategory','bankType','bankDiff'].forEach(id => document.getElementById(id).value = 'any');
        document.getElementById('bankSearch').value = '';
        origBtn.classList.remove('active'); origBtn.dataset.active = '';
        this.renderBank();
      };
      clearBtn.dataset.bound = '1';
    }
  },

  renderBank() {
    this.prepBankFilters();
    const opts = {
      source: document.getElementById('bankSource').value,
      category: document.getElementById('bankCategory').value,
      type: document.getElementById('bankType').value,
      difficulty: document.getElementById('bankDiff').value,
      search: document.getElementById('bankSearch').value,
      originalOnly: document.getElementById('bankOrigOnly').dataset.active === '1'
    };
    const list = Engine.filter(opts);
    document.getElementById('bankCount').textContent = `${list.length} question${list.length===1?'':'s'}`;
    const el = document.getElementById('bankList');
    if (!list.length) {
      el.innerHTML = '<p class="text-dim">No questions match your filters.</p>';
      return;
    }
    el.innerHTML = list.map(q => `
      <div class="review-item">
        <div class="flex between center">
          <div class="q">#${q.id} · ${window.TYPE_LABELS[q.type]} · ${window.CATEGORY_LABELS[q.category]}</div>
          <span class="chip" style="font-size:.7rem;">${window.SOURCES[q.source]}</span>
        </div>
        <div class="q-meta mt-8">
          <span class="tag diff-${q.difficulty}">${window.DIFFICULTY_LABELS[q.difficulty]}</span>
          ${q.original ? '<span class="tag orig">⭐ ORIGINAL</span>' : '<span class="tag src" style="background:rgba(91,107,148,.14);color:var(--txt-faint);border-color:rgba(91,107,148,.3)">PRACTICE</span>'}
        </div>
        <div class="text-dim" style="margin:6px 0;">${Engine.esc(q.question)}</div>
        ${q.code ? Engine.codeBlockHTML(q.code) : ''}
        <button class="btn btn-ghost btn-sm mt-8" onclick="App.showQuestion('${q.id}')">View answer &amp; explanation</button>
      </div>
    `).join('');
  },

  showQuestion(qid) {
    const q = Engine.byId(qid);
    if (!q) return;
    let html = `
      <button class="close-x" onclick="App.closeModal()">✕</button>
      <h2>${window.TYPE_LABELS[q.type]} · ${window.CATEGORY_LABELS[q.category]}</h2>
      <div class="q-meta mt-8">
        <span class="tag src">${window.SOURCES[q.source]}</span>
        <span class="tag diff-${q.difficulty}">${window.DIFFICULTY_LABELS[q.difficulty]}</span>
        ${q.original ? '<span class="tag orig">⭐ ORIGINAL</span>' : '<span class="tag src" style="background:rgba(91,107,148,.14);color:var(--txt-faint);border-color:rgba(91,107,148,.3)">PRACTICE</span>'}
      </div>
      <div class="q-text mt-8">${Engine.esc(q.question)}</div>
      ${q.code ? Engine.codeBlockHTML(q.code) : ''}
    `;
    if (q.options && q.options.length) {
      html += `<div class="options">`;
      q.options.forEach((o, i) => {
        html += `<div class="opt ${i===q.answer?'correct':''}"><div class="marker">${String.fromCharCode(65+i)}</div><div class="text">${Engine.optionHTML(o)}</div></div>`;
      });
      html += `</div>`;
    } else if (q.reference) {
      html += `<div class="explain"><h4>REFERENCE ANSWER</h4><pre class="code-block">${Engine.highlight(q.reference)}</pre></div>`;
    }
    html += `
      <div class="explain mt-16"><h4>EXPLANATION (English)</h4><p>${Engine.esc(q.explanation)}</p></div>
      ${q.explanationAr ? `<div class="explain ar rtl mt-8"><h4>الشرح (عربي)</h4><p>${Engine.esc(q.explanationAr)}</p></div>` : ''}
      <div class="flex gap-12 mt-16">
        <button class="btn btn-ghost" onclick="App.toggleBookmarkQ('${q.id}', this)">🔖 Bookmark</button>
        <button class="btn btn-primary" onclick="App.closeModal()">Close</button>
      </div>
    `;
    this.openModal(html);
  },

  toggleBookmarkQ(qid, btn) {
    const added = Store.toggleBookmark(qid);
    btn.textContent = added ? '🔖 Bookmarked' : '🔖 Bookmark';
    this.toast(added ? 'Bookmarked.' : 'Removed.', 'info');
  },

  // ---------- profile ----------
  renderProfile() {
    const player = Store.getPlayer();
    const xp = Store.getXP();
    const lvl = Store.level();
    const next = Store.xpForNextLevel();
    const badges = Store.getBadges();
    const history = Store.getHistory();
    const bookmarks = Store.getBookmarks();
    const missions = Store.getMissions();

    const header = document.getElementById('profileHeader');
    header.innerHTML = `
      <div style="font-size:3rem;">${player.avatar || '🧑‍🚀'}</div>
      <div>
        <h2>${Engine.esc(player.name || 'Anonymous Explorer')}</h2>
        <p class="text-dim">Level ${lvl} · ${xp} XP</p>
        <div class="progress-bar mt-8" style="max-width:300px;">
          <div class="fill" style="width:${Math.min(100, next.intoLevel/next.span*100)}%"></div>
        </div>
        <p class="text-dim" style="font-size:.78rem; margin-top:4px;">${next.intoLevel}/${next.span} XP to Level ${lvl+1}</p>
      </div>
    `;

    // badges
    const bEl = document.getElementById('profileBadges');
    bEl.innerHTML = Engine.BADGES.map(b => {
      const earned = badges.includes(b.id);
      return `<div class="badge-cell ${earned?'earned':'locked'}" title="${b.desc}">
        <div class="b-icon">${b.icon}</div>
        <div class="b-name">${b.name}</div>
        <div class="text-dim" style="font-size:.7rem; margin-top:4px;">${b.desc}</div>
      </div>`;
    }).join('');

    // history
    const hEl = document.getElementById('profileHistory');
    if (!history.length) {
      hEl.innerHTML = '<p class="text-dim">No sessions yet.</p>';
    } else {
      hEl.innerHTML = history.slice(0, 20).map(h => `
        <div class="lb-row">
          <div class="rank">${h.mode === 'solo' ? '🧑‍🚀' : h.mode === 'team' ? '👥' : '🎙️'}</div>
          <div class="name">${Engine.esc(h.name || h.missionName || (h.format ? 'Team game' : 'Host session'))}
            <small>${h.mode === 'solo' ? Engine.esc(h.missionName || '') + ' · ' + window.DIFFICULTY_LABELS[h.difficulty] : h.mode === 'team' ? 'Team · ' + (h.format||'') : 'Host session'} · ${new Date(h.at).toLocaleDateString()}</small>
          </div>
          <div class="pts">${h.accuracy != null ? Math.round(h.accuracy*100)+'%' : (h.score ?? '—')}</div>
        </div>
      `).join('');
    }

    // bookmarks
    const bmEl = document.getElementById('profileBookmarks');
    if (!bookmarks.length) {
      bmEl.innerHTML = '<p class="text-dim">No bookmarks yet.</p>';
    } else {
      bmEl.innerHTML = bookmarks.slice(0, 20).map(qid => {
        const q = Engine.byId(qid);
        if (!q) return '';
        return `<div class="lb-row">
          <div class="rank">🔖</div>
          <div class="name">${window.TYPE_LABELS[q.type]} · ${window.CATEGORY_LABELS[q.category]}<small>${Engine.esc(q.question).slice(0,80)}...</small></div>
          <button class="btn btn-ghost btn-sm" onclick="App.showQuestion('${q.id}')">View</button>
        </div>`;
      }).join('');
    }

    this.updateXPChip();
  },

  // ---------- export / import / reset ----------
  exportResults() {
    const data = Store.exportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `javaquest_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('Exported all progress to JSON.', 'success');
  },

  importResults(ev) {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        Store.importJSON(e.target.result);
        this.toast('Imported progress successfully.', 'success');
        this.updateXPChip();
        this.renderHome();
        this.renderMissionMap();
      } catch (err) {
        this.toast('Import failed: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    ev.target.value = '';
  },

  resetProgress() {
    this.openModal(`
      <h2>⚠️ Reset All Progress?</h2>
      <p class="text-dim mb-16">This will permanently erase your player profile, XP, badges, mission progress, bookmarks, team configs, and history from this device. This cannot be undone.</p>
      <p class="text-dim mb-16">Tip: <b>Export</b> first if you want a backup.</p>
      <div class="flex gap-12">
        <button class="btn btn-danger" id="confirmReset">Yes, erase everything</button>
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
      </div>
    `);
    document.getElementById('confirmReset').onclick = () => {
      Store.resetProgress();
      this.closeModal();
      this.toast('All progress reset.', 'info');
      this.updateXPChip();
      this.renderHome();
      this.renderMissionMap();
    };
  },

  // ---------- toast ----------
  toast(msg, type = 'info') {
    const stack = document.getElementById('toastStack');
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = msg;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(40px)';
      el.style.transition = 'all .3s ease';
      setTimeout(() => el.remove(), 300);
    }, 2800);
  },

  // ---------- modal ----------
  openModal(html) {
    const bg = document.getElementById('modalBg');
    const body = document.getElementById('modalBody');
    body.innerHTML = html;
    bg.classList.add('show');
  },
  closeModal() {
    document.getElementById('modalBg').classList.remove('show');
  },

  // ---------- confetti ----------
  _confettiCtx: null,
  _confettiParts: [],
  _confettiRAF: null,
  confetti() {
    const canvas = document.getElementById('confetti');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    this._confettiCtx = ctx;
    const colors = ['#00f0ff','#8b5cf6','#d946ef','#ffd166','#22d39a','#ff5470'];
    this._confettiParts = [];
    for (let i = 0; i < 160; i++) {
      this._confettiParts.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 4,
        size: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    if (this._confettiRAF) cancelAnimationFrame(this._confettiRAF);
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      this._confettiParts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        p.vy += 0.05;
        if (p.y < canvas.height + 20) alive++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (alive > 0) {
        this._confettiRAF = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    tick();
  }
};

// boot
document.addEventListener('DOMContentLoaded', () => App.init());
