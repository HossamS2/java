/* =========================================================
   solo.js — SOLO MODE
   Setup (name, avatar, mission, difficulty) -> gameplay ->
   results report -> mistakes review -> bookmarks.
   ========================================================= */

const Solo = {
  state: null,

  AVATARS: ['🧑‍🚀','👩‍💻','🧙','🦸','🥷','🤖','👾','🦊','🐉','🦉','🦁','🐯'],

  // ---------- setup ----------
  initSetup() {
    const player = Store.getPlayer();
    const nameEl = document.getElementById('soloName');
    if (nameEl && !nameEl.value) nameEl.value = player.name || '';

    // avatars
    const grid = document.getElementById('avatarGrid');
    if (grid) {
      grid.innerHTML = this.AVATARS.map((a, i) =>
        `<div class="avatar ${player.avatar === a ? 'selected' : ''}" data-avatar="${a}">${a}</div>`
      ).join('');
      grid.querySelectorAll('.avatar').forEach(el => {
        el.addEventListener('click', () => {
          grid.querySelectorAll('.avatar').forEach(x => x.classList.remove('selected'));
          el.classList.add('selected');
        });
      });
    }

    // missions
    const sel = document.getElementById('soloMission');
    if (sel) {
      sel.innerHTML = '<option value="">— Select a mission —</option>' +
        window.MISSIONS.map(m => {
          const unlocked = Store.isMissionUnlocked(m.id);
          const done = Store.getMission(m.id);
          const status = done?.completed ? '✅' : (unlocked ? '🔓' : '🔒');
          return `<option value="${m.id}" ${unlocked ? '' : 'disabled'}>${status} ${m.name}</option>`;
        }).join('');
    }

    // difficulty pills
    document.querySelectorAll('#soloDiff .diff-pill').forEach(p => {
      p.onclick = () => {
        document.querySelectorAll('#soloDiff .diff-pill').forEach(x => x.classList.remove('selected'));
        p.classList.add('selected');
      };
    });

    // buttons
    document.getElementById('soloStart').onclick = () => this.start();
    document.getElementById('soloReviewMistakes').onclick = () => this.showMistakesReview();
    document.getElementById('soloBookmarks').onclick = () => this.showBookmarks();
  },

  getSelectedAvatar() {
    const el = document.querySelector('#avatarGrid .avatar.selected');
    return el ? el.dataset.avatar : this.AVATARS[0];
  },
  getSelectedDifficulty() {
    const el = document.querySelector('#soloDiff .diff-pill.selected');
    return el ? el.dataset.diff : 'medium';
  },

  start() {
    const name = document.getElementById('soloName').value.trim();
    const avatar = this.getSelectedAvatar();
    const missionId = document.getElementById('soloMission').value;
    const difficulty = this.getSelectedDifficulty();

    if (!name) { App.toast('Please enter your name.', 'error'); return; }
    if (!missionId) { App.toast('Please select a mission.', 'error'); return; }

    Store.setPlayer({ name, avatar });

    const mission = window.MISSIONS.find(m => m.id === missionId);
    const diffCfg = Engine.difficultyConfig(difficulty);
    const pool = Engine.byCategory(mission.category);
    if (pool.length === 0) { App.toast('No questions in this mission yet.', 'error'); return; }
    const questions = Engine.pickQuestions(pool, diffCfg.count);

    this.state = {
      mode: 'solo',
      name, avatar, missionId,
      missionName: mission.name,
      missionCategory: mission.category,
      difficulty,
      timePerQ: diffCfg.time,
      multiplier: diffCfg.multiplier,
      questions,
      prepared: questions.map(q => Engine.prepareQuestion(q, { randomizeOptions: true })),
      idx: 0,
      results: [],   // { qid, correct, skipped, timeLeft, your, answer }
      score: 0,
      streak: 0,
      maxStreak: 0,
      startTime: Date.now(),
      selectedOption: -1,
      answered: false,
      timer: null
    };

    Store.saveSession(this.state);
    this.showPlay();
    this.renderQuestion();
  },

  // ---------- gameplay ----------
  showPlay() {
    document.getElementById('soloSetup').classList.add('hidden');
    document.getElementById('soloMistakesView').classList.add('hidden');
    document.getElementById('soloBookmarksView').classList.add('hidden');
    document.getElementById('soloResults').classList.add('hidden');
    document.getElementById('soloPlay').classList.remove('hidden');
  },

  showSetup() {
    document.getElementById('soloPlay').classList.add('hidden');
    document.getElementById('soloResults').classList.add('hidden');
    document.getElementById('soloMistakesView').classList.add('hidden');
    document.getElementById('soloBookmarksView').classList.add('hidden');
    document.getElementById('soloSetup').classList.remove('hidden');
  },

  renderQuestion() {
    const S = this.state;
    const prep = S.prepared[S.idx];
    const q = prep.q;
    const total = S.questions.length;
    const done = S.idx;

    // HUD
    const hud = document.getElementById('soloHud');
    hud.innerHTML = `
      <div class="stat"><span class="lbl">Player</span><span class="val">${S.avatar} ${Engine.esc(S.name)}</span></div>
      <div class="stat"><span class="lbl">Mission</span><span class="val">${Engine.esc(S.missionName)}</span></div>
      <div class="stat"><span class="lbl">Question</span><span class="val">${done + 1}/${total}</span></div>
      <div class="stat score"><span class="lbl">Score</span><span class="val">${S.score}</span></div>
      <div class="stat streak"><span class="lbl">Streak</span><span class="val">🔥 ${S.streak}</span></div>
      ${S.timePerQ > 0 ? `<div class="timer-ring" id="soloTimerRing">
        <svg width="64" height="64"><circle class="bg" cx="32" cy="32" r="28" stroke-width="6" fill="none"/>
        <circle class="fg" cx="32" cy="32" r="28" stroke-width="6" fill="none"
          stroke-dasharray="175.9" stroke-dashoffset="0" id="soloTimerArc"/></svg>
        <div class="txt" id="soloTimerTxt">${S.timePerQ}</div></div>` : ''}
      <div class="progress-bar" style="flex:1; min-width:160px;"><div class="fill" style="width:${(done/total)*100}%"></div></div>
    `;

    // Question card
    const card = document.getElementById('soloQCard');
    let html = `
      <div class="q-meta">
        <span class="tag cat">${window.CATEGORY_LABELS[q.category]}</span>
        <span class="tag diff-${q.difficulty}">${window.DIFFICULTY_LABELS[q.difficulty]}</span>
        <span class="tag src">${window.SOURCES[q.source]}</span>
        <span class="tag type">${window.TYPE_LABELS[q.type]}</span>
        ${q.original ? '<span class="tag orig">⭐ ORIGINAL</span>' : '<span class="tag src" style="background:rgba(91,107,148,.14);color:var(--txt-faint);border-color:rgba(91,107,148,.3)">PRACTICE</span>'}
      </div>
      <div class="q-text">${Engine.esc(q.question)}</div>
      ${Engine.codeBlockHTML(q.code)}
    `;

    if (prep.isOptionBased) {
      html += `<div class="options" id="soloOptions">`;
      prep.displayOptions.forEach((opt, i) => {
        html += `<div class="opt" data-i="${i}"><div class="marker">${String.fromCharCode(65 + i)}</div><div class="text">${Engine.optionHTML(opt)}</div></div>`;
      });
      html += `</div>`;
    } else {
      // open-ended: write / explain
      html += `
        <div class="field mt-16">
          <label>Your answer (then reveal the reference to self-grade):</label>
          <textarea id="soloOpenAnswer" placeholder="Type your solution or explanation..." rows="6"></textarea>
        </div>
        <button class="btn btn-primary mt-8" id="soloRevealOpen">📖 Reveal Reference Answer</button>
        <div id="soloOpenReveal" class="hidden mt-16"></div>
        <div class="flex gap-12 mt-16">
          <button class="btn btn-ghost" id="soloSelfCorrect">✅ I got it right</button>
          <button class="btn btn-ghost" id="soloSelfWrong">❌ I missed it</button>
        </div>
      `;
    }

    html += `
      <div id="soloFeedback"></div>
      <div id="soloExplain" class="hidden"></div>
    `;
    card.innerHTML = html;

    // bind
    S.selectedOption = -1;
    S.answered = false;

    if (prep.isOptionBased) {
      card.querySelectorAll('#soloOptions .opt').forEach(el => {
        el.addEventListener('click', () => {
          if (S.answered) return;
          this.chooseOption(parseInt(el.dataset.i, 10));
        });
      });
    } else {
      document.getElementById('soloRevealOpen').onclick = () => this.revealOpen();
      document.getElementById('soloSelfCorrect').onclick = () => this.gradeOpen(true);
      document.getElementById('soloSelfWrong').onclick = () => this.gradeOpen(false);
    }

    document.getElementById('soloNext').onclick = () => this.next();
    document.getElementById('soloSkip').onclick = () => this.skip();
    document.getElementById('soloBookmark').onclick = () => this.toggleBookmark();
    document.getElementById('soloQuit').onclick = () => {
      if (confirm('Quit this quest? Your progress so far will be saved as a partial result.')) this.finish(true);
    };

    // start timer
    if (S.timer) S.timer.stop();
    if (S.timePerQ > 0) {
      const total_t = S.timePerQ;
      S.timer = Engine.startTimer(total_t,
        (rem) => {
          const ring = document.getElementById('soloTimerRing');
          const txt = document.getElementById('soloTimerTxt');
          const arc = document.getElementById('soloTimerArc');
          if (txt) txt.textContent = rem;
          if (arc) {
            const circ = 175.9;
            arc.setAttribute('stroke-dashoffset', circ * (1 - rem / total_t));
          }
          if (ring) ring.classList.toggle('danger', rem <= 5);
        },
        () => { if (!S.answered) this.timeOut(); }
      );
    }
  },

  chooseOption(i) {
    const S = this.state;
    if (S.answered) return;
    S.answered = true;
    if (S.timer) S.timer.stop();
    const prep = S.prepared[S.idx];
    const correct = i === prep.correctIndex;
    const timeLeft = S.timer ? S.timer.getRemaining() : 0;

    // mark UI
    const card = document.getElementById('soloQCard');
    const opts = card.querySelectorAll('#soloOptions .opt');
    opts.forEach((el, idx) => {
      el.classList.remove('selected');
      if (idx === prep.correctIndex) el.classList.add('correct');
      if (idx === i && !correct) el.classList.add('wrong');
    });

    // feedback
    const fb = document.getElementById('soloFeedback');
    fb.className = 'feedback ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = (correct ? '✅ Correct!' : '❌ Wrong.') +
      (correct ? '' : ` Correct answer: <b>${Engine.optionHTML(prep.displayOptions[prep.correctIndex])}</b>`);
    this.showExplanation();

    // record
    S.results.push({
      qid: prep.q.id,
      correct,
      skipped: false,
      timeLeft,
      your: i,
      answer: prep.correctIndex
    });
    if (correct) {
      const pts = Math.round(10 * S.multiplier);
      S.score += pts;
      S.streak++;
      if (S.streak > S.maxStreak) S.maxStreak = S.streak;
    } else {
      S.streak = 0;
    }
    Store.saveSession(S);
    this.refreshHudLite();
  },

  revealOpen() {
    const S = this.state;
    const prep = S.prepared[S.idx];
    const q = prep.q;
    const box = document.getElementById('soloOpenReveal');
    box.classList.remove('hidden');
    box.innerHTML = `
      <div class="explain">
        <h4>REFERENCE ANSWER</h4>
        <pre class="code-block">${Engine.highlight(q.reference || '')}</pre>
      </div>
    `;
    document.getElementById('soloSelfCorrect').classList.remove('hidden');
    document.getElementById('soloSelfWrong').classList.remove('hidden');
  },

  gradeOpen(correct) {
    const S = this.state;
    if (S.answered) return;
    S.answered = true;
    if (S.timer) S.timer.stop();
    const prep = S.prepared[S.idx];
    S.results.push({ qid: prep.q.id, correct, skipped: false, timeLeft: 0, your: -1, answer: -1 });
    if (correct) {
      const pts = Math.round(10 * S.multiplier);
      S.score += pts;
      S.streak++;
      if (S.streak > S.maxStreak) S.maxStreak = S.streak;
    } else {
      S.streak = 0;
    }
    const fb = document.getElementById('soloFeedback');
    fb.className = 'feedback ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = correct ? '✅ Marked correct.' : '❌ Marked incorrect — see the reference above.';
    Store.saveSession(S);
    this.refreshHudLite();
  },

  timeOut() {
    const S = this.state;
    if (S.answered) return;
    S.answered = true;
    const prep = S.prepared[S.idx];
    const card = document.getElementById('soloQCard');
    if (prep.isOptionBased) {
      card.querySelectorAll('#soloOptions .opt').forEach((el, idx) => {
        if (idx === prep.correctIndex) el.classList.add('correct');
      });
    }
    const fb = document.getElementById('soloFeedback');
    fb.className = 'feedback wrong';
    fb.innerHTML = '⏰ Time up! Correct answer shown above.';
    this.showExplanation();
    S.results.push({ qid: prep.q.id, correct: false, skipped: false, timeLeft: 0, your: -1, answer: prep.correctIndex });
    S.streak = 0;
    Store.saveSession(S);
    this.refreshHudLite();
  },

  showExplanation() {
    const S = this.state;
    const prep = S.prepared[S.idx];
    const q = prep.q;
    const ex = document.getElementById('soloExplain');
    ex.classList.remove('hidden');
    ex.innerHTML = `
      <div class="explain">
        <h4>EXPLANATION (English)</h4>
        <p>${Engine.esc(q.explanation)}</p>
      </div>
      ${q.explanationAr ? `<div class="explain ar rtl"><h4>الشرح (عربي)</h4><p>${Engine.esc(q.explanationAr)}</p></div>` : ''}
    `;
  },

  refreshHudLite() {
    const S = this.state;
    const scoreEl = document.querySelector('#soloHud .stat.score .val');
    const streakEl = document.querySelector('#soloHud .stat.streak .val');
    if (scoreEl) scoreEl.textContent = S.score;
    if (streakEl) streakEl.textContent = '🔥 ' + S.streak;
  },

  next() {
    const S = this.state;
    if (!S.answered) {
      // allow skip-like advance only if they answered; otherwise prompt
      App.toast('Answer or skip the question first.', 'info');
      return;
    }
    S.idx++;
    Store.saveSession(S);
    if (S.idx >= S.questions.length) {
      this.finish(false);
    } else {
      this.renderQuestion();
    }
  },

  skip() {
    const S = this.state;
    if (S.answered) { this.next(); return; }
    if (S.timer) S.timer.stop();
    S.answered = true;
    const prep = S.prepared[S.idx];
    const card = document.getElementById('soloQCard');
    if (prep.isOptionBased) {
      card.querySelectorAll('#soloOptions .opt').forEach((el, idx) => {
        if (idx === prep.correctIndex) el.classList.add('correct');
      });
    }
    const fb = document.getElementById('soloFeedback');
    fb.className = 'feedback wrong';
    fb.innerHTML = '⏭️ Skipped. Correct answer shown above.';
    this.showExplanation();
    S.results.push({ qid: prep.q.id, correct: false, skipped: true, timeLeft: 0, your: -1, answer: prep.correctIndex });
    S.streak = 0;
    Store.saveSession(S);
    this.refreshHudLite();
  },

  toggleBookmark() {
    const S = this.state;
    const qid = S.prepared[S.idx].q.id;
    const added = Store.toggleBookmark(qid);
    App.toast(added ? '🔖 Bookmarked.' : 'Removed bookmark.', 'info');
  },

  // ---------- results ----------
  finish(partial) {
    const S = this.state;
    if (S.timer) S.timer.stop();
    const total = S.questions.length;
    const correct = S.results.filter(r => r.correct).length;
    const wrong = S.results.filter(r => !r.correct && !r.skipped).length;
    const skipped = S.results.filter(r => r.skipped).length;
    const accuracy = total > 0 ? correct / total : 0;
    const xpGained = correct * 12;
    Store.addXP(xpGained);

    const mistakes = S.results.filter(r => !r.correct).map(r => ({
      qid: r.qid, your: r.your, correct: r.answer
    }));

    const result = {
      mode: 'solo',
      name: S.name,
      avatar: S.avatar,
      missionId: S.missionId,
      missionName: S.missionName,
      difficulty: S.difficulty,
      total, correct, wrong, skipped,
      score: S.score,
      accuracy,
      xpGained,
      maxStreak: S.maxStreak,
      mistakes,
      duration: Math.round((Date.now() - S.startTime) / 1000),
      partial
    };

    Store.recordMissionResult(S.missionId, result);
    Store.addHistory(result);

    // badges
    const missionsDone = window.MISSIONS.filter(m => Store.getMission(m.id)?.completed).length;
    const earned = Engine.evaluateBadges({
      missionsDone,
      maxStreak: S.maxStreak,
      xp: Store.getXP(),
      perfect: accuracy === 1,
      modeFlags: {}
    });
    let newBadges = [];
    earned.forEach(id => { if (Store.addBadge(id)) newBadges.push(id); });

    App.updateXPChip();
    this.renderResults(result, newBadges);
    Store.clearSession();
    if (accuracy >= 0.7) App.confetti();
    App.refreshMissionMap();
  },

  renderResults(R, newBadges) {
    document.getElementById('soloPlay').classList.add('hidden');
    const box = document.getElementById('soloResults');
    box.classList.remove('hidden');

    const pct = Math.round(R.accuracy * 100);
    const weak = Engine.weakTopics(R.mistakes);
    const passMsg = pct >= 70 ? '🏆 Mission Complete!' : (pct >= 50 ? '✅ Passed' : '🔁 Try again to pass');

    box.innerHTML = `
      <div class="glass pad text-center">
        <div style="font-size:3rem;">${R.avatar}</div>
        <h2 class="mt-8">${Engine.esc(R.name)}</h2>
        <p class="text-dim">${Engine.esc(R.missionName)} · ${window.DIFFICULTY_LABELS[R.difficulty]}</p>
        <div class="grad-text" style="font-size:1.6rem; font-weight:900; margin-top:6px;">${passMsg}</div>
      </div>

      <div class="report-grid">
        <div class="report-tile pct"><div class="big">${pct}%</div><div class="lbl">Accuracy</div></div>
        <div class="report-tile score"><div class="big">${R.score}</div><div class="lbl">Score</div></div>
        <div class="report-tile acc"><div class="big">${R.correct}/${R.total}</div><div class="lbl">Correct</div></div>
        <div class="report-tile xp"><div class="big">+${R.xpGained}</div><div class="lbl">XP Gained</div></div>
      </div>

      <div class="glass pad">
        <h3 class="mb-16">📈 Detailed Breakdown</h3>
        <div class="flex wrap gap-16">
          <div class="stat"><span class="lbl">Wrong</span><span class="val text-red">${R.wrong}</span></div>
          <div class="stat"><span class="lbl">Skipped</span><span class="val">${R.skipped}</span></div>
          <div class="stat"><span class="lbl">Max Streak</span><span class="val text-orange">🔥 ${R.maxStreak}</span></div>
          <div class="stat"><span class="lbl">Time</span><span class="val">${Math.floor(R.duration/60)}m ${R.duration%60}s</span></div>
        </div>
      </div>

      ${weak.length ? `
      <div class="glass pad mt-16">
        <h3 class="mb-16">🎯 Weak Topics to Review</h3>
        <div class="weak-list">
          ${weak.map(w => `
            <div class="weak-row">
              <span class="topic">${Engine.esc(w.label)}</span>
              <span class="bar progress-bar"><span class="fill" style="width:${Math.min(100, w.count*30)}%"></span></span>
              <span class="text-red">${w.count} missed</span>
            </div>
          `).join('')}
        </div>
      </div>` : '<div class="glass pad mt-16 text-center"><h3>🌟 No weak topics — flawless!</h3></div>'}

      ${newBadges.length ? `
      <div class="glass pad mt-16">
        <h3 class="mb-16">🏅 New Badges Earned</h3>
        <div class="badges-grid">
          ${newBadges.map(id => {
            const b = Engine.badgeById(id);
            return `<div class="badge-cell earned"><div class="b-icon">${b.icon}</div><div class="b-name">${b.name}</div></div>`;
          }).join('')}
        </div>
      </div>` : ''}

      <div class="glass pad mt-16">
        <h3 class="mb-16">📋 Question Review</h3>
        ${R.mistakes.map((m, i) => {
          const q = Engine.byId(m.qid);
          if (!q) return '';
          const yourTxt = m.your >= 0 ? Engine.optionHTML(q.options[m.your] || '—') : '(no answer)';
          const correctTxt = m.correct >= 0 ? Engine.optionHTML(q.options[m.correct] || '—') : Engine.esc(q.reference || '—');
          return `<div class="review-item">
            <div class="q">#${i+1} · ${window.TYPE_LABELS[q.type]} · ${Engine.esc(q.question)}</div>
            ${q.code ? Engine.codeBlockHTML(q.code) : ''}
            <div class="ans-line your">Your answer: ${yourTxt}</div>
            <div class="ans-line correct">Correct: ${correctTxt}</div>
            <div class="text-dim" style="font-size:.85rem; margin-top:4px;">${Engine.esc(q.explanation)}</div>
          </div>`;
        }).join('') || '<p class="text-dim">No mistakes to review. Perfect run!</p>'}
      </div>

      <div class="flex gap-12 mt-24" style="flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="Solo.start()">🔁 Replay</button>
        <button class="btn btn-ghost" onclick="Solo.showSetup()">⬅️ Back to Setup</button>
        <button class="btn btn-ghost" id="soloExportBtn">⬇️ Download Results (JSON)</button>
        <button class="btn btn-ghost" onclick="App.go('missions')">🗺️ Mission Map</button>
      </div>
    `;

    document.getElementById('soloExportBtn').onclick = () => {
      const blob = new Blob([JSON.stringify(R, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `javaquest_solo_${R.name.replace(/\s+/g,'_')}_${R.missionId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      App.toast('Results downloaded.', 'success');
    };
  },

  // ---------- mistakes review ----------
  showMistakesReview() {
    const all = [];
    Object.entries(Store.getMissions()).forEach(([mid, data]) => {
      (data.mistakes || []).forEach(m => {
        const q = Engine.byId(m.qid);
        if (q) all.push({ mid, m, q });
      });
    });
    document.getElementById('soloSetup').classList.add('hidden');
    document.getElementById('soloPlay').classList.add('hidden');
    document.getElementById('soloResults').classList.add('hidden');
    document.getElementById('soloBookmarksView').classList.add('hidden');
    const box = document.getElementById('soloMistakesView');
    box.classList.remove('hidden');

    box.innerHTML = `
      <div class="glass pad">
        <div class="flex between center mb-16">
          <h2>📖 Review My Mistakes</h2>
          <button class="btn btn-ghost btn-sm" onclick="Solo.showSetup()">⬅️ Back</button>
        </div>
        ${all.length === 0 ? '<p class="text-dim">No mistakes yet. Play a mission first!</p>' :
          all.map(({ mid, m, q }, i) => {
            const mission = window.MISSIONS.find(x => x.id === mid);
            const yourTxt = m.your >= 0 ? Engine.optionHTML(q.options[m.your] || '—') : '(no answer)';
            const correctTxt = m.correct >= 0 ? Engine.optionHTML(q.options[m.correct] || '—') : Engine.esc(q.reference || '—');
            return `<div class="review-item">
              <div class="q">#${i+1} · ${mission?.name || mid} · ${window.TYPE_LABELS[q.type]}</div>
              <div class="text-dim" style="margin-bottom:6px;">${Engine.esc(q.question)}</div>
              ${q.code ? Engine.codeBlockHTML(q.code) : ''}
              <div class="ans-line your">Your answer: ${yourTxt}</div>
              <div class="ans-line correct">Correct: ${correctTxt}</div>
              <div class="text-dim" style="font-size:.85rem; margin-top:4px;">${Engine.esc(q.explanation)}</div>
            </div>`;
          }).join('')}
      </div>
    `;
  },

  // ---------- bookmarks ----------
  showBookmarks() {
    const ids = Store.getBookmarks();
    const qs = ids.map(id => Engine.byId(id)).filter(Boolean);
    document.getElementById('soloSetup').classList.add('hidden');
    document.getElementById('soloPlay').classList.add('hidden');
    document.getElementById('soloResults').classList.add('hidden');
    document.getElementById('soloMistakesView').classList.add('hidden');
    const box = document.getElementById('soloBookmarksView');
    box.classList.remove('hidden');

    box.innerHTML = `
      <div class="glass pad">
        <div class="flex between center mb-16">
          <h2>🔖 My Bookmarks</h2>
          <button class="btn btn-ghost btn-sm" onclick="Solo.showSetup()">⬅️ Back</button>
        </div>
        ${qs.length === 0 ? '<p class="text-dim">No bookmarks yet. Tap 🔖 during a question to save it.</p>' :
          qs.map((q, i) => `
            <div class="review-item">
              <div class="flex between center">
                <div class="q">#${i+1} · ${window.TYPE_LABELS[q.type]} · ${window.CATEGORY_LABELS[q.category]}</div>
                <button class="btn btn-ghost btn-sm" onclick="Solo.removeBookmark('${q.id}')">Remove</button>
              </div>
              <div class="text-dim" style="margin:6px 0;">${Engine.esc(q.question)}</div>
              ${q.code ? Engine.codeBlockHTML(q.code) : ''}
              ${q.options ? `<div class="options">${q.options.map((o,j) => `<div class="opt ${j===q.answer?'correct':''}"><div class="marker">${String.fromCharCode(65+j)}</div><div class="text">${Engine.optionHTML(o)}</div></div>`).join('')}</div>` : ''}
              <div class="explain mt-8"><h4>EXPLANATION</h4><p>${Engine.esc(q.explanation)}</p></div>
            </div>
          `).join('')}
      </div>
    `;
  },

  removeBookmark(qid) {
    Store.toggleBookmark(qid);
    this.showBookmarks();
  }
};

window.Solo = Solo;
