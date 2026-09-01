const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzWQd79oa6sW2Tfwq1nIUwPkP_9zxQKRjetwdOrV1YQ1v5aPacbdTGajtKl6c3u1RJ23A/exec";

let currentUser = null;

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

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.classList.add("hidden");
    loginError.innerText = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const url = `${SCRIPT_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
      
      const response = await fetch(url);
      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Serverdan noto'g'ri javob keldi");
      }

      if (data.status === "success") {
        currentUser = data.user;
        loginSection.classList.add("hidden");
        appSection.classList.remove("hidden");
        userGreeting.innerText = `${currentUser.username} (${currentUser.role})`;

        if (rahbarFormContainer) rahbarFormContainer.classList.add("hidden");
        if (prorabFormContainer) prorabFormContainer.classList.add("hidden");
        if (shafyorFormContainer) shafyorFormContainer.classList.add("hidden");
        if (taminotchiFormContainer) taminotchiFormContainer.classList.add("hidden");

        const role = (currentUser.role || "").toLowerCase();
        if (role.includes("rahbar") && rahbarFormContainer) rahbarFormContainer.classList.remove("hidden");
        else if (role.includes("prorab") && prorabFormContainer) prorabFormContainer.classList.remove("hidden");
        else if (role.includes("shafyor") && shafyorFormContainer) shafyorFormContainer.classList.remove("hidden");
        else if ((role.includes("taminotchi") || role.includes("zavkoz")) && taminotchiFormContainer) taminotchiFormContainer.classList.remove("hidden");
      } else {
        loginError.innerText = data.message || "Login yoki parol noto'g'ri!";
        loginError.classList.remove("hidden");
      }
    } catch (err) {
      console.error(err);
      loginError.innerText = "Server bilan ulanishda xatolik!";
      loginError.classList.remove("hidden");
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    currentUser = null;
    appSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    loginForm.reset();
  });
}
