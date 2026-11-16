let appState = loadState();

function refreshAll() {
  renderSubjectTabs(appState.activeSubject);
  renderTeamsGrid(appState, document.getElementById("searchInput").value);
  renderRosterDrawer(appState);
  renderAdminTable(appState);
}

function exportSubjectCsv() {
  const subject = appState.activeSubject;
  const rows = [["ID", "Student Name", `${subject} Team`]];
  appState.students.forEach((s) => {
    rows.push([s.id, `"${s.name.replaceAll('"', '""')}"`, `Team ${s.teams[subject] || 1}`]);
  });
  const csvContent = "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = `class_teams_${subject.toLowerCase()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function openStudentModal(student = null) {
  const modal = document.getElementById("studentModal");
  document.getElementById("studentModalTitle").textContent = student
    ? `Edit Student #${String(student.id).padStart(2, "0")}`
    : "Add New Student";
  document.getElementById("editingStudentId").value = student ? student.id : "";
  document.getElementById("studentNameInput").value = student ? student.name : "";
  SUBJECTS.forEach((sub) => {
    document.getElementById(`team${sub}`).value = student ? (student.teams[sub] || 1) : 1;
  });
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeStudentModal() {
  const modal = document.getElementById("studentModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

document.addEventListener("DOMContentLoaded", () => {
  refreshAll();

  document.getElementById("subjectNav").addEventListener("click", (e) => {
    const btn = e.target.closest(".subject-btn");
    if (!btn) return;
    appState.activeSubject = btn.dataset.subject;
    saveState(appState);
    refreshAll();
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    renderTeamsGrid(appState, e.target.value);
  });

  document.getElementById("shuffleBtn").addEventListener("click", () => {
    shuffleSubjectTeams(appState, appState.activeSubject);
    refreshAll();
  });

  document.getElementById("exportCsvBtn").addEventListener("click", exportSubjectCsv);

  const drawer = document.getElementById("rosterDrawer");
  document.getElementById("toggleRosterBtn").addEventListener("click", () => drawer.classList.remove("translate-x-full"));
  document.getElementById("closeRosterBtn").addEventListener("click", () => drawer.classList.add("translate-x-full"));

  const adminModal = document.getElementById("adminModal");
  document.getElementById("adminToggleBtn").addEventListener("click", () => {
    if (isAdminUnlocked) {
      document.getElementById("adminPanel").scrollIntoView({ behavior: "smooth" });
      return;
    }
    document.getElementById("adminPinError").classList.add("hidden");
    document.getElementById("adminPinInput").value = "";
    adminModal.classList.remove("hidden");
    adminModal.classList.add("flex");
  });

  document.getElementById("cancelAdminModalBtn").addEventListener("click", () => {
    adminModal.classList.add("hidden");
    adminModal.classList.remove("flex");
  });

  document.getElementById("confirmAdminPinBtn").addEventListener("click", () => {
    const pin = document.getElementById("adminPinInput").value.trim();
    if (unlockAdmin(pin)) {
      adminModal.classList.add("hidden");
      adminModal.classList.remove("flex");
      refreshAll();
    } else {
      document.getElementById("adminPinError").classList.remove("hidden");
    }
  });

  document.getElementById("openAddStudentBtn").addEventListener("click", () => openStudentModal(null));
  document.getElementById("cancelStudentModalBtn").addEventListener("click", closeStudentModal);

  document.getElementById("studentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("editingStudentId").value;
    const name = document.getElementById("studentNameInput").value;
    const teams = {};
    SUBJECTS.forEach((sub) => {
      teams[sub] = Number(document.getElementById(`team${sub}`).value) || 1;
    });
    if (id) updateStudent(appState, id, name, teams);
    else addStudent(appState, name, teams);
    closeStudentModal();
    refreshAll();
  });

  document.getElementById("quickAssignBtn").addEventListener("click", () => {
    assignStudentToTeam(
      appState,
      document.getElementById("quickStudentSelect").value,
      document.getElementById("quickSubjectSelect").value,
      document.getElementById("quickTeamSelect").value
    );
    refreshAll();
  });

  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);
    if (action === "edit") {
      const student = appState.students.find((s) => s.id === id);
      if (student) openStudentModal(student);
    } else if (action === "delete") {
      deleteStudent(appState, id);
      refreshAll();
    } else if (action === "leader") {
      toggleTeamLeader(appState, id, appState.activeSubject, Number(btn.dataset.team));
      refreshAll();
    }
  });

  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    appState = loadState();
    refreshAll();
  });
});