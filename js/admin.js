const ADMIN_PIN = "1234";
let isAdminUnlocked = false;

function unlockAdmin(pin) {
  if (pin === ADMIN_PIN) {
    isAdminUnlocked = true;
    document.body.classList.add("admin-unlocked");
    const btn = document.getElementById("adminToggleBtn");
    if (btn) {
      btn.textContent = "Admin: Unlocked";
      btn.classList.remove("bg-amber-500", "hover:bg-amber-400", "text-slate-950");
      btn.classList.add("bg-emerald-500", "text-white");
    }
    return true;
  }
  return false;
}

function addStudent(state, name, teamsBySubject) {
  const maxId = state.students.reduce((max, s) => Math.max(max, s.id), 0);
  const student = { id: maxId + 1, name: name.trim(), teams: { ...teamsBySubject }, leaders: {} };
  state.students.push(student);
  saveState(state);
  return student;
}

function updateStudent(state, id, name, teamsBySubject) {
  const student = state.students.find((s) => s.id === Number(id));
  if (!student) return null;
  student.name = name.trim();
  student.teams = { ...teamsBySubject };
  saveState(state);
  return student;
}

function deleteStudent(state, id) {
  state.students = state.students.filter((s) => s.id !== Number(id));
  saveState(state);
}

function assignStudentToTeam(state, studentId, subject, teamNumber) {
  const student = state.students.find((s) => s.id === Number(studentId));
  if (!student) return;
  student.teams[subject] = Number(teamNumber);
  saveState(state);
}

function toggleTeamLeader(state, studentId, subject, teamNumber) {
  const student = state.students.find((s) => s.id === Number(studentId));
  if (!student) return;
  if (!student.leaders) student.leaders = {};
  if (student.leaders[subject] === Number(teamNumber)) delete student.leaders[subject];
  else student.leaders[subject] = Number(teamNumber);
  saveState(state);
}

function shuffleSubjectTeams(state, subject) {
  const ids = state.students.map((s) => s.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  const teamCount = Math.max(1, Math.ceil(ids.length / 5));
  ids.forEach((id, idx) => {
    const student = state.students.find((s) => s.id === id);
    if (student) student.teams[subject] = (idx % teamCount) + 1;
  });
  saveState(state);
}