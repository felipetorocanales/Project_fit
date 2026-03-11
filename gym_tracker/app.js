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

// Custom Modal Prompt system
const modalOverlay = document.getElementById('modal-overlay');
const modalLabel = document.getElementById('modal-label');
const modalInput = document.getElementById('modal-input');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');

function showModal(label, placeholder = '') {
    return new Promise((resolve) => {
        modalLabel.textContent = label;
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

// Initialize Day List
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

    currentSession.days.forEach((day, index) => {
        const row = document.createElement('div');
        row.className = 'list-row';

        const btn = document.createElement('button');
        btn.className = 'day-btn';
        btn.textContent = day;
        btn.addEventListener('click', () => {
            activeDay = day;
            currentSession.date = new Date().toISOString();
            renderExerciseList(activeDay);
            showScreen(screenExercises);
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-row-btn';
        delBtn.textContent = '−';
        delBtn.title = 'Eliminar día';
        delBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            currentSession.days.splice(index, 1);
            renderDayList();
            showToast('🗑 Día eliminado', 'error');
            await syncSessionToFirestore();
        });

        row.appendChild(btn);
        row.appendChild(delBtn);
        dayListContainer.appendChild(row);
    });
}

// Initialize Exercise List for a specific day
function renderExerciseList(dayCategory) {
    exerciseListContainer.innerHTML = '';
    currentDayTitleEl.textContent = dayCategory;

    // Combine standard exercises with custom ones for this day
    const standardExs = exercisesByCategory[dayCategory] || [];
    const hidden = currentSession.hiddenExercises?.[dayCategory] || [];
    const customExs = currentSession.customExercises[dayCategory] || [];
    const allExercises = [
        ...standardExs.filter(e => !hidden.includes(e)),
        ...customExs
    ];

    if (allExercises.length === 0) {
        exerciseListContainer.innerHTML = `
            <div class="empty-state">
                <p>Agrega los ejercicios que harás este día.</p>
            </div>
        `;
        return;
    }

    allExercises.forEach((ex, index) => {
        const isCustom = index >= standardExs.filter(e => !hidden.includes(e)).length;

        const row = document.createElement('div');
        row.className = 'list-row';

        const btn = document.createElement('button');
        btn.className = 'exercise-btn';
        btn.innerHTML = `<span>${ex}</span> <span style="color:var(--accent)">+</span>`;
        btn.addEventListener('click', () => openExercise(ex));

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-row-btn';
        delBtn.textContent = '−';
        delBtn.title = 'Eliminar ejercicio';
        delBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (isCustom) {
                // Remove from custom list
                const customList = currentSession.customExercises[dayCategory];
                const customIndex = customList.indexOf(ex);
                if (customIndex > -1) customList.splice(customIndex, 1);
            } else {
                // Hide standard exercise
                if (!currentSession.hiddenExercises) currentSession.hiddenExercises = {};
                if (!currentSession.hiddenExercises[dayCategory]) currentSession.hiddenExercises[dayCategory] = [];
                currentSession.hiddenExercises[dayCategory].push(ex);
            }
            renderExerciseList(dayCategory);
            showToast('🗑 Ejercicio eliminado', 'error');
            await syncSessionToFirestore();
        });

        row.appendChild(btn);
        row.appendChild(delBtn);
        exerciseListContainer.appendChild(row);
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
}

// Logic Functions
function openExercise(exerciseName) {
    activeExercise = exerciseName;
    currentExerciseNameEl.textContent = exerciseName;

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
        li.innerHTML = `
            <button class="delete-set-btn" data-index="${index}" title="Borrar serie">−</button>
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

    const newDayNumber = currentSession.days.length + 1;
    const newDayName = `Día ${newDayNumber}: ${zoneName}`;

    currentSession.days.push(newDayName);
    renderDayList();
    showToast(`✅ ${newDayName} agregado`, 'success');

    await syncSessionToFirestore();
});

btnAddExercise.addEventListener('click', async () => {
    const exerciseName = await showModal('Nombre del nuevo ejercicio:', 'Ej: Press de Banca');
    if (!exerciseName) return;

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
