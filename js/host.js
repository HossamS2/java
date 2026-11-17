/* =========================================================
   host.js — HOST MODE (presentation & screen sharing)
   One question at a time, reveal controls, student picker,
   manual scoring, live leaderboard, fullscreen, final podium.
   No devices connect — students answer verbally.
   ========================================================= */

const Host = {
  state: null,

  initSetup() {
    const cat = document.getElementById('hostCategory');
    cat.innerHTML = '<option value="any">All categories</option>' +
      Object.entries(window.CATEGORY_LABELS).map(([k,v]) => `<option value="${k}">${v}</option>`).join('');

    // restore roster
    this.renderRoster(Store.getHostRoster());

    document.getElementById('hostAddBtn').onclick = () => this.addName();
    document.getElementById('hostAddName').onkeydown = (e) => { if (e.key === 'Enter') this.addName(); };
    document.getElementById('hostClearRoster').onclick = () => {
      Store.setHostRoster([]);
      this.renderRoster([]);
    };
    document.getElementById('hostFullscreen').onclick = () => this.toggleFullscreen();
    document.getElementById('hostStart').onclick = () => this.start();
  },

  addName() {
    const inp = document.getElementById('hostAddName');
    const v = inp.value.trim();
    if (!v) return;
    const arr = Store.getHostRoster();
    arr.push(v);
    Store.setHostRoster(arr);
    inp.value = '';
    this.renderRoster(arr);
  },

  renderRoster(arr) {
    const el = document.getElementById('hostRoster');
    if (!arr.length) {
      el.innerHTML = '<p class="text-dim" style="grid-column:1/-1; padding:10px; text-align:center;">No roster yet — add students above or skip and type names during the session.</p>';
      return;
    }
    el.innerHTML = arr.map((n, i) => `
      <div class="student-cell" data-i="${i}">
        <div>${Engine.esc(n)}</div>
        <button class="btn btn-danger btn-sm mt-8" style="padding:3px 8px;" data-rm="${i}">remove</button>
      </div>
    `).join('');
    el.querySelectorAll('[data-rm]').forEach(b => {
      b.onclick = () => {
        const i = parseInt(b.dataset.rm, 10);
        arr.splice(i, 1);
        Store.setHostRoster(arr);
        this.renderRoster(arr);
      };
    });
  },

  start() {
    const category = document.getElementById('hostCategory').value;
    const difficulty = document.getElementById('hostDifficulty').value;
    const order = document.getElementById('hostOrder').value;

    let pool = Engine.filter({ category, difficulty });
    if (pool.length === 0) pool = Engine.filter({ category });
    if (pool.length === 0) { App.toast('No questions available.', 'error'); return; }

    if (order === 'rand') pool = Engine.shuffle(pool);
    // else sequential

    const scores = Store.getHostScores() || {};

    this.state = {
      mode: 'host',
      pool,
      idx: 0,
      roster: Store.getHostRoster(),
      scores,            // name -> points
      picked: null,      // current picked student/team name
      revealedAnswer: false,
      revealedExplain: false,
      history: []
    };

    Store.saveSession(this.state);
    document.getElementById('hostSetup').classList.add('hidden');
    document.getElementById('hostPlay').classList.remove('hidden');
    this.render();
  },

  backToSetup() {
    document.getElementById('hostPlay').classList.add('hidden');
    document.getElementById('hostSetup').classList.remove('hidden');
  },

  render() {
    const S = this.state;
    const q = S.pool[S.idx];
    if (!q) { this.end(); return; }

    // HUD
    document.getElementById('hostHud').innerHTML = `
      <div class="stat"><span class="lbl">Question</span><span class="val">${S.idx+1}/${S.pool.length}</span></div>
      <div class="stat"><span class="lbl">Category</span><span class="val">${window.CATEGORY_LABELS[q.category]}</span></div>
      <div class="stat"><span class="lbl">Difficulty</span><span class="val">${window.DIFFICULTY_LABELS[q.difficulty]}</span></div>
      <div class="stat"><span class="lbl">Source</span><span class="val">${window.SOURCES[q.source]}</span></div>
      <div class="stat"><span class="lbl">Picked</span><span class="val">${S.picked ? Engine.esc(S.picked) : '—'}</div>
    `;

    // Question card
    const card = document.getElementById('hostQCard');
    let html = `
      <div class="q-meta">
        <span class="tag cat">${window.CATEGORY_LABELS[q.category]}</span>
        <span class="tag diff-${q.difficulty}">${window.DIFFICULTY_LABELS[q.difficulty]}</span>
        <span class="tag src">${window.SOURCES[q.source]}</span>
        <span class="tag type">${window.TYPE_LABELS[q.type]}</span>
        ${q.original ? '<span class="tag orig">⭐ ORIGINAL</span>' : ''}
      </div>
      <div class="host-qtext">${Engine.esc(q.question)}</div>
      ${Engine.codeBlockHTML(q.code)}
    `;

    if (S.revealedAnswer) {
      if (q.options && q.options.length) {
        html += `<div class="options">`;
        q.options.forEach((o, i) => {
          html += `<div class="opt ${i===q.answer?'correct':''}"><div class="marker">${String.fromCharCode(65+i)}</div><div class="text">${Engine.optionHTML(o)}</div></div>`;
        });
        html += `</div>`;
      } else if (q.reference) {
        html += `<div class="explain"><h4>REFERENCE ANSWER</h4><pre class="code-block">${Engine.highlight(q.reference)}</pre></div>`;
      }
    } else {
      html += `<div class="explain" style="background:rgba(0,240,255,0.06); border-left-color:var(--cyan);"><h4 style="color:var(--cyan);">ANSWER HIDDEN</h4><p class="text-dim">Tap "Reveal Answer" when students are ready.</p></div>`;
    }

    if (S.revealedExplain) {
      html += `<div class="explain mt-16"><h4>EXPLANATION (English)</h4><p>${Engine.esc(q.explanation)}</p></div>`;
      if (q.explanationAr) html += `<div class="explain ar rtl mt-8"><h4>الشرح (عربي)</h4><p>${Engine.esc(q.explanationAr)}</p></div>`;
    }

    card.innerHTML = html;

    // picked name + award-for
    document.getElementById('hostPickedName').textContent = S.picked ? `🎯 ${S.picked}` : '';
    document.getElementById('hostAwardFor').textContent = S.picked || '—';

    // roster live
    this.renderRosterLive();
    this.renderLeaderboard();

    // controls
    document.getElementById('hostReveal').onclick = () => { S.revealedAnswer = true; Store.saveSession(S); this.render(); };
    document.getElementById('hostExplain').onclick = () => { S.revealedExplain = true; Store.saveSession(S); this.render(); };
    document.getElementById('hostNext').onclick = () => this.next();
    document.getElementById('hostPrev').onclick = () => this.prev();
    document.getElementById('hostRandom').onclick = () => this.random();
    document.getElementById('hostPickRandom').onclick = () => this.pickRandom();
    document.getElementById('hostClearPick').onclick = () => { S.picked = null; Store.saveSession(S); this.render(); };
    document.getElementById('hostExitFullscreen').onclick = () => this.toggleFullscreen();
    document.getElementById('hostEnd').onclick = () => {
      if (confirm('End the host session and show the final podium?')) this.end();
    };
    document.querySelectorAll('#hostPlay [data-award]').forEach(b => {
      b.onclick = () => this.award(parseInt(b.dataset.award, 10));
    });

    Store.setHostScores(S.scores);
  },

  renderRosterLive() {
    const S = this.state;
    const el = document.getElementById('hostRosterLive');
    if (!S.roster.length) {
      el.innerHTML = '<p class="text-dim" style="grid-column:1/-1; text-align:center; padding:10px;">No roster. Tap a student cell to add a quick name, or use Random Pick after adding.</p>';
      el.innerHTML += `<div class="flex gap-8" style="grid-column:1/-1;">
        <input type="text" id="hostQuickAdd" placeholder="quick add name..." style="flex:1; padding:8px; border-radius:8px; background:rgba(5,8,22,.6); border:1px solid var(--glass-brd); color:var(--txt);" />
        <button class="btn btn-ghost btn-sm" id="hostQuickAddBtn">Add</button>
      </div>`;
      const inp = document.getElementById('hostQuickAdd');
      const doAdd = () => {
        const v = inp.value.trim(); if (!v) return;
        S.roster.push(v);
        if (!(v in S.scores)) S.scores[v] = 0;
        Store.setHostRoster(S.roster);
        Store.saveSession(S);
        this.render();
      };
      document.getElementById('hostQuickAddBtn').onclick = doAdd;
      inp.onkeydown = (e) => { if (e.key === 'Enter') doAdd(); };
      return;
    }
    el.innerHTML = S.roster.map((n, i) => `
      <div class="student-cell ${S.picked===n?'picked':''}" data-pick="${Engine.esc(n)}">
        ${Engine.esc(n)}
        <div class="text-gold" style="margin-top:4px;">${S.scores[n] || 0} pts</div>
      </div>
    `).join('');
    el.querySelectorAll('[data-pick]').forEach(c => {
      c.onclick = () => { S.picked = c.dataset.pick; Store.saveSession(S); this.render(); };
    });
  },

  renderLeaderboard() {
    const S = this.state;
    const entries = Object.entries(S.scores).sort((a, b) => b[1] - a[1]);
    const el = document.getElementById('hostLeaderboard');
    if (!entries.length) {
      el.innerHTML = '<p class="text-dim">Award points to see standings.</p>';
      return;
    }
    el.innerHTML = entries.map(([name, pts], i) => `
      <div class="lb-row ${i<3?'r'+(i+1):''}">
        <div class="rank">${i+1}</div>
        <div class="name">${Engine.esc(name)}${S.picked===name?' <span class="chip gold" style="font-size:.7rem; margin-left:6px;">picked</span>':''}</div>
        <div class="pts">${pts}</div>
      </div>
    `).join('');
  },

  pickRandom() {
    const S = this.state;
    if (!S.roster.length) { App.toast('Add students to the roster first.', 'info'); return; }
    S.picked = S.roster[Math.floor(Math.random() * S.roster.length)];
    Store.saveSession(S);
    this.render();
    App.toast(`🎲 Picked: ${S.picked}`, 'info');
  },

  award(amount) {
    const S = this.state;
    if (!S.picked) { App.toast('Pick a student/team first.', 'info'); return; }
    if (!(S.picked in S.scores)) S.scores[S.picked] = 0;
    S.scores[S.picked] += amount;
    if (S.scores[S.picked] < 0) S.scores[S.picked] = 0;
    Store.saveSession(S);
    S.history.push({ name: S.picked, amount, qid: S.pool[S.idx].id });
    App.toast(`${S.picked}: ${amount>0?'+':''}${amount} → ${S.scores[S.picked]} pts`, amount > 0 ? 'success' : 'error');
    this.render();
  },

  next() {
    const S = this.state;
    S.idx = Math.min(S.pool.length - 1, S.idx + 1);
    S.revealedAnswer = false; S.revealedExplain = false;
    Store.saveSession(S);
    this.render();
  },
  prev() {
    const S = this.state;
    S.idx = Math.max(0, S.idx - 1);
    S.revealedAnswer = false; S.revealedExplain = false;
    Store.saveSession(S);
    this.render();
  },
  random() {
    const S = this.state;
    let n;
    do { n = Math.floor(Math.random() * S.pool.length); } while (n === S.idx && S.pool.length > 1);
    S.idx = n;
    S.revealedAnswer = false; S.revealedExplain = false;
    Store.saveSession(S);
    this.render();
  },

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  },

  end() {
    const S = this.state;
    const ranked = Object.entries(S.scores).map(([name, pts]) => ({ name, pts })).sort((a, b) => b.pts - a.pts);
    const comp = {
      mode: 'host',
      qCount: S.pool.length,
      questionsAsked: S.history.length,
      standings: ranked,
      at: Date.now()
    };
    Store.addCompetition(comp);

    const missionsDone = window.MISSIONS.filter(m => Store.getMission(m.id)?.completed).length;
    const earned = Engine.evaluateBadges({
      missionsDone, maxStreak: 0, xp: Store.getXP(),
      modeFlags: { host: true }
    });
    earned.forEach(id => Store.addBadge(id));

    this.renderPodium(ranked);
    Store.clearSession();
    App.confetti();
  },

  renderPodium(ranked) {
    document.getElementById('hostPlay').classList.add('hidden');
    const box = document.createElement('div');
    box.className = 'glass pad';
    box.style.marginTop = '20px';
    const top3 = ranked.slice(0, 3);
    const slots = [top3[1] || null, top3[0] || null, top3[2] || null];

    box.innerHTML = `
      <h2 class="text-center mb-16">🏆 Final Podium</h2>
      ${top3.length ? `<div class="podium">
        ${slots.map((t, i) => t ? `
          <div class="slot p${i+1}">
            <div class="crown">${i===0?'👑':i===1?'🥈':'🥉'}</div>
            <div class="pname">${Engine.esc(t.name)}</div>
            <div class="pts">${t.pts} pts</div>
          </div>` : `<div class="slot p${i+1}"></div>`).join('')}
      </div>` : '<p class="text-dim text-center">No scores were awarded this session.</p>'}

      ${ranked.length ? `<div class="mt-24"><h3 class="mb-16">Full Standings</h3><div class="leaderboard">
        ${ranked.map((t, i) => `<div class="lb-row ${i<3?'r'+(i+1):''}"><div class="rank">${i+1}</div><div class="name">${Engine.esc(t.name)}</div><div class="pts">${t.pts}</div></div>`).join('')}
      </div></div>` : ''}

      <div class="flex gap-12 mt-24" style="flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="Host.backToSetup()">🔁 New Session</button>
        <button class="btn btn-ghost" id="hostExportBtn">⬇️ Download Results (JSON)</button>
        <button class="btn btn-ghost" onclick="App.go('home')">🏠 Home</button>
      </div>
    `;

    // place into host screen
    const screen = document.getElementById('screen-host');
    // remove any prior podium
    screen.querySelectorAll('.glass.podium-result').forEach(e => e.remove());
    box.classList.add('podium-result');
    screen.appendChild(box);

    document.getElementById('hostExportBtn').onclick = () => {
      const blob = new Blob([JSON.stringify({ mode: 'host', standings: ranked, at: Date.now() }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `javaquest_host_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      App.toast('Results downloaded.', 'success');
    };
  }
};

window.Host = Host;
