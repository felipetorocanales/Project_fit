import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO: Reemplaza esto con la configuración de tu proyecto en la consola de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDPj5nL-CcszITvXiLokLpuyI7MfSqL9Us",
    authDomain: "gymtracker-b6d6b.firebaseapp.com",
    projectId: "gymtracker-b6d6b",
    storageBucket: "gymtracker-b6d6b.firebasestorage.app",
    messagingSenderId: "935815624128",
    appId: "1:935815624128:web:db59d78e6203bc6b104425",
    measurementId: "G-MN4ED8FDXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exercises extracted from Excel, categorized by Training Day
const exercisesByCategory = {
    "Día 1: Tren Superior": [
        "Jalón en Polea Alta Prono",
        "Remo en polea con rodilla en el piso",
        "Deltoide posterior mancuernas",
        "Elevaciones Laterales Mancuernas",
        "Press inclinado en smith",
        "Press pecho en maquina",
        "Press militar en maquina",
        "Curl biceps en polea alta unilateral",
        "Extensión triceps polea unilateral"
    ],
    "Día 2: Tren Inferior Piernas": [
        "Aducción en Maquina",
        "Curl Isquios Sentado en Maquina",
        "Extensión Cuadriceps en Maquina",
        "Sentadilla en smith",
        "Peso Muerto Rumano con Mancuernas",
        "Crunch Polea o Maquina"
    ],
    "Día 3: Tren Superior": [
        "Elevaciones Laterales en polea",
        "Apertura en maquina unilateral",
        "Press inclinado con mancuernas",
        "Press militar con mancuernas",
        "Press frances",
        "Remo con mancuernas",
        "Remo en maquina con agarre neutro",
        "Curl biceps bayesian",
        "Curl biceps con barra prono"
    ]
};

const exerciseDetails = {
    "Jalón en Polea Alta Prono": { "trabajo": "1 serie x 1 - 6 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Remo en polea con rodilla en el piso": { "trabajo": "1 serie x 1 - 6 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Deltoide posterior mancuernas": { "trabajo": "2 series x 6-10 reps", "intensidad": "Fallo" },
    "Elevaciones Laterales Mancuernas": { "trabajo": "1 serie x 6 - 10 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Press inclinado en smith": { "trabajo": "1 serie x 6 - 10 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Press pecho en maquina": { "trabajo": "1 serie x 6 - 10 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Press militar en maquina": { "trabajo": "1 serie x 6 - 10 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Curl biceps en polea alta unilateral": { "trabajo": "1 serie x 6 - 10 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Extensión triceps polea unilateral": { "trabajo": "1 serie x 6 - 10 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Aducción en Maquina": { "trabajo": "1 serie x 6 - 15 reps\n1 serie x 1 - 6 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nGuradar 5 a 10 reps\nFallo" },
    "Curl Isquios Sentado en Maquina": { "trabajo": "1 serie x 6 - 15 reps\n1 serie x 1 - 6 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nGuradar 5 a 10 reps\nFallo" },
    "Extensión Cuadriceps en Maquina": { "trabajo": "1 serie x 1 - 6 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Sentadilla en smith": { "trabajo": "2 serie x 1 - 6 reps\n2 series x 6-10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Peso Muerto Rumano con Mancuernas": { "trabajo": "2 serie x 1 - 6 reps\n2 series x 4 - 8 reps", "intensidad": "Guradar 5 a 10 reps\nGuradar 1 a 2 reps" },
    "Crunch Polea o Maquina": { "trabajo": "1 serie x 1 - 6 reps\n3 series x 6 -10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Elevaciones Laterales en polea": { "trabajo": "1 serie x 10 - 15 reps\n2 series x 10 - 15 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Apertura en maquina unilateral": { "trabajo": "1 serie x 1 - 6 reps\n2 series x 10 - 15 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Press inclinado con mancuernas": { "trabajo": "1 serie x 1 - 6 reps\n2 series x 9 - 12 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Press militar con mancuernas": { "trabajo": "1 serie x 1 - 6 reps\n2 series x 9 - 12 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Press frances": { "trabajo": "2 series x 10 - 15 reps", "intensidad": "Fallo" },
    "Remo con mancuernas": { "trabajo": "1 serie x 1 - 6 reps\n2 series x 6 - 10 reps", "intensidad": "Guradar 5 a 10 reps\nFallo" },
    "Remo en maquina con agarre neutro": { "trabajo": "2 series x 9 - 12 reps", "intensidad": "Fallo" },
    "Curl biceps bayesian": { "trabajo": "2 series x 10 - 15 reps", "intensidad": "Fallo" },
    "Curl biceps con barra prono": { "trabajo": "2 series x 6 - 10 reps", "intensidad": "Fallo" }
};


// App State
let currentUserEmail = null;
let currentSession = {
    date: new Date().toISOString(),
    logs: {} // { "exerciseName": { 1: [ { reps, weight } ], 2: [ ... ] } }
};
let activeExercise = null;
let activeDay = null;
let currentWeek = 1;
let maxWeek = 1;

// DOM Elements
const screenLogin = document.getElementById('screen-login');
const screenHome = document.getElementById('screen-home');
const screenSelectDay = document.getElementById('screen-select-day');
const screenExercises = document.getElementById('screen-exercises');
const screenActiveExercise = document.getElementById('screen-active-exercise');

const btnLogin = document.getElementById('btn-login');
const btnStartDay = document.getElementById('btn-start-day');
const btnBackHome = document.getElementById('btn-back-home');
const btnBackDays = document.getElementById('btn-back-days');
const btnBackExercises = document.getElementById('btn-back-exercises');
const btnSaveSet = document.getElementById('btn-save-set');

const inputEmail = document.getElementById('input-email');
const dayListContainer = document.getElementById('day-list');
const btnAddDay = document.getElementById('btn-add-day');
const btnAddExercise = document.getElementById('btn-add-exercise');
const exerciseListContainer = document.getElementById('exercise-list');
const currentDayTitleEl = document.getElementById('current-day-title');
const currentExerciseNameEl = document.getElementById('current-exercise-name');
const btnEditDesc = document.getElementById('btn-edit-desc');
const descTrabajoEl = document.getElementById('desc-trabajo');
const descIntensidadEl = document.getElementById('desc-intensidad');
const inputWeight = document.getElementById('input-weight');
const inputReps = document.getElementById('input-reps');
const setsListEl = document.getElementById('sets-list');

// Setup editable exercise name
currentExerciseNameEl.contentEditable = "true";
currentExerciseNameEl.style.outline = "none";
currentExerciseNameEl.style.borderBottom = "1px dashed rgba(255,255,255,0.3)";
currentExerciseNameEl.style.display = "inline-block";
currentExerciseNameEl.addEventListener('blur', async () => {
    const newName = currentExerciseNameEl.textContent.trim();
    if (newName && newName !== activeExercise) {
        await renameExercise(activeExercise, newName);
    } else {
        currentExerciseNameEl.textContent = activeExercise;
    }
});
currentExerciseNameEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        currentExerciseNameEl.blur();
    }
});

// Week Navigation Elements
const btnPrevWeek = document.getElementById('btn-prev-week');
const btnNextWeek = document.getElementById('btn-next-week');
const btnAddWeek = document.getElementById('btn-add-week');
const currentWeekLabel = document.getElementById('current-week-label');
const consistencyContainer = document.getElementById('consistency-tracker');

// Toast notification system
const toastEl = document.getElementById('toast');
let toastTimeout = null;

function showToast(message, type = 'info') {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastEl.textContent = message;
    toastEl.className = `toast toast-${type} toast-show`;
    toastTimeout = setTimeout(() => {
        toastEl.classList.remove('toast-show');
    }, 2000);
}

function normalizeText(text) {
    if (!text) return '';
    return text.toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function stripDayPrefix(dayName) {
    if (typeof dayName !== 'string') return dayName;
    // Matches "Día 1: Pecho", "Día 1 Pecho", "Dia 1: Pecho", etc.
    return dayName.replace(/^(D[ií]a\s*\d+[:\s-]*)/i, '').trim();
}

// Custom Modal Prompt system
const modalOverlay = document.getElementById('modal-overlay');
const modalLabel = document.getElementById('modal-label');
const modalInput = document.getElementById('modal-input');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');

function showModal(label, placeholder = '') {
    return new Promise((resolve) => {
        modalLabel.innerHTML = label; // Support HTML
        modalInput.style.display = 'block'; // Ensure input is visible
        modalInput.placeholder = placeholder;
        modalInput.value = '';
        modalOverlay.classList.remove('hidden');
        setTimeout(() => modalInput.focus(), 100);

        function onConfirm() {
            cleanup();
            resolve(modalInput.value.trim() || null);
        }

        function onCancel() {
            cleanup();
            resolve(null);
        }

        function onKeydown(e) {
            if (e.key === 'Enter') onConfirm();
            if (e.key === 'Escape') onCancel();
        }

        function cleanup() {
            modalOverlay.classList.add('hidden');
            modalConfirm.removeEventListener('click', onConfirm);
            modalCancel.removeEventListener('click', onCancel);
            modalOverlay.removeEventListener('click', onOverlayClick);
            document.removeEventListener('keydown', onKeydown);
        }

        function onOverlayClick(e) {
            if (e.target === modalOverlay) onCancel();
        }

        modalConfirm.addEventListener('click', onConfirm);
        modalCancel.addEventListener('click', onCancel);
        modalOverlay.addEventListener('click', onOverlayClick);
        document.addEventListener('keydown', onKeydown);
    });
}

function showConfirm(labelHtml) {
    return new Promise((resolve) => {
        modalLabel.innerHTML = labelHtml;
        modalInput.style.display = 'none'; // Hide input for purely confirm dialogs
        modalOverlay.classList.remove('hidden');
        
        // Change confirm button color to red for deletions
        const originalBg = modalConfirm.style.background;
        modalConfirm.style.background = '#ef4444';
        modalConfirm.textContent = 'Eliminar';

        function onConfirm() {
            cleanup();
            resolve(true);
        }

        function onCancel() {
            cleanup();
            resolve(false);
        }

        function onKeydown(e) {
            if (e.key === 'Enter') onConfirm();
            if (e.key === 'Escape') onCancel();
        }

        function cleanup() {
            modalOverlay.classList.add('hidden');
            modalInput.style.display = ''; // Reset display style
            modalConfirm.style.background = originalBg; // Reset color
            modalConfirm.textContent = 'Confirmar'; // Reset text
            modalConfirm.removeEventListener('click', onConfirm);
            modalCancel.removeEventListener('click', onCancel);
            modalOverlay.removeEventListener('click', onOverlayClick);
            document.removeEventListener('keydown', onKeydown);
        }

        function onOverlayClick(e) {
            if (e.target === modalOverlay) onCancel();
        }

        modalConfirm.addEventListener('click', onConfirm);
        modalCancel.addEventListener('click', onCancel);
        modalOverlay.addEventListener('click', onOverlayClick);
        document.addEventListener('keydown', onKeydown);
    });
}

// UI Navigation
function showScreen(screen) {
    screenLogin.classList.add('hidden');
    screenHome.classList.add('hidden');
    screenSelectDay.classList.add('hidden');
    screenExercises.classList.add('hidden');
    screenActiveExercise.classList.add('hidden');
    screen.classList.remove('hidden');

    if (screen === screenHome) {
        renderConsistencyTracker();
    }
}

// Database sync logic
async function syncSessionToFirestore() {
    if (!currentUserEmail) return;
    try {
        await setDoc(doc(db, "workouts", currentUserEmail), currentSession);
    } catch (e) {
        console.error("Error al guardar en Firestore: ", e);
    }
}

// Helper to find the maximum week number based on calendar progression since registration
function calculateMaxWeek() {
    if (!currentSession.registrationDate) return 1;

    const getMonday = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const mon = new Date(date.setDate(diff));
        mon.setHours(0, 0, 0, 0);
        return mon;
    };

    const regMon = getMonday(new Date(currentSession.registrationDate));
    const todayMon = getMonday(new Date());

    const diffTime = todayMon - regMon;
    if (diffTime < 0) return 1;

    const weeksDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return weeksDiff + 1;
}

function migrateSessionData() {
    let modified = false;

    // 1. Migrate Days from string[] to {id, name}[]
    if (currentSession.days && currentSession.days.length > 0) {
        // If they are still strings, migrate to objects
        if (typeof currentSession.days[0] === 'string') {
            modified = true;
            currentSession.days = currentSession.days.map(dayStr => ({
                id: dayStr,
                name: stripDayPrefix(dayStr) || dayStr
            }));
        }
        
        // Also handle deduplication/normalization on names if needed
        const dayMap = {};
        const newDays = [];
        currentSession.days.forEach(dayObj => {
            const norm = normalizeText(dayObj.id);
            if (!dayMap[norm]) {
                dayMap[norm] = dayObj;
                newDays.push(dayObj);
            } else {
                // Duplicate ID found, merge maps
                const can = dayMap[norm].id;
                const dup = dayObj.id;
                
                if (currentSession.customExercises && currentSession.customExercises[dup]) {
                    if (!currentSession.customExercises[can]) currentSession.customExercises[can] = [];
                    currentSession.customExercises[dup].forEach(ex => {
                        if (!currentSession.customExercises[can].includes(ex)) currentSession.customExercises[can].push(ex);
                    });
                    delete currentSession.customExercises[dup];
                }
                if (currentSession.hiddenExercises && currentSession.hiddenExercises[dup]) {
                    if (!currentSession.hiddenExercises[can]) currentSession.hiddenExercises[can] = [];
                    currentSession.hiddenExercises[dup].forEach(ex => {
                        if (!currentSession.hiddenExercises[can].includes(ex)) currentSession.hiddenExercises[can].push(ex);
                    });
                    delete currentSession.hiddenExercises[dup];
                }
                if (currentSession.exerciseOrder && currentSession.exerciseOrder[dup]) {
                    delete currentSession.exerciseOrder[dup];
                }
            }
        });
        currentSession.days = newDays;
    }

    // 2. Migrate Exercises (Logs and custom config)
    const exMap = {};
    const logKeys = Object.keys(currentSession.logs || {});

    // Known canonicals
    const allKnownExNorms = {};
    for (const cat in exercisesByCategory) {
        exercisesByCategory[cat].forEach(ex => allKnownExNorms[normalizeText(ex)] = ex);
    }
    for (const ex in exerciseDetails) {
        allKnownExNorms[normalizeText(ex)] = ex;
    }

    logKeys.forEach(exKey => {
        const norm = normalizeText(exKey);
        let canonical = allKnownExNorms[norm];
        if (!canonical) {
            if (!exMap[norm]) {
                exMap[norm] = exKey;
                canonical = exKey;
            } else {
                canonical = exMap[norm];
            }
        }

        if (canonical && canonical !== exKey) {
            modified = true;
            if (!currentSession.logs[canonical]) currentSession.logs[canonical] = {};
            
            const sourceWeeks = currentSession.logs[exKey];
            for (const week in sourceWeeks) {
                if (!currentSession.logs[canonical][week]) currentSession.logs[canonical][week] = [];
                currentSession.logs[canonical][week].push(...sourceWeeks[week]);
            }
            delete currentSession.logs[exKey];
        } else {
            exMap[norm] = canonical;
        }
    });

    if (currentSession.customDescriptions) {
        Object.keys(currentSession.customDescriptions).forEach(exKey => {
            const norm = normalizeText(exKey);
            const canonical = allKnownExNorms[norm] || exMap[norm] || exKey;
            if (canonical !== exKey) {
                modified = true;
                currentSession.customDescriptions[canonical] = currentSession.customDescriptions[exKey];
                delete currentSession.customDescriptions[exKey];
            }
        });
    }

    if (currentSession.customExercises) {
        for (const cat in currentSession.customExercises) {
            const newList = [];
            currentSession.customExercises[cat].forEach(ex => {
                if (!ex) return; // ignore nulls
                const norm = normalizeText(ex);
                const canonical = allKnownExNorms[norm] || exMap[norm] || ex;
                if (canonical !== ex) modified = true;
                if (!newList.includes(canonical)) newList.push(canonical);
            });
            currentSession.customExercises[cat] = newList;
        }
    }

    if (currentSession.hiddenExercises) {
        for (const cat in currentSession.hiddenExercises) {
            const newList = [];
            currentSession.hiddenExercises[cat].forEach(ex => {
                if (!ex) return;
                const norm = normalizeText(ex);
                const canonical = allKnownExNorms[norm] || exMap[norm] || ex;
                if (canonical !== ex) modified = true;
                if (!newList.includes(canonical)) newList.push(canonical);
            });
            currentSession.hiddenExercises[cat] = newList;
        }
    }

    if (currentSession.exerciseOrder) {
        for (const cat in currentSession.exerciseOrder) {
            const newList = [];
            currentSession.exerciseOrder[cat].forEach(ex => {
                if (!ex) return;
                const norm = normalizeText(ex);
                const canonical = allKnownExNorms[norm] || exMap[norm] || ex;
                if (canonical !== ex) modified = true;
                if (!newList.includes(canonical)) newList.push(canonical);
            });
            currentSession.exerciseOrder[cat] = newList;
        }
    }

    return modified;
}

async function loadSessionFromFirestore() {
    if (!currentUserEmail) return;
    try {
        const docSnap = await getDoc(doc(db, "workouts", currentUserEmail));
        if (docSnap.exists()) {
            currentSession = docSnap.data();
            // Asegurarse de que logs y days existen
            if (!currentSession.logs) currentSession.logs = {};
            if (!currentSession.customExercises) currentSession.customExercises = {};
            if (!currentSession.customDescriptions) currentSession.customDescriptions = {};
            if (!currentSession.trainingDates) currentSession.trainingDates = [];
            if (!currentSession.registrationDate) {
                currentSession.registrationDate = currentSession.date || new Date().toISOString();
            }

            // Sync currentWeek and maxWeek with LOADED data
            maxWeek = calculateMaxWeek();
            currentWeek = maxWeek;

            // Automatically fix case-sensitivity duplicated data
            const wasModified = migrateSessionData();
            if (wasModified) {
                // Background save the migrated structure back to firestore
                syncSessionToFirestore();
            }
        } else {
            // New user, save default structure
            currentSession = {
                date: new Date().toISOString(),
                registrationDate: new Date().toISOString(),
                logs: {},
                customExercises: {},
                customDescriptions: {},
                trainingDates: [],
                days: []
            };
            maxWeek = 1;
            currentWeek = 1;
            await syncSessionToFirestore();
        }
    } catch (e) {
        console.error("Error al cargar desde Firestore: ", e);
    }
}

function renderConsistencyTracker() {
    if (!consistencyContainer) return;
    consistencyContainer.innerHTML = '';

    const trainingDates = currentSession.trainingDates || [];
    const goalPerWeek = currentSession.days ? currentSession.days.length : 3;

    // Helper: Get Monday of the week for a given date
    const getMonday = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const mon = new Date(date.setDate(diff));
        mon.setHours(0, 0, 0, 0);
        return mon;
    };

    const today = new Date();
    const currentMonday = getMonday(today);

    // Identify current displayed max week (either global or from dates)
    const effectiveMaxWeek = Math.max(currentWeek, maxWeek);

    // Calculate Streak (Weekly)
    let streakWeeks = 0;
    let weekToStartChecking = effectiveMaxWeek;

    while (weekToStartChecking >= 1) {
        // Correct check for week N:
        // Use trainingDates if they fall in the range for weekly index N
        // Since we don't have perfect mapping for past weeks without dates,
        // if trainingDates are missing for a historical week index, check logs.

        let metGoal = false;

        // 1. Check if ANY exercise has logs for this week index
        let exercisesInWeek = 0;
        Object.values(currentSession.logs).forEach(exLogs => {
            if (exLogs[weekToStartChecking] && exLogs[weekToStartChecking].length > 0) {
                exercisesInWeek++;
            }
        });

        // If exercises found > 0, we can assume goal met or at least effort
        // For simplicity, if they have logs for at least 'goalPerWeek' exercises (approx)
        // or if they used the new trainingDates recently.

        // 2. Check trainingDates for current week range
        const weekMonday = new Date(currentMonday);
        weekMonday.setDate(currentMonday.getDate() - (effectiveMaxWeek - weekToStartChecking) * 7);
        const weekSunday = new Date(weekMonday);
        weekSunday.setDate(weekMonday.getDate() + 6);
        weekSunday.setHours(23, 59, 59, 999);

        const trainedDaysCount = trainingDates.filter(d => {
            const dt = new Date(d + 'T12:00:00');
            return dt >= weekMonday && dt <= weekSunday;
        }).length;

        // Met goal if: new system has enough dates OR old system has logs
        // (Old system doesn't know 'days', so we use a heuristic: if they have logs, they worked)
        if (trainedDaysCount >= goalPerWeek || (trainedDaysCount === 0 && exercisesInWeek >= goalPerWeek)) {
            metGoal = true;
        }

        if (metGoal) {
            streakWeeks++;
            weekToStartChecking--;
        } else {
            // Only break streak if it's not the current week (which is in progress)
            if (weekToStartChecking === effectiveMaxWeek) {
                weekToStartChecking--;
            } else {
                break;
            }
        }
    }

    // Render Weeks
    const dayNamesShort = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const todayStr = today.toLocaleDateString('sv-SE'); // YYYY-MM-DD in local time

    for (let w = effectiveMaxWeek; w >= 1; w--) {
        const weekMonday = new Date(currentMonday);
        weekMonday.setDate(currentMonday.getDate() - (effectiveMaxWeek - w) * 7);

        const isCurrentWeek = w === effectiveMaxWeek;

        // Count training days in this specific week
        const weekSun = new Date(weekMonday);
        weekSun.setDate(weekMonday.getDate() + 6);
        weekSun.setHours(23, 59, 59, 999);

        const trainedDaysInWeek = trainingDates.filter(d => {
            const dt = new Date(d + 'T12:00:00');
            return dt >= weekMonday && dt <= weekSun;
        });

        // Fallback for logs-based history
        let exercisesInWeek = 0;
        Object.values(currentSession.logs).forEach(exLogs => {
            if (exLogs[w] && exLogs[w].length > 0) exercisesInWeek++;
        });

        const displayCount = Math.max(trainedDaysInWeek.length, (trainedDaysInWeek.length === 0 && exercisesInWeek > 0) ? goalPerWeek : 0);
        const isGoalMet = displayCount >= goalPerWeek;

        let gridHtml = '';
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekMonday);
            d.setDate(weekMonday.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const isActive = trainingDates.includes(dateStr);
            const isDayToday = dateStr === todayStr;

            gridHtml += `
                <div class="day-dot-container">
                    <div class="day-dot ${isActive ? 'active' : ''} ${isDayToday ? 'today' : ''}">
                        ${isActive ? '✓' : dayNamesShort[i]}
                    </div>
                </div>
            `;
        }

        const weekCard = document.createElement('div');
        weekCard.className = `week-card ${isCurrentWeek ? '' : 'past-week'}`;
        weekCard.innerHTML = `
            <div class="week-label-main">SEMANA ${w} ${isCurrentWeek ? '(ACTUAL)' : ''}</div>
            <div class="consistency-header">
                <span class="consistency-title">Meta: ${goalPerWeek} días</span>
                ${isCurrentWeek ? `
                    <div class="streak-badge">
                        <span>🔥</span>
                        <span>${streakWeeks} ${streakWeeks === 1 ? 'SEMANA' : 'SEMANAS'}</span>
                    </div>
                ` : ''}
            </div>
            <div class="consistency-grid">
                ${gridHtml}
            </div>
            <p class="consistency-summary">
                ${isGoalMet
                ? `<strong>¡Meta cumplida!</strong> 🏆`
                : `<strong>${displayCount} de ${goalPerWeek}</strong> días entrenados.`}
            </p>
        `;
        consistencyContainer.appendChild(weekCard);
    }
}

function renderDayList() {
    dayListContainer.innerHTML = '';

    if (!currentSession.days || currentSession.days.length === 0) {
        dayListContainer.innerHTML = `
            <div class="empty-state">
                <p>Agrega los días que vas a entrenar para empezar.</p>
            </div>
        `;
        return;
    }

    let draggedDayIndex = null;
    let draggedOverDayIndex = null;

    const applyDayReorder = async () => {
        if (draggedDayIndex === null || draggedOverDayIndex === null || draggedDayIndex === draggedOverDayIndex) {
            draggedDayIndex = null;
            draggedOverDayIndex = null;
            return;
        }
        const itemToMove = currentSession.days.splice(draggedDayIndex, 1)[0];
        currentSession.days.splice(draggedOverDayIndex, 0, itemToMove);
        
        draggedDayIndex = null;
        draggedOverDayIndex = null;
        renderDayList();
        await syncSessionToFirestore();
    };

    currentSession.days.forEach((dayObj, index) => {
        const dayId = dayObj.id;
        const dayName = dayObj.name;

        // Container
        const container = document.createElement('div');
        container.className = 'list-item-container';

        // Delete Background
        const deleteBg = document.createElement('div');
        deleteBg.className = 'swipe-delete-bg';
        deleteBg.innerHTML = '🗑️';

        // Swipe Content Wrapper
        const swipeContent = document.createElement('div');
        swipeContent.className = 'swipe-content';

        const row = document.createElement('div');
        row.className = 'list-row';
        row.style.width = '100%';
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.dataset.index = index;

        // Drag Handle
        let wasDayDragged = false;
        const dragHandle = document.createElement('div');
        dragHandle.innerHTML = '≡';
        dragHandle.style.cursor = 'grab';
        dragHandle.style.color = 'rgba(255,255,255,0.35)';
        dragHandle.style.fontSize = '2rem';
        dragHandle.style.padding = '0.5rem 1.2rem';
        dragHandle.style.userSelect = 'none';
        dragHandle.style.touchAction = 'none';
        dragHandle.draggable = true;

        const btn = document.createElement('button');
        btn.className = 'day-btn';
        btn.style.flexGrow = '1';
        btn.style.textAlign = 'left';
        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.style.padding = '1rem';
        btn.innerHTML = `<span style="color:var(--accent); font-weight:800; margin-right:8px;">DÍA ${index + 1}</span> <span>${dayName}</span>`;
        
        btn.addEventListener('click', () => {
            if (wasDayDragged) {
                wasDayDragged = false;
                return;
            }
            activeDay = dayId;
            currentSession.date = new Date().toISOString();
            renderExerciseList(activeDay);
            showScreen(screenExercises);
        });

        const performDelete = async () => {
            const confirmed = await showConfirm(`¿Estás seguro de que deseas eliminar <strong>"${dayName}"</strong>?<br><br><span style="color:var(--accent); font-size:0.9rem;">⚠️ ADVERTENCIA: Se borrará toda la historia de las series acumulada en este día.</span>`);
            if (!confirmed) {
                swipeContent.style.transform = `translateX(0)`;
                return;
            }

            currentSession.days.splice(index, 1);
            
            // Clean up dependent data
            if(currentSession.customExercises?.[dayId]) delete currentSession.customExercises[dayId];
            if(currentSession.hiddenExercises?.[dayId]) delete currentSession.hiddenExercises[dayId];
            if(currentSession.exerciseOrder?.[dayId]) delete currentSession.exerciseOrder[dayId];

            renderDayList();
            showToast('🗑 Día eliminado', 'error');
            await syncSessionToFirestore();
        };

        // Swipe events for Day Delete
        let startX = 0;
        let currentX = 0;
        let isSwiping = false;
        
        swipeContent.addEventListener('pointerdown', (e) => {
            if(e.button !== 0 && e.pointerType === 'mouse') return;
            isSwiping = true;
            startX = e.clientX;
            swipeContent.style.transition = 'none';
        });

        swipeContent.addEventListener('pointermove', (e) => {
            if (!isSwiping) return;
            currentX = e.clientX;
            let diff = Math.max(0, currentX - startX);
            if (diff > 150) diff = 150 + (diff - 150) * 0.2;
            swipeContent.style.transform = `translateX(${diff}px)`;
        });

        const endSwipe = () => {
            if (!isSwiping) return;
            isSwiping = false;
            swipeContent.style.transition = 'transform 0.3s ease-out';
            if (currentX - startX > 120) {
                swipeContent.style.transform = `translateX(100%)`;
                setTimeout(performDelete, 300);
            } else {
                swipeContent.style.transform = `translateX(0)`;
            }
        };

        swipeContent.addEventListener('pointerup', endSwipe);
        swipeContent.addEventListener('pointercancel', endSwipe);
        swipeContent.addEventListener('pointerleave', endSwipe);

        // Smooth Drag and Drop for Days
        let touchStartY = 0;
        let holdTimeout = null;
        let isDraggingTouch = false;
        let ghostEl = null;
        let touchOffsetY = 0;

        const cleanUpDayDrag = () => {
            if (ghostEl) { ghostEl.remove(); ghostEl = null; }
            container.style.opacity = '1';
            dayListContainer.style.overflow = '';
            Array.from(dayListContainer.children).forEach(child => {
                child.style.transform = '';
                child.style.transition = '';
            });
        };

        dragHandle.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return;
            touchStartY = e.touches[0].clientY;
            holdTimeout = setTimeout(() => {
                isDraggingTouch = true;
                wasDayDragged = true;
                draggedDayIndex = index;
                if (navigator.vibrate) navigator.vibrate(40);

                const rect = container.getBoundingClientRect();
                touchOffsetY = touchStartY - rect.top;
                ghostEl = container.cloneNode(true);
                ghostEl.style.position = 'fixed';
                ghostEl.style.left = rect.left + 'px';
                ghostEl.style.top = rect.top + 'px';
                ghostEl.style.width = rect.width + 'px';
                ghostEl.style.zIndex = '9999';
                ghostEl.style.opacity = '0.9';
                ghostEl.style.pointerEvents = 'none';
                ghostEl.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
                ghostEl.style.transform = 'scale(1.04)';
                document.body.appendChild(ghostEl);

                container.style.opacity = '0.2';
            }, 100);
        }, {passive: true});

        dragHandle.addEventListener('touchmove', (e) => {
            if (!isDraggingTouch) {
                if (Math.abs(e.touches[0].clientY - touchStartY) > 10) clearTimeout(holdTimeout);
                return;
            }
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            ghostEl.style.top = (touchY - touchOffsetY) + 'px';

            ghostEl.style.display = 'none';
            const element = document.elementFromPoint(e.touches[0].clientX, touchY);
            ghostEl.style.display = '';

            let newOverIndex = draggedOverDayIndex;
            if (element) {
                const targetContainer = element.closest('.list-item-container');
                if (targetContainer && targetContainer !== container) {
                    const rowEl = targetContainer.querySelector('.list-row');
                    if (rowEl) newOverIndex = parseInt(rowEl.dataset.index);
                }
            }

            if (newOverIndex !== draggedOverDayIndex) {
                draggedOverDayIndex = newOverIndex;
                Array.from(dayListContainer.children).forEach((child, i) => {
                    if (i === draggedDayIndex) return;
                    child.style.transition = 'transform 0.18s ease';
                    const childRow = child.querySelector('.list-row');
                    const ci = childRow ? parseInt(childRow.dataset.index) : i;
                    if (draggedDayIndex < draggedOverDayIndex) {
                        child.style.transform = (ci > draggedDayIndex && ci <= draggedOverDayIndex) ? 'translateY(-100%)' : '';
                    } else {
                        child.style.transform = (ci >= draggedOverDayIndex && ci < draggedDayIndex) ? 'translateY(100%)' : '';
                    }
                });
            }
        }, {passive: false});

        dragHandle.addEventListener('touchend', () => {
            clearTimeout(holdTimeout);
            if (!isDraggingTouch) return;
            isDraggingTouch = false;
            cleanUpDayDrag();
            applyDayReorder();
            setTimeout(() => { wasDayDragged = false; }, 100);
        });

        // Mouse Drag (simple reorder logic)
        dragHandle.addEventListener('dragstart', (e) => {
            draggedDayIndex = index;
            container.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = "move";
            const rect = container.getBoundingClientRect();
            e.dataTransfer.setDragImage(container, e.clientX - rect.left, e.clientY - rect.top);
        });

        row.addEventListener('dragover', (e) => {
            e.preventDefault();
            draggedOverDayIndex = index;
        });

        row.addEventListener('dragend', () => {
            container.style.opacity = '1';
            applyDayReorder();
        });

        row.appendChild(btn);
        row.appendChild(dragHandle);
        swipeContent.appendChild(row);
        container.appendChild(deleteBg);
        container.appendChild(swipeContent);
        dayListContainer.appendChild(container);
    });
}

// Initialize Exercise List for a specific day
function renderExerciseList(dayId) {
    exerciseListContainer.innerHTML = '';
    
    const dayObj = (currentSession.days || []).find(d => d.id === dayId);
    currentDayTitleEl.textContent = dayObj ? dayObj.name : dayId;

    // Find standard exercises by normalizing the name (not ID)
    let standardExs = [];
    const normalizedDayName = normalizeText(dayObj ? dayObj.name : dayId);

    for (const key in exercisesByCategory) {
        // Try exact match on ID first (legacy)
        if (key === dayId) {
            standardExs = exercisesByCategory[key];
            break;
        }
        // Try matching by zone name only
        if (normalizeText(stripDayPrefix(key)) === normalizedDayName) {
            standardExs = exercisesByCategory[key];
            break;
        }
    }

    const hidden = currentSession.hiddenExercises?.[dayId] || [];
    const customExs = currentSession.customExercises[dayId] || [];
    let allExercises = [
        ...standardExs.filter(e => !hidden.includes(e)),
        ...customExs
    ];

    // Read saved order if it exists, use it to sort
    if (!currentSession.exerciseOrder) currentSession.exerciseOrder = {};
    if (currentSession.exerciseOrder[dayId]) {
        const orderArray = currentSession.exerciseOrder[dayId];
        allExercises.sort((a, b) => {
            let indexA = orderArray.indexOf(a);
            let indexB = orderArray.indexOf(b);
            // If an exercise is not in the order array (e.g., new custom exercise), append it to the end
            if (indexA === -1) indexA = 9999;
            if (indexB === -1) indexB = 9999;
            return indexA - indexB;
        });
    }

    // Save current active list order for potential moves later
    currentSession.exerciseOrder[dayId] = [...allExercises];

    if (allExercises.length === 0) {
        exerciseListContainer.innerHTML = `
            <div class="empty-state">
                <p>Agrega los ejercicios que harás este día.</p>
            </div>
        `;
        return;
    }

    let draggedItemIndex = null;
    let draggedOverItemIndex = null;

    allExercises.forEach((ex, index) => {
        const isCustom = customExs.includes(ex);

        // Container
        const container = document.createElement('div');
        container.className = 'list-item-container';

        // Delete Background
        const deleteBg = document.createElement('div');
        deleteBg.className = 'swipe-delete-bg';
        deleteBg.innerHTML = '🗑️';

        // Swipe Content Wrapper
        const swipeContent = document.createElement('div');
        swipeContent.className = 'swipe-content';

        const row = document.createElement('div');
        row.className = 'list-row';
        row.style.width = '100%';
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '0'; 
        row.style.background = 'var(--card-bg)';
        row.style.border = '1px solid var(--glass-border)';
        row.style.borderRadius = '12px';
        row.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        row.dataset.index = index; // Store index for reordering
        row.draggable = false; // Disable direct row dragging for mouse


        // Drag Handle
        let wasDragged = false;
        const dragHandle = document.createElement('div');
        dragHandle.innerHTML = '≡';
        dragHandle.style.cursor = 'grab';
        dragHandle.style.color = 'rgba(255,255,255,0.35)';
        dragHandle.style.fontSize = '2rem';
        dragHandle.style.padding = '0.5rem 1rem';
        dragHandle.style.userSelect = 'none';
        dragHandle.style.touchAction = 'none';
        dragHandle.draggable = true; // Handle is the draggable part for mouse


        const btn = document.createElement('button');
        btn.className = 'exercise-btn';
        btn.style.flexGrow = '1';
        btn.style.textAlign = 'left';
        btn.style.background = 'transparent'; 
        btn.style.border = 'none'; 
        btn.style.boxShadow = 'none';
        btn.style.padding = '1rem';
        btn.innerHTML = `<span>${ex}</span>`;
        btn.addEventListener('click', (e) => {
            if (wasDragged) {
                e.preventDefault();
                wasDragged = false;
                return;
            }
            openExercise(ex);
        });

        const performDelete = async () => {
            const confirmed = await showConfirm(`¿Estás seguro de que deseas eliminar <strong>"${ex}"</strong>?<br><br><span style="color:var(--accent); font-size:0.9rem;">⚠️ ADVERTENCIA: Se perderá el acceso rápido a la historia de las series de este ejercicio.</span>`);
            if (!confirmed) {
                swipeContent.style.transform = `translateX(0)`;
                return;
            }

            if (isCustom) {
                const customList = currentSession.customExercises[dayId];
                const customIndex = customList.indexOf(ex);
                if (customIndex > -1) customList.splice(customIndex, 1);
            } else {
                if (!currentSession.hiddenExercises) currentSession.hiddenExercises = {};
                if (!currentSession.hiddenExercises[dayId]) currentSession.hiddenExercises[dayId] = [];
                currentSession.hiddenExercises[dayId].push(ex);
            }
            const activeOrder = currentSession.exerciseOrder && currentSession.exerciseOrder[dayId];
            if (activeOrder) {
                const orderIdx = activeOrder.indexOf(ex);
                if (orderIdx > -1) activeOrder.splice(orderIdx, 1);
            }
            
            // Note: We don't delete logs so history works, just hide the exercise

            renderExerciseList(dayId);
            showToast('🗑 Ejercicio eliminado', 'error');
            await syncSessionToFirestore();
        };

        // Swipe events for DELETE
        let startX = 0;
        let currentX = 0;
        let isSwiping = false;
        
        swipeContent.addEventListener('pointerdown', (e) => {
            if(e.button !== 0 && e.pointerType === 'mouse') return;
            
            isSwiping = true;
            startX = e.clientX;
            swipeContent.style.transition = 'none';
        });

        swipeContent.addEventListener('pointermove', (e) => {
            if (!isSwiping) return;
            currentX = e.clientX;
            let diff = currentX - startX;
            if (diff < 0) diff = 0; // only swipe right

            if (diff > 150) {
                diff = 150 + (diff - 150) * 0.2;
            }
            swipeContent.style.transform = `translateX(${diff}px)`;
        });

        const endSwipe = () => {
            if (!isSwiping) return;
            isSwiping = false;
            swipeContent.style.transition = 'transform 0.3s ease-out';
            
            let diff = currentX - startX;
            if (diff > 120) {
                swipeContent.style.transform = `translateX(100%)`;
                setTimeout(performDelete, 300);
            } else {
                swipeContent.style.transform = `translateX(0)`;
            }
        };

        swipeContent.addEventListener('pointerup', endSwipe);
        swipeContent.addEventListener('pointercancel', endSwipe);
        swipeContent.addEventListener('pointerleave', endSwipe);

        // --- Drag and Drop Logic for REORDERING (Mouse & Touch on Handle) ---

        const applyReorder = async () => {
            if (draggedItemIndex === null || draggedOverItemIndex === null || draggedItemIndex === draggedOverItemIndex) {
                draggedItemIndex = null;
                draggedOverItemIndex = null;
                // Restore opacity in case drop was at same position
                container.style.opacity = '1';
                Array.from(exerciseListContainer.children).forEach(child => {
                    child.style.transform = '';
                    child.style.transition = '';
                });
                return;
            }
            const list = currentSession.exerciseOrder[dayId];
            const itemToMove = list.splice(draggedItemIndex, 1)[0];
            list.splice(draggedOverItemIndex, 0, itemToMove);
            
            draggedItemIndex = null;
            draggedOverItemIndex = null;
            renderExerciseList(dayId);
            await syncSessionToFirestore();
        };

        dragHandle.addEventListener('dragstart', (e) => {
            draggedItemIndex = parseInt(row.dataset.index);
            container.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = "move";
            // Use the container as the drag image
            const rect = container.getBoundingClientRect();
            e.dataTransfer.setDragImage(container, e.clientX - rect.left, e.clientY - rect.top);
        });

        row.addEventListener('dragover', (e) => {
            e.preventDefault(); 
            const tgtIndex = parseInt(row.dataset.index);
            if (tgtIndex !== draggedOverItemIndex) {
                draggedOverItemIndex = tgtIndex;
            }
        });

        row.addEventListener('dragenter', (e) => {
            e.preventDefault();
            container.style.borderTop = draggedItemIndex > parseInt(row.dataset.index) ? '2px solid var(--accent)' : '';
            container.style.borderBottom = draggedItemIndex < parseInt(row.dataset.index) ? '2px solid var(--accent)' : '';
        });

        row.addEventListener('dragleave', () => {
             container.style.borderTop = '';
             container.style.borderBottom = '';
        });

        row.addEventListener('drop', (e) => {
            e.preventDefault();
            container.style.borderTop = '';
            container.style.borderBottom = '';
        });

        row.addEventListener('dragend', () => {
            container.style.opacity = '1';
            Array.from(exerciseListContainer.children).forEach(child => {
                child.style.borderTop = '';
                child.style.borderBottom = '';
            });
            applyReorder();
        });

        let touchStartY = 0;
        let initialIndex = null;
        let holdTimeout = null;
        let isDraggingTouch = false;
        let ghostEl = null;
        let touchOffsetY = 0;

        const cleanUpDrag = () => {
            if (ghostEl) { ghostEl.remove(); ghostEl = null; }
            container.style.opacity = '0.3';
            exerciseListContainer.style.overflow = '';
            Array.from(exerciseListContainer.children).forEach(child => {
                child.style.transform = '';
                child.style.transition = '';
            });
        };

        dragHandle.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return;
            touchStartY = e.touches[0].clientY;
            isDraggingTouch = false;
            wasDragged = false;
            holdTimeout = setTimeout(() => {
                isDraggingTouch = true;
                wasDragged = true;
                initialIndex = parseInt(row.dataset.index);
                draggedItemIndex = initialIndex;
                if (navigator.vibrate) navigator.vibrate(40);

                // Create ghost element that floats under finger
                const rect = container.getBoundingClientRect();
                touchOffsetY = touchStartY - rect.top;
                ghostEl = container.cloneNode(true);
                ghostEl.style.position = 'fixed';
                ghostEl.style.left = rect.left + 'px';
                ghostEl.style.top = rect.top + 'px';
                ghostEl.style.width = rect.width + 'px';
                ghostEl.style.height = rect.height + 'px';
                ghostEl.style.margin = '0';
                ghostEl.style.zIndex = '9999';
                ghostEl.style.opacity = '0.9';
                ghostEl.style.pointerEvents = 'none';
                ghostEl.style.borderRadius = '12px';
                ghostEl.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
                ghostEl.style.transform = 'scale(1.04)';
                ghostEl.style.transition = 'transform 0.1s ease';
                document.body.appendChild(ghostEl);

                // Dim the real item
                container.style.opacity = '0.2';
                exerciseListContainer.style.overflow = 'visible';
            }, 100);
        }, {passive: true});

        dragHandle.addEventListener('touchmove', (e) => {
            if (!isDraggingTouch) {
                const touchY = e.touches[0].clientY;
                if (Math.abs(touchY - touchStartY) > 10) clearTimeout(holdTimeout);
                return;
            }
            e.preventDefault();
            if (draggedItemIndex === null || !ghostEl) return;

            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;

            // Move ghost
            ghostEl.style.top = (touchY - touchOffsetY) + 'px';

            // Find target position
            ghostEl.style.display = 'none';
            const element = document.elementFromPoint(touchX, touchY);
            ghostEl.style.display = '';

            let newOverIndex = draggedOverItemIndex;
            if (element) {
                const targetContainer = element.closest('.list-item-container');
                if (targetContainer && targetContainer !== container) {
                    const innerRow = targetContainer.querySelector('.list-row');
                    if (innerRow) newOverIndex = parseInt(innerRow.dataset.index);
                }
            }

            if (newOverIndex !== draggedOverItemIndex) {
                draggedOverIndex = newOverIndex;

                // Animate siblings to show insertion space
                Array.from(exerciseListContainer.children).forEach((child, i) => {
                    if (i === draggedItemIndex) return;
                    child.style.transition = 'transform 0.18s ease';
                    if (draggedOverItemIndex !== null) {
                        const childRow = child.querySelector('.list-row');
                        const ci = childRow ? parseInt(childRow.dataset.index) : i;
                        // If item is in the shifted zone, nudge it
                        if (draggedItemIndex < draggedOverItemIndex) {
                            // Moving down: nudge items between original and target UP
                            if (ci > draggedItemIndex && ci <= draggedOverItemIndex) {
                                child.style.transform = 'translateY(-100%)';
                            } else {
                                child.style.transform = '';
                            }
                        } else {
                            // Moving up: nudge items between target and original DOWN
                            if (ci >= draggedOverItemIndex && ci < draggedItemIndex) {
                                child.style.transform = 'translateY(100%)';
                            } else {
                                child.style.transform = '';
                            }
                        }
                    }
                });
            }
        }, {passive: false});

        dragHandle.addEventListener('touchend', () => {
            clearTimeout(holdTimeout);
            if (!isDraggingTouch) return;
            isDraggingTouch = false;

            cleanUpDrag();
            applyReorder();
            setTimeout(() => { wasDragged = false; }, 100);
        });

        dragHandle.addEventListener('touchcancel', () => {
            clearTimeout(holdTimeout);
            if (isDraggingTouch) {
                isDraggingTouch = false;
                draggedItemIndex = null;
                draggedOverItemIndex = null;
                cleanUpDrag();
                container.style.opacity = '1';
            }
        });

        row.appendChild(btn);
        row.appendChild(dragHandle);
        
        swipeContent.appendChild(row);
        container.appendChild(deleteBg);
        container.appendChild(swipeContent);
        exerciseListContainer.appendChild(container);
    });
}

function renderWeekNavigation() {
    currentWeekLabel.textContent = `Semana ${currentWeek}`;

    // Disable prev button if on week 1
    btnPrevWeek.style.opacity = currentWeek <= 1 ? "0.3" : "1";
    btnPrevWeek.style.pointerEvents = currentWeek <= 1 ? "none" : "auto";

    // Disable next button if on max week
    btnNextWeek.style.opacity = currentWeek >= maxWeek ? "0.3" : "1";
    btnNextWeek.style.pointerEvents = currentWeek >= maxWeek ? "none" : "auto";

    // Hide inputs for past weeks
    const isPastWeek = currentWeek < maxWeek;
    const inputGroup = document.querySelector('.input-group');
    if (inputGroup) {
        inputGroup.style.display = isPastWeek ? 'none' : 'flex';
    }
    if (btnSaveSet) {
        btnSaveSet.style.display = isPastWeek ? 'none' : 'block';
    }
}

// Logic Functions

// Resolves the canonical log key for an exercise, merging any mismatched case/accent keys on the fly
function resolveLogKey(exerciseName) {
    const normTarget = normalizeText(exerciseName);

    // 1. Check known predefined exercises first
    for (const cat in exercisesByCategory) {
        for (const ex of exercisesByCategory[cat]) {
            if (normalizeText(ex) === normTarget) return ex;
        }
    }
    // 2. Check existing log keys (in case it's a custom exercise that already has data)
    for (const logKey in currentSession.logs) {
        if (normalizeText(logKey) === normTarget) return logKey;
    }
    // 3. Fallback to the name as given
    return exerciseName;
}

async function renameExercise(oldName, newName) {
    if (!oldName || !newName || oldName === newName) return;

    // 1. Rename in logs
    if (currentSession.logs[oldName]) {
        currentSession.logs[newName] = currentSession.logs[oldName];
        delete currentSession.logs[oldName];
    }

    // 2. Rename in customDescriptions
    if (currentSession.customDescriptions && currentSession.customDescriptions[oldName]) {
        currentSession.customDescriptions[newName] = currentSession.customDescriptions[oldName];
        delete currentSession.customDescriptions[oldName];
    }

    // 3. Rename in Days (customExercises, exerciseOrder)
    if (currentSession.customExercises) {
        for (const day in currentSession.customExercises) {
            const idx = currentSession.customExercises[day].indexOf(oldName);
            if (idx !== -1) currentSession.customExercises[day][idx] = newName;
        }
    }

    if (currentSession.exerciseOrder) {
        for (const day in currentSession.exerciseOrder) {
            const idx = currentSession.exerciseOrder[day].indexOf(oldName);
            if (idx !== -1) currentSession.exerciseOrder[day][idx] = newName;
        }
    }

    // If it was a standard exercise, hide the old one and add the new one as custom
    let isStandard = false;
    for (const cat in exercisesByCategory) {
        if (exercisesByCategory[cat].includes(oldName)) {
            isStandard = true;
            break;
        }
    }

    if (isStandard && activeDay) {
        if (!currentSession.hiddenExercises) currentSession.hiddenExercises = {};
        if (!currentSession.hiddenExercises[activeDay]) currentSession.hiddenExercises[activeDay] = [];
        if (!currentSession.hiddenExercises[activeDay].includes(oldName)) {
            currentSession.hiddenExercises[activeDay].push(oldName);
        }

        if (!currentSession.customExercises) currentSession.customExercises = {};
        if (!currentSession.customExercises[activeDay]) currentSession.customExercises[activeDay] = [];
        if (!currentSession.customExercises[activeDay].includes(newName)) {
            currentSession.customExercises[activeDay].push(newName);
        }
    }

    activeExercise = newName;
    currentExerciseNameEl.textContent = newName;
    showToast('Nombre actualizado', 'success');
    await syncSessionToFirestore();
}

function openExercise(exerciseName) {
    // Resolve canonical key
    const canonicalName = resolveLogKey(exerciseName);
    activeExercise = canonicalName;
    currentExerciseNameEl.textContent = canonicalName;

    // If the display name differs from canonicalName, merge logs
    if (exerciseName !== canonicalName && currentSession.logs[exerciseName]) {
        if (!currentSession.logs[canonicalName]) currentSession.logs[canonicalName] = {};
        for (const week in currentSession.logs[exerciseName]) {
            if (!currentSession.logs[canonicalName][week]) currentSession.logs[canonicalName][week] = [];
            currentSession.logs[canonicalName][week].push(...currentSession.logs[exerciseName][week]);
        }
        delete currentSession.logs[exerciseName];
        // Background save the merge
        syncSessionToFirestore();
    }

    // Initialize log structure for exercise if new
    if (!currentSession.logs[activeExercise]) {
        currentSession.logs[activeExercise] = { 1: [] };
    }

    // Determine max week globally based on registration date
    maxWeek = calculateMaxWeek();

    // Set currentWeek to maxWeek if we were just opening the exercise, 
    // but don't reset it if the user is already navigating weeks? 
    // Actually, usually when opening an exercise you want to see the latest.
    currentWeek = maxWeek;

    renderWeekNavigation();

    // Set description details, checking custom desc first
    let details = currentSession.customDescriptions[exerciseName];
    if (!details) {
        details = exerciseDetails[exerciseName];
        if (!details) {
            const normalizedEx = normalizeText(exerciseName);
            for (const key in exerciseDetails) {
                if (normalizeText(key) === normalizedEx) {
                    details = exerciseDetails[key];
                    break;
                }
            }
        }
    }

    if (details) {
        descTrabajoEl.innerText = details.trabajo || "-";
        descIntensidadEl.innerText = details.intensidad || "-";
    } else {
        descTrabajoEl.innerText = "-";
        descIntensidadEl.innerText = "-";
    }

    // Reset edit mode
    descTrabajoEl.contentEditable = "false";
    descIntensidadEl.contentEditable = "false";
    btnEditDesc.textContent = "✎";

    // reset inputs
    inputWeight.value = '';
    inputReps.value = '';

    renderSets();
    showScreen(screenActiveExercise);
}

function saveSet() {
    const repsStr = inputReps.value.trim();
    let weightStr = inputWeight.value.trim().replace(',', '.'); // Handle comma as decimal separator

    if (!repsStr || !weightStr) {
        showToast("Por favor ingresa repeticiones y kilos.", "error");
        return;
    }

    const reps = Number(repsStr);
    const weight = Number(weightStr);

    if (isNaN(reps) || !Number.isInteger(reps) || reps <= 0) {
        showToast("Las repeticiones deben ser un número entero mayor a 0.", "error");
        return;
    }

    if (isNaN(weight) || weight < 0) {
        showToast("Por favor ingresa un peso (kilos) válido.", "error");
        return;
    }

    if (!currentSession.logs[activeExercise][currentWeek]) {
        currentSession.logs[activeExercise][currentWeek] = [];
    }

    currentSession.logs[activeExercise][currentWeek].push({ weight, reps });
    renderSets();
    showToast(`✅ Serie guardada: ${reps} reps x ${weight} kg`, 'success');

    // Record training date if not already recorded today
    const now = new Date();
    const todayStr = now.toLocaleDateString('sv-SE'); // YYYY-MM-DD in local time
    if (!currentSession.trainingDates) currentSession.trainingDates = [];
    if (!currentSession.trainingDates.includes(todayStr)) {
        currentSession.trainingDates.push(todayStr);
    }

    // Save to Firestore
    syncSessionToFirestore();

    // Clear reps for next set, keep weight usually
    inputReps.value = '';
    inputReps.focus();
}

function renderSets() {
    setsListEl.innerHTML = '';
    const logs = currentSession.logs[activeExercise][currentWeek] || [];

    if (logs.length === 0) {
        setsListEl.innerHTML = `<li>Aún no hay series en la Semana ${currentWeek}. ¡A darle! 💪</li>`;
        return;
    }

    logs.forEach((log, index) => {
        const li = document.createElement('li');
        li.className = 'list-row';
        const canEdit = currentWeek === maxWeek;
        const deleteBtnHtml = canEdit ? `<button class="delete-set-btn" data-index="${index}" title="Borrar serie">−</button>` : '';
        li.innerHTML = `
            ${deleteBtnHtml}
            <div class="set-item-box">
                <span class="set-label">Serie ${index + 1}</span>
                <span class="set-values">${log.reps} reps x ${log.weight} kg</span>
            </div>
        `;
        setsListEl.appendChild(li);
    });

    // Attach delete listeners
    setsListEl.querySelectorAll('.delete-set-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const i = parseInt(e.currentTarget.getAttribute('data-index'));
            currentSession.logs[activeExercise][currentWeek].splice(i, 1);
            renderSets();
            showToast('🗑 Serie eliminada', 'error');
            await syncSessionToFirestore();
        });
    });
}

// Event Listeners
btnLogin.addEventListener('click', async () => {
    const email = inputEmail.value.trim().toLowerCase();
    if (!email || !email.includes('@')) {
        showToast('Por favor ingresa un correo electrónico válido.', 'error');
        return;
    }
    currentUserEmail = email;
    await loadSessionFromFirestore();
    showScreen(screenHome);
});

btnStartDay.addEventListener('click', () => {
    // Show the day selection screen
    renderDayList();
    showScreen(screenSelectDay);
});

btnBackHome.addEventListener('click', () => {
    showScreen(screenHome);
});

btnAddDay.addEventListener('click', async () => {
    if (!currentSession.days) currentSession.days = [];

    if (currentSession.days.length >= 7) {
        showToast('¡Límite máximo de 7 días alcanzado!', 'error');
        return;
    }

    const zoneName = await showModal('¿Qué zona trabajarás en este nuevo día?', 'Ej: Pecho y Tríceps');
    if (!zoneName) return;

    // Use a unique ID based on timestamp
    const dayId = `day_${Date.now()}`;
    const newDayObj = {
        id: dayId,
        name: zoneName.trim()
    };

    currentSession.days.push(newDayObj);
    renderDayList();
    showToast(`✅ Día ${currentSession.days.length} agregado`, 'success');

    await syncSessionToFirestore();
});

btnAddExercise.addEventListener('click', async () => {
    let exerciseName = await showModal('Nombre del nuevo ejercicio:', 'Ej: Press de Banca');
    if (!exerciseName) return;

    exerciseName = exerciseName.trim();

    if (!currentSession.customExercises[activeDay]) {
        currentSession.customExercises[activeDay] = [];
    }

    currentSession.customExercises[activeDay].push(exerciseName);
    renderExerciseList(activeDay);
    showToast(`✅ "${exerciseName}" agregado`, 'success');

    await syncSessionToFirestore();
});

btnEditDesc.addEventListener('click', async () => {
    const isEditing = descTrabajoEl.contentEditable === "true";

    if (isEditing) {
        // Save Mode
        descTrabajoEl.contentEditable = "false";
        descIntensidadEl.contentEditable = "false";
        btnEditDesc.textContent = "✎";

        // Save details
        currentSession.customDescriptions[activeExercise] = {
            trabajo: descTrabajoEl.innerText.trim(),
            intensidad: descIntensidadEl.innerText.trim()
        };

        await syncSessionToFirestore();
        showToast('✅ Descripción guardada', 'success');
    } else {
        // Edit Mode
        descTrabajoEl.contentEditable = "true";
        descIntensidadEl.contentEditable = "true";
        btnEditDesc.textContent = "💾";
        descTrabajoEl.focus(); // focus first box
    }
});

btnBackDays.addEventListener('click', () => {
    showScreen(screenSelectDay);
});

btnBackExercises.addEventListener('click', () => {
    if (activeDay) renderExerciseList(activeDay);
    showScreen(screenExercises);
});

btnSaveSet.addEventListener('click', saveSet);

btnPrevWeek.addEventListener('click', () => {
    if (currentWeek > 1) {
        currentWeek--;
        renderWeekNavigation();
        renderSets();
    }
});

btnNextWeek.addEventListener('click', () => {
    if (currentWeek < maxWeek) {
        currentWeek++;
        renderWeekNavigation();
        renderSets();
    }
});

// btnAddWeek logic removed as weeks are now automatic based on calendar progression
// btnAddWeek.addEventListener('click', () => { ... });

// App Init - show login first
showScreen(screenLogin);
