const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzWQd79oa6sW2Tfwq1nIUwPkP_9zxQKRjetwdOrV1YQ1v5aPacbdTGajtKl6c3u1RJ23A/exec";

let currentUser = null;

// DOM elementlar
const loginSection = document.getElementById("loginSection");
const appSection = document.getElementById("appSection");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const userGreeting = document.getElementById("userGreeting");
const logoutBtn = document.getElementById("logoutBtn");

const rahbarFormContainer = document.getElementById("rahbarFormContainer");
const prorabFormContainer = document.getElementById("prorabFormContainer");
const shafyorFormContainer = document.getElementById("shafyorFormContainer");
const taminotchiFormContainer = document.getElementById("taminotchiFormContainer");

// LOGIN TIZIMI
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
      loginSection.classList.add("hidden");
      appSection.classList.remove("hidden");
      userGreeting.innerText = `Xush kelibsiz, ${currentUser.username}! (${currentUser.role})`;

      // Barcha formalarni yashirib, mosini ochamiz
      if (rahbarFormContainer) rahbarFormContainer.classList.add("hidden");
      if (prorabFormContainer) prorabFormContainer.classList.add("hidden");
      if (shafyorFormContainer) shafyorFormContainer.classList.add("hidden");
      if (taminotchiFormContainer) taminotchiFormContainer.classList.add("hidden");

      const role = (currentUser.role || "").toLowerCase();

      if (role.includes("rahbar")) {
        if (rahbarFormContainer) rahbarFormContainer.classList.remove("hidden");
      } else if (role.includes("prorab")) {
        if (prorabFormContainer) prorabFormContainer.classList.remove("hidden");
      } else if (role.includes("shafyor")) {
        if (shafyorFormContainer) shafyorFormContainer.classList.remove("hidden");
      } else if (role.includes("taminotchi") || role.includes("zavkoz")) {
        if (taminotchiFormContainer) taminotchiFormContainer.classList.remove("hidden");
      }
    } else {
      loginError.innerText = data.message || "Login yoki parol xato!";
      loginError.classList.remove("hidden");
    }
  } catch (err) {
    loginError.innerText = "Server bilan ulanishda xatolik!";
    loginError.classList.remove("hidden");
  }
});

// RAHBAR PUL YUBORISH FORMASI
const rahbarForm = document.getElementById("rahbarForm");
if (rahbarForm) {
  rahbarForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      action: "sendMoney",
      user: currentUser.username,
      role: currentUser.role,
      recipient: document.getElementById("recipientUser").value.trim(),
      amount: document.getElementById("sendAmount").value.trim(),
      note: document.getElementById("sendNote").value.trim()
    };

    try {
      const res = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify(payload) });
      const resData = await res.json();
      alert(resData.message || "Mabla'g' yuborildi!");
      rahbarForm.reset();
    } catch (err) {
      alert("Xatolik yuz berdi!");
    }
  });
}

// LOGOUT
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    currentUser = null;
    appSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    loginForm.reset();
  });
}
