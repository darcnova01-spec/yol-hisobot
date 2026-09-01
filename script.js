// Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxsRjmaxeQkuM3S4cWdlQ45DLLNQ7_hgtxJpeFN5I9ZQVAx2PY9gC96B20pkFRKZgJQ/exec";

let currentUser = null;

// DOM elementlar
const loginSection = document.getElementById("loginSection");
const appSection = document.getElementById("appSection");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const userGreeting = document.getElementById("userGreeting");
const logoutBtn = document.getElementById("logoutBtn");

const prorabFormContainer = document.getElementById("prorabFormContainer");
const shafyorFormContainer = document.getElementById("shafyorFormContainer");
const taminotchiFormContainer = document.getElementById("taminotchiFormContainer");

const prorabForm = document.getElementById("prorabForm");
const shafyorForm = document.getElementById("shafyorForm");
const taminotchiForm = document.getElementById("taminotchiForm");

const formMessage = document.getElementById("formMessage");

// Fuel entries management
const addFuelBtn = document.getElementById("addFuelBtn");
const fuelEntriesContainer = document.getElementById("fuelEntriesContainer");

// Login submit
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.classList.add("hidden");

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch(`${SCRIPT_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    const data = await response.json();

    if (data.status === "success") {
      currentUser = data.user;
      showAppScreen();
    } else {
      loginError.textContent = data.message || "Login yoki parol noto'g'ri!";
      loginError.classList.remove("hidden");
    }
  } catch (err) {
    loginError.textContent = "Ulanishda xatolik yuz berdi. Qaytadan urinib ko'ring.";
    loginError.classList.remove("hidden");
  }
});

// App ekranini ko'rsatish
function showAppScreen() {
  loginSection.classList.add("hidden");
  appSection.classList.remove("hidden");

  userGreeting.textContent = `${currentUser.username} (${currentUser.role})`;

  prorabFormContainer.classList.add("hidden");
  shafyorFormContainer.classList.add("hidden");
  taminotchiFormContainer.classList.add("hidden");

  const role = currentUser.role.toLowerCase();

  if (role.includes("prorab")) {
    prorabFormContainer.classList.remove("hidden");
  } else if (role.includes("shafyor")) {
    shafyorFormContainer.classList.remove("hidden");
  } else if (role.includes("taminotchi") || role.includes("ta'minotchi")) {
    taminotchiFormContainer.classList.remove("hidden");
  }
}

// Logout
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  appSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  loginForm.reset();
});

// Helper: Form yuborish
async function sendReport(reportData) {
  formMessage.classList.add("hidden");
  formMessage.className = "message hidden";

  const payload = {
    user: currentUser.username,
    role: currentUser.role,
    report: reportData
  };

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (result.status === "success") {
      formMessage.textContent = "Hisobot muvaffaqiyatli yuborildi!";
      formMessage.classList.add("success");
      formMessage.classList.remove("hidden");
      return true;
    } else {
      throw new Error(result.message || "Xatolik yuz berdi");
    }
  } catch (err) {
    formMessage.textContent = "Xatolik: " + err.message;
    formMessage.classList.add("error");
    formMessage.classList.remove("hidden");
    return false;
  }
}

// Prorab Form
prorabForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const report = {
    workDone: document.getElementById("prorabWorkDone").value,
    expenses: document.getElementById("prorabExpenses").value,
    expenseNote: document.getElementById("prorabExpenseNote").value,
    attendance: document.getElementById("prorabAttendance").value
  };

  const success = await sendReport(report);
  if (success) prorabForm.reset();
});

// Shafyor Form
shafyorForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const report = {
    vehicle: document.getElementById("shafyorVehicle").value,
    mileage: document.getElementById("shafyorMileage").value,
    trips: document.getElementById("shafyorTrips").value,
    repairCost: document.getElementById("shafyorRepairCost").value
  };

  const success = await sendReport(report);
  if (success) shafyorForm.reset();
});

// Ta'minotchi - yoqilg'i qatorini qo'shish
if (addFuelBtn) {
  addFuelBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "fuel-entry flex gap-2 mb-2";
    div.innerHTML = `
      <input type="text" placeholder="Texnika nomi" class="fuel-vehicle border p-2 rounded w-1/2" required>
      <input type="number" placeholder="Litr" class="fuel-amount border p-2 rounded w-1/2" required>
    `;
    fuelEntriesContainer.appendChild(div);
  });
}

// Ta'minotchi Form
taminotchiForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fuelEntries = [];
  const entries = fuelEntriesContainer.querySelectorAll(".fuel-entry");
  entries.forEach(entry => {
    const vehicle = entry.querySelector(".fuel-vehicle").value;
    const amount = entry.querySelector(".fuel-amount").value;
    if (vehicle && amount) {
      fuelEntries.push({ vehicle, amount });
    }
  });

  const report = {
    foodExpense: document.getElementById("taminotchiFoodExpense").value,
    fuelEntries: fuelEntries
  };

  const success = await sendReport(report);
  if (success) {
    taminotchiForm.reset();
    fuelEntriesContainer.innerHTML = "";
  }
});
