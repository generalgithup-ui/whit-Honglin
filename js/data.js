const SUBJECTS = ["ADS", "CV", "DB", "DC", "JAVA", "ENGLISH"];
const STORAGE_KEY = "class_team_assignment_v2";

const DEFAULT_NAMES = [
  "Sok Dara", "Chan Sreymom", "Meas Piseth", "Chea Vicheka", "Pov Kanha",
  "Lim Sophal", "Heng Rathana", "Kim Socheata", "Noun Chamroeun", "Sao Bopha",
  "Touch Makara", "Phal Leakhena", "Chhun Vireak", "Keo Chanthou", "Yim Sreyneang",
  "Long Rithy", "Prak Sovann", "Tep Dany", "Sun Visal", "Ouk Samnang",
  "Hem Sreypov", "Nhem Vibol", "Seng Molika", "Vong Chandara", "Chhay Rotha",
  "Mao Sopheak", "Khorn Vannak", "Ly Sreyroth", "Pich Sokha", "Roeun Chetra",
  "Sam Channary", "Teav Bunthorn", "Ung Sreymeas", "Yin Kosal", "Chhouk Pheaktra",
  "Dy Sovan", "Em Kunthea", "Khieu Ratanak", "Lao Sreyka", "Men Virak",
  "Oum Sovannary", "Pen Dara", "Reach Sreynoch", "Soun Phirun", "Thong Borith",
  "Uk Sreyly", "Van Narith", "Yos Chantrea", "Chum Sothea", "Bun Sophanith"
];

function createDefaultStudents() {
  return DEFAULT_NAMES.map((name, idx) => {
    const id = idx + 1;
    const teams = {};
    SUBJECTS.forEach((subj, sIdx) => {
      teams[subj] = ((idx + sIdx * 3) % 10) + 1;
    });
    return { id, name, teams, leaders: {} };
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.students) && parsed.students.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Resetting invalid saved state:", err);
  }
  const initial = { activeSubject: "ADS", students: createDefaultStudents() };
  saveState(initial);
  return initial;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}