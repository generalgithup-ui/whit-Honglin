const SUBJECT_COLORS = {
  ADS: "bg-indigo-50 text-indigo-700 border-indigo-200",
  CV: "bg-cyan-50 text-cyan-700 border-cyan-200",
  DB: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DC: "bg-amber-50 text-amber-700 border-amber-200",
  JAVA: "bg-rose-50 text-rose-700 border-rose-200",
  ENGLISH: "bg-violet-50 text-violet-700 border-violet-200"
};

function renderSubjectTabs(activeSubject) {
  document.querySelectorAll(".subject-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.subject === activeSubject);
  });
  document.getElementById("activeSubjectTitle").textContent = activeSubject;
  const badge = document.getElementById("subjectBadge");
  badge.className = `px-2.5 py-1 rounded-full text-xs font-semibold border ${SUBJECT_COLORS[activeSubject] || ""}`;
}

function renderTeamsGrid(state, searchQuery = "") {
  const grid = document.getElementById("teamsGrid");
  const subject = state.activeSubject;
  const q = searchQuery.trim().toLowerCase();

  const filtered = state.students.filter((s) =>
    !q || s.name.toLowerCase().includes(q) || String(s.id).padStart(2, "0").includes(q)
  );

  const teamMap = new Map();
  filtered.forEach((student) => {
    const tNum = student.teams[subject] || 1;
    if (!teamMap.has(tNum)) teamMap.set(tNum, []);
    teamMap.get(tNum).push(student);
  });

  const sortedTeams = Array.from(teamMap.entries()).sort((a, b) => a[0] - b[0]);
  document.getElementById("subjectBadge").textContent = `${sortedTeams.length} Teams • ${filtered.length} Members`;

  grid.innerHTML = sortedTeams.map(([teamNum, members]) => {
    const memberItems = members.map((m) => {
      const isLeader = m.leaders && m.leaders[subject] === teamNum;
      return `
        <li class="flex items-center justify-between gap-1.5 py-1 px-2 rounded-lg bg-slate-50 text-xs">
          <span class="truncate">
            <strong class="text-slate-400 mr-1">#${String(m.id).padStart(2, "0")}</strong>
            <span class="font-medium text-slate-800">${escapeHtml(m.name)}</span>
            ${isLeader ? '<span class="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-amber-100 text-amber-800 font-semibold">Leader</span>' : ""}
          </span>
          <span class="admin-only hidden shrink-0 gap-1">
            <button data-action="leader" data-id="${m.id}" data-team="${teamNum}" title="Toggle Leader" class="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900">★</button>
            <button data-action="edit" data-id="${m.id}" title="Edit Student" class="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800">✎</button>
          </span>
        </li>`;
    }).join("");

    return `
      <article class="team-card bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h4 class="font-bold text-sm text-slate-900">${subject} — Team ${teamNum}</h4>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">${members.length}</span>
          </div>
          <ul class="space-y-1.5">${memberItems}</ul>
        </div>
      </article>`;
  }).join("");
}

function renderRosterDrawer(state) {
  const list = document.getElementById("rosterList");
  document.getElementById("rosterCount").textContent = state.students.length;
  list.innerHTML = state.students.map((s) => `
    <li class="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50">
      <div>
        <span class="text-xs font-bold text-indigo-600 mr-1.5">#${String(s.id).padStart(2, "0")}</span>
        <span class="font-medium text-slate-800">${escapeHtml(s.name)}</span>
      </div>
      <span class="text-xs text-slate-500">T${s.teams[state.activeSubject] || 1}</span>
    </li>`).join("");
}

function renderAdminTable(state) {
  const tbody = document.getElementById("adminStudentTableBody");
  document.getElementById("quickStudentSelect").innerHTML = state.students
    .map((s) => `<option value="${s.id}">#${String(s.id).padStart(2, "0")} - ${escapeHtml(s.name)}</option>`).join("");
  document.getElementById("quickTeamSelect").innerHTML = Array.from({ length: 15 }, (_, i) => i + 1)
    .map((t) => `<option value="${t}">Team ${t}</option>`).join("");

  tbody.innerHTML = state.students.map((s) => `
    <tr>
      <td class="py-2 px-3 font-mono text-xs text-slate-500">#${String(s.id).padStart(2, "0")}</td>
      <td class="py-2 px-3 font-medium text-slate-800">${escapeHtml(s.name)}</td>
      ${SUBJECTS.map((sub) => `<td class="py-2 px-3 text-xs">Team ${s.teams[sub] || 1}</td>`).join("")}
      <td class="py-2 px-3 text-right space-x-1.5 whitespace-nowrap">
        <button data-action="edit" data-id="${s.id}" class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 font-medium">Edit</button>
        <button data-action="delete" data-id="${s.id}" class="px-2.5 py-1 text-xs rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium">Delete</button>
      </td>
    </tr>`).join("");
}

function escapeHtml(str) {
  return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}