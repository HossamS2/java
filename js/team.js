/* =========================================================
   team.js — TEAM MODE (local pass-and-play)
   4 team formats:
     rep     — one representative answers for the team
     turns   — players take turns answering
     fixed   — each member answers a fixed number of questions
     together— teams solve the same questions together
   All on one device. No internet sync.
   ========================================================= */

const Team = {
  state: null,
  COLORS: ['#00f0ff','#ff5470','#ffd166','#22d39a','#8b5cf6','#ff8a3d','#d946ef','#34e7e4'],
  ICONS: ['🔴','🔵','🟢','🟡','🟣','🟠','🟤','⚪'],

  initSetup() {
    // category dropdown
    const cat = document.getElementById('teamCategory');
    cat.innerHTML = '<option value="any">All categories</option>' +
      Object.entries(window.CATEGORY_LABELS).map(([k,v]) => `<option value="${k}">${v}</option>`).join('');

    // restore last teams if any
    const saved = Store.getTeams();
    if (saved && saved.length) {
      this.renderTeams(saved);
    } else {
      this.renderTeams([]);
    }

    document.getElementById('addTeam').onclick = () => {
      const teams = this.collectTeams();
      const i = teams.length;
      teams.push({
        id: 't' + Date.now(),
        name: `Team ${String.fromCharCode(65 + i)}`,
        color: this.COLORS[i % this.COLORS.length],
        icon: this.ICONS[i % this.ICONS.length],
        members: []
      });
      this.renderTeams(teams);
    };

    document.getElementById('teamLoadExample').onclick = () => {
      this.renderTeams([
        { id:'t1', name:'Alpha', color:this.COLORS[0], icon:this.ICONS[0], members:['Ahmed','Omar','Ali','Mahmoud','Youssef'] },
        { id:'t2', name:'Beta',  color:this.COLORS[1], icon:this.ICONS[1], members:['Sara','Mariam','Nour','Salma','Nada'] },
        { id:'t3', name:'Gamma', color:this.COLORS[2], icon:this.ICONS[2], members:['Player 1','Player 2','Player 3','Player 4','Player 5'] }
      ]);
      App.toast('Example roster loaded.', 'success');
    };

    document.getElementById('teamStart').onclick = () => this.start();
  },

  renderTeams(teams) {
    const list = document.getElementById('teamList');
    list.innerHTML = teams.map((t, ti) => `
      <div class="team-box" data-ti="${ti}">
        <div class="team-head">
          <span class="team-color" style="background:${t.color}"></span>
          <input class="team-name-input" value="${Engine.esc(t.name)}" data-field="name" />
          <div class="swatch-row">
            ${this.COLORS.map(c => `<span class="swatch ${c===t.color?'sel':''}" style="background:${c}" data-color="${c}"></span>`).join('')}
          </div>
          <button class="btn btn-danger btn-sm" data-act="del">✕</button>
        </div>
        <div class="members">
          ${t.members.map((m, mi) => `
            <span class="member-chip">${Engine.esc(m)} <span class="rm" data-mi="${mi}">✕</span></span>
          `).join('')}
        </div>
        <div class="flex gap-8 mt-8">
          <input type="text" placeholder="Add member name..." data-add style="flex:1; padding:6px 10px; border-radius:8px; background:rgba(5,8,22,.6); border:1px solid var(--glass-brd); color:var(--txt);" />
          <button class="btn btn-ghost btn-sm" data-act="add">Add</button>
        </div>
      </div>
    `).join('');

    // bind each team box
    list.querySelectorAll('.team-box').forEach(box => {
      const ti = parseInt(box.dataset.ti, 10);
      box.querySelector('[data-field="name"]').oninput = (e) => { teams[ti].name = e.target.value; };
      box.querySelectorAll('.swatch').forEach(sw => {
        sw.onclick = () => {
          teams[ti].color = sw.dataset.color;
          this.renderTeams(teams);
        };
      });
      box.querySelector('[data-act="del"]').onclick = () => {
        teams.splice(ti, 1);
        this.renderTeams(teams);
      };
      const addInput = box.querySelector('[data-add]');
      const doAdd = () => {
        const v = addInput.value.trim();
        if (!v) return;
        teams[ti].members.push(v);
        addInput.value = '';
        this.renderTeams(teams);
      };
      box.querySelector('[data-act="add"]').onclick = doAdd;
      addInput.onkeydown = (e) => { if (e.key === 'Enter') doAdd(); };
      box.querySelectorAll('.member-chip .rm').forEach(rm => {
        rm.onclick = () => {
          const mi = parseInt(rm.dataset.mi, 10);
          teams[ti].members.splice(mi, 1);
          this.renderTeams(teams);
        };
      });
    });

    Store.saveTeams(teams);
  },

  collectTeams() {
    // read live DOM into team objects
    const boxes = document.querySelectorAll('#teamList .team-box');
    const teams = [];
    boxes.forEach(box => {
      const ti = parseInt(box.dataset.ti, 10);
      const name = box.querySelector('[data-field="name"]').value.trim() || `Team ${ti+1}`;
      const color = box.querySelector('.swatch.sel')?.dataset.color || this.COLORS[ti % this.COLORS.length];
      const members = Array.from(box.querySelectorAll('.member-chip')).map(c =>
        c.textContent.replace('✕','').trim()
      ).filter(Boolean);
      teams.push({ id: 't'+ti+'_'+Date.now(), name, color, icon: this.ICONS[ti % this.ICONS.length], members });
    });
    return teams;
  },

  start() {
    const teams = this.collectTeams();
    if (teams.length < 1) { App.toast('Add at least one team.', 'error'); return; }
    if (teams.some(t => t.members.length === 0)) {
      App.toast('Each team needs at least one member.', 'error'); return;
    }
    const qCount = Math.max(3, Math.min(50, parseInt(document.getElementById('teamQCount').value, 10) || 10));
    const category = document.getElementById('teamCategory').value;
    const scoring = document.getElementById('teamScoring').value;
    const difficulty = document.getElementById('teamDifficulty').value;

    let pool = Engine.filter({ category: category === 'any' ? 'any' : category, difficulty });
    if (pool.length < qCount) {
      // relax difficulty if not enough
      pool = Engine.filter({ category });
    }
    if (pool.length === 0) { App.toast('No questions match these filters.', 'error'); return; }

    const questions = Engine.pickQuestions(pool, qCount);

    // per-team score init
    teams.forEach(t => { t.score = 0; t.streak = 0; t.correct = 0; t.wrong = 0; });

    this.state = {
      mode: 'team',
      format: document.getElementById('teamFormat').value,
      teams,
      questions,
      prepared: questions.map(q => Engine.prepareQuestion(q, { randomizeOptions: true })),
      qIdx: 0,
      scoring,
      // turn-tracking:
      // rep: each question -> round-robin across teams (one rep per team)
      // turns: round-robin across ALL members of ALL teams
      // fixed: each member answers fixedQ = ceil(qCount / totalMembers)
      // together: every team sees every question; instructor picks which team answered
      teamTurnIndex: 0,   // which team is currently up
      memberTurnIndex: 0, // which member within the team
      totalMembers: teams.reduce((s, t) => s + t.members.length, 0),
      startTime: Date.now(),
      answered: false,
      selectedOption: -1,
      history: []  // { qid, teamId, member, correct }
    };

    Store.saveSession(this.state);
    this.showPlay();
    this.renderQuestion();
  },

  showPlay() {
    document.getElementById('teamSetup').classList.add('hidden');
    document.getElementById('teamResults').classList.add('hidden');
    document.getElementById('teamPlay').classList.remove('hidden');
  },

  showSetup() {
    document.getElementById('teamPlay').classList.add('hidden');
    document.getElementById('teamResults').classList.add('hidden');
    document.getElementById('teamSetup').classList.remove('hidden');
  },

  currentTurn() {
    const S = this.state;
    const team = S.teams[S.teamTurnIndex % S.teams.length];
    let member;
    if (S.format === 'rep') {
      // each question rotates team; rep can be the first member or instructor-chosen
      member = team.members[S.memberTurnIndex % team.members.length];
    } else if (S.format === 'turns') {
      member = team.members[S.memberTurnIndex % team.members.length];
    } else if (S.format === 'fixed') {
      member = team.members[S.memberTurnIndex % team.members.length];
    } else { // together
      member = team.members[S.memberTurnIndex % team.members.length];
    }
    return { team, member };
  },

  advanceTurn() {
    const S = this.state;
    if (S.format === 'rep') {
      // next team, rep stays first
      S.teamTurnIndex++;
    } else if (S.format === 'turns') {
      // cycle through team then next member
      S.teamTurnIndex++;
      if (S.teamTurnIndex >= S.teams.length) {
        S.teamTurnIndex = 0;
        S.memberTurnIndex++;
      }
    } else if (S.format === 'fixed') {
      // similar to turns
      S.teamTurnIndex++;
      if (S.teamTurnIndex >= S.teams.length) {
        S.teamTurnIndex = 0;
        S.memberTurnIndex++;
      }
    } else if (S.format === 'together') {
      // all teams answer the same question; advance team for next question
      S.teamTurnIndex++;
      if (S.teamTurnIndex >= S.teams.length) {
        S.teamTurnIndex = 0;
        S.qIdx++; // move to next question after all teams have seen it
      }
      return;
    }
    S.qIdx++;
  },

  renderQuestion() {
    const S = this.state;
    if (S.qIdx >= S.questions.length) { this.finish(); return; }
    const prep = S.prepared[S.qIdx];
    const q = prep.q;
    const { team, member } = this.currentTurn();

    // turn indicator
    document.getElementById('teamTurn').innerHTML = `
      <div class="who">
        <span class="team-dot" style="background:${team.color}"></span>
        ${team.icon} <b>${Engine.esc(team.name)}</b> · 👤 ${Engine.esc(member)}
        <span style="display:block; font-size:.85rem; color:var(--txt-dim); margin-top:4px;">
          Format: ${({rep:'One representative',turns:'Take turns',fixed:'Fixed count',together:'Same questions together'})[S.format]}
        </span>
      </div>
    `;

    // hud with all team scores
    const hud = document.getElementById('teamHud');
    hud.innerHTML = S.teams.map((t, i) => `
      <div class="stat" style="border-color:${t.color}40;">
        <span class="team-dot" style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${t.color};"></span>
        <span class="lbl">${t.icon} ${Engine.esc(t.name)}</span>
        <span class="val" style="color:${t.color};">${t.score}</span>
      </div>
    `).join('') + `<div class="stat"><span class="lbl">Question</span><span class="val">${S.qIdx+1}/${S.questions.length}</span></div>`;

    // question card
    const card = document.getElementById('teamQCard');
    let html = `
      <div class="q-meta">
        <span class="tag cat">${window.CATEGORY_LABELS[q.category]}</span>
        <span class="tag diff-${q.difficulty}">${window.DIFFICULTY_LABELS[q.difficulty]}</span>
        <span class="tag src">${window.SOURCES[q.source]}</span>
        <span class="tag type">${window.TYPE_LABELS[q.type]}</span>
      </div>
      <div class="q-text">${Engine.esc(q.question)}</div>
      ${Engine.codeBlockHTML(q.code)}
    `;
    if (prep.isOptionBased) {
      html += `<div class="options" id="teamOptions">`;
      prep.displayOptions.forEach((opt, i) => {
        html += `<div class="opt" data-i="${i}"><div class="marker">${String.fromCharCode(65 + i)}</div><div class="text">${Engine.optionHTML(opt)}</div></div>`;
      });
      html += `</div>`;
    } else {
      html += `
        <div class="field mt-16">
          <label>Open-ended — reveal reference to grade:</label>
          <textarea id="teamOpenAnswer" placeholder="Team discusses, then writes their answer..." rows="5"></textarea>
        </div>
        <button class="btn btn-primary mt-8" id="teamRevealOpen">📖 Reveal Reference</button>
        <div id="teamOpenReveal" class="hidden mt-16"></div>
        <div class="flex gap-12 mt-16">
          <button class="btn btn-ghost" id="teamSelfCorrect">✅ Correct (+10)</button>
          <button class="btn btn-ghost" id="teamSelfWrong">❌ Wrong</button>
        </div>
      `;
    }
    html += `<div id="teamFeedback"></div><div id="teamExplain" class="hidden"></div>`;
    card.innerHTML = html;

    S.answered = false;
    S.selectedOption = -1;

    if (prep.isOptionBased) {
      card.querySelectorAll('#teamOptions .opt').forEach(el => {
        el.onclick = () => {
          if (S.answered) return;
          this.chooseOption(parseInt(el.dataset.i, 10), team, member);
        };
      });
    } else {
      document.getElementById('teamRevealOpen').onclick = () => this.revealOpen();
      document.getElementById('teamSelfCorrect').onclick = () => this.gradeOpen(true, team, member);
      document.getElementById('teamSelfWrong').onclick = () => this.gradeOpen(false, team, member);
    }

    document.getElementById('teamNext').onclick = () => this.next();
    document.getElementById('teamSkip').onclick = () => this.skip(team, member);
    document.getElementById('teamQuit').onclick = () => {
      if (confirm('End the team game now? Final leaderboard will be shown.')) this.finish();
    };
  },

  awardPoints(team, correct, skipped = false) {
    const S = this.state;
    let pts = 0;
    if (correct) {
      team.streak++;
      let base = 10;
      if (S.scoring === 'streak') base += 5 * (team.streak - 1);
      else if (S.scoring === 'double') base = 10;
      pts = base;
      team.score += pts;
      team.correct++;
    } else if (!skipped) {
      team.streak = 0;
      team.wrong++;
      if (S.scoring === 'double') { pts = -5; team.score = Math.max(0, team.score - 5); }
    } else {
      team.streak = 0;
    }
    return pts;
  },

  chooseOption(i, team, member) {
    const S = this.state;
    if (S.answered) return;
    S.answered = true;
    const prep = S.prepared[S.qIdx];
    const correct = i === prep.correctIndex;
    const pts = this.awardPoints(team, correct);

    const card = document.getElementById('teamQCard');
    const opts = card.querySelectorAll('#teamOptions .opt');
    opts.forEach((el, idx) => {
      el.classList.remove('selected');
      if (idx === prep.correctIndex) el.classList.add('correct');
      if (idx === i && !correct) el.classList.add('wrong');
    });

    const fb = document.getElementById('teamFeedback');
    fb.className = 'feedback ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = (correct ? `✅ ${Engine.esc(member)} (${Engine.esc(team.name)}) +${pts}!` : `❌ ${Engine.esc(member)} (${Engine.esc(team.name)}) — `) +
      (correct ? '' : `Correct: <b>${Engine.optionHTML(prep.displayOptions[prep.correctIndex])}</b>`);
    this.showExplanation();

    S.history.push({ qid: prep.q.id, teamId: team.id, member, correct });
    Store.saveSession(S);
    this.refreshHud();
  },

  revealOpen() {
    const S = this.state;
    const prep = S.prepared[S.qIdx];
    const q = prep.q;
    const box = document.getElementById('teamOpenReveal');
    box.classList.remove('hidden');
    box.innerHTML = `<div class="explain"><h4>REFERENCE ANSWER</h4><pre class="code-block">${Engine.highlight(q.reference || '')}</pre></div>`;
  },

  gradeOpen(correct, team, member) {
    const S = this.state;
    if (S.answered) return;
    S.answered = true;
    const pts = this.awardPoints(team, correct);
    const fb = document.getElementById('teamFeedback');
    fb.className = 'feedback ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = correct ? `✅ ${Engine.esc(member)} (${Engine.esc(team.name)}) +${pts}!` : '❌ Marked incorrect.';
    S.history.push({ qid: S.prepared[S.qIdx].q.id, teamId: team.id, member, correct });
    Store.saveSession(S);
    this.refreshHud();
  },

  showExplanation() {
    const S = this.state;
    const q = S.prepared[S.qIdx].q;
    const ex = document.getElementById('teamExplain');
    ex.classList.remove('hidden');
    ex.innerHTML = `
      <div class="explain"><h4>EXPLANATION</h4><p>${Engine.esc(q.explanation)}</p></div>
      ${q.explanationAr ? `<div class="explain ar rtl"><h4>الشرح</h4><p>${Engine.esc(q.explanationAr)}</p></div>` : ''}
    `;
  },

  refreshHud() {
    const S = this.state;
    const hud = document.getElementById('teamHud');
    const stats = S.teams.map((t) => `
      <div class="stat" style="border-color:${t.color}40;">
        <span class="team-dot" style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${t.color};"></span>
        <span class="lbl">${t.icon} ${Engine.esc(t.name)}</span>
        <span class="val" style="color:${t.color};">${t.score}</span>
      </div>
    `).join('');
    hud.innerHTML = stats + `<div class="stat"><span class="lbl">Question</span><span class="val">${S.qIdx+1}/${S.questions.length}</span></div>`;
  },

  next() {
    const S = this.state;
    if (!S.answered) { App.toast('Answer or skip first.', 'info'); return; }
    this.advanceTurn();
    Store.saveSession(S);
    this.renderQuestion();
  },

  skip(team, member) {
    const S = this.state;
    if (S.answered) { this.next(); return; }
    S.answered = true;
    this.awardPoints(team, false, true);
    const prep = S.prepared[S.qIdx];
    const card = document.getElementById('teamQCard');
    if (prep.isOptionBased) {
      card.querySelectorAll('#teamOptions .opt').forEach((el, idx) => {
        if (idx === prep.correctIndex) el.classList.add('correct');
      });
    }
    const fb = document.getElementById('teamFeedback');
    fb.className = 'feedback wrong';
    fb.innerHTML = `⏭️ Skipped by ${Engine.esc(member)}. Correct answer shown above.`;
    this.showExplanation();
    S.history.push({ qid: prep.q.id, teamId: team.id, member, correct: false, skipped: true });
    Store.saveSession(S);
    this.refreshHud();
  },

  finish() {
    const S = this.state;
    const ranked = S.teams.slice().sort((a, b) => b.score - a.score);
    const comp = {
      mode: 'team',
      format: S.format,
      scoring: S.scoring,
      qCount: S.questions.length,
      teams: ranked.map(t => ({ name: t.name, score: t.score, correct: t.correct, wrong: t.wrong, members: t.members.length })),
      duration: Math.round((Date.now() - S.startTime) / 1000),
      at: Date.now()
    };
    Store.addCompetition(comp);

    // XP for team_player badge (no personal XP since multi-player)
    // Mark mode flag via badge evaluation
    const missionsDone = window.MISSIONS.filter(m => Store.getMission(m.id)?.completed).length;
    const earned = Engine.evaluateBadges({
      missionsDone, maxStreak: 0, xp: Store.getXP(),
      modeFlags: { team: true }
    });
    earned.forEach(id => Store.addBadge(id));

    this.renderResults(ranked, comp);
    Store.clearSession();
    App.confetti();
  },

  renderResults(ranked, comp) {
    document.getElementById('teamPlay').classList.add('hidden');
    const box = document.getElementById('teamResults');
    box.classList.remove('hidden');

    const podiumHTML = () => {
      const top3 = ranked.slice(0, 3);
      if (top3.length < 1) return '';
      // arrange p2, p1, p3
      const slots = [];
      slots[1] = top3[1] || null;
      slots[0] = top3[0] || null;
      slots[2] = top3[2] || null;
      return `<div class="podium">
        ${slots.map((t, i) => t ? `
          <div class="slot p${i+1}">
            <div class="crown">${i===0?'👑':i===1?'🥈':'🥉'}</div>
            <div class="pname" style="color:${t.color}">${t.icon} ${Engine.esc(t.name)}</div>
            <div class="pts">${t.score} pts</div>
            <div class="text-dim" style="font-size:.78rem;">${t.correct} correct · ${t.wrong} wrong</div>
          </div>` : `<div class="slot p${i+1}"></div>`).join('')}
      </div>`;
    };

    box.innerHTML = `
      <div class="glass pad text-center">
        <h2>🏆 Team Leaderboard</h2>
        <p class="text-dim">Format: ${({rep:'One representative',turns:'Take turns',fixed:'Fixed count',together:'Same questions together'})[comp.format]} · ${comp.qCount} questions · ${Math.floor(comp.duration/60)}m ${comp.duration%60}s</p>
      </div>

      ${podiumHTML()}

      <div class="glass pad mt-24">
        <h3 class="mb-16">Full Standings</h3>
        <div class="leaderboard">
          ${ranked.map((t, i) => `
            <div class="lb-row r${i+1<=3?i+1:''}">
              <div class="rank">${i+1}</div>
              <div class="name">${t.icon} ${Engine.esc(t.name)} <small>${t.members.length} members · ${t.correct} correct · ${t.wrong} wrong</small></div>
              <div class="pts">${t.score}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="flex gap-12 mt-24" style="flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="Team.start()">🔁 Play Again</button>
        <button class="btn btn-ghost" onclick="Team.showSetup()">⬅️ Edit Teams</button>
        <button class="btn btn-ghost" id="teamExportBtn">⬇️ Download Results (JSON)</button>
        <button class="btn btn-ghost" onclick="App.go('home')">🏠 Home</button>
      </div>
    `;

    document.getElementById('teamExportBtn').onclick = () => {
      const blob = new Blob([JSON.stringify(comp, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `javaquest_team_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      App.toast('Results downloaded.', 'success');
    };
  }
};

window.Team = Team;
