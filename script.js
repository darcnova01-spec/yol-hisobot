const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1zRjPMHLtXTOy7RHIznBiPAFRpSV_VdDX1leb_rkxikVO4yikzOaNPSGzTwhjrUTf/exec";
const CORS_PROXY = "https://corsproxy.io/?";

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
      const targetUrl = `${SCRIPT_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
      const response = await fetch(CORS_PROXY + encodeURIComponent(targetUrl));
      const text = await response.text();
      
      let data;
      try { data = JSON.parse(text); } catch (err) { throw new Error("Serverdan xato javob keldi"); }

      if (data.status === "success") {
        currentUser = data.user;
        loginSection.classList.add("hidden");
        appSection.classList.remove("hidden");
        userGreeting.innerText = `${currentUser.username} (${currentUser.role})`;

        rahbarFormContainer.classList.add("hidden");
        prorabFormContainer.classList.add("hidden");
        shafyorFormContainer.classList.add("hidden");
        taminotchiFormContainer.classList.add("hidden");

        const role = currentUser.role;
        if (role === "rahbar") rahbarFormContainer.classList.remove("hidden");
        else if (role === "prorab") prorabFormContainer.classList.remove("hidden");
        else if (role === "shafyor") shafyorFormContainer.classList.remove("hidden");
        else if (role === "taminotchi") taminotchiFormContainer.classList.remove("hidden");
      } else {
        loginError.innerText = data.message || "Login yoki parol noto'g'ri!";
        loginError.classList.remove("hidden");
      }
    } catch (err) {
      loginError.innerText = "Server bilan ulanishda xatolik!";
      loginError.classList.remove("hidden");
    }
  });
}

// Prorab formasi
document.getElementById("prorabForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    action: "addProrabReport",
    prorabFish: document.getElementById("prorabFish").value,
    obyekt: document.getElementById("obyekt").value,
    bajarilganIsh: document.getElementById("bajarilganIsh").value,
    ishchilarSoni: document.getElementById("ishchilarSoni").value,
    ishlatilganTexnika: document.getElementById("ishlatilganTexnika").value,
    motochasat: document.getElementById("motochasat").value,
    yoqilgi: document.getElementById("yoqilgiPr").value,
    berilganPul: document.getElementById("berilganPulPr").value,
    harajatSummasi: document.getElementById("harajatSummasiPr").value,
    remontIzoxi: document.getElementById("remontIzoxiPr").value
  };
  sendReport(payload, e.target);
});

// Shafyor formasi
document.getElementById("shafyorForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    action: "addShafyorReport",
    shafyorFish: document.getElementById("shafyorFish").value,
    mashina: document.getElementById("mashina").value,
    borganManzil: document.getElementById("borganManzil").value,
    masofaKm: document.getElementById("masofaKm").value,
    reysSoni: document.getElementById("reysSoni").value,
    remontSummasi: document.getElementById("remontSummasiSh").value,
    remontIzoxi: document.getElementById("remontIzoxiSh").value
  };
  sendReport(payload, e.target);
});

// Taminotchi formasi
document.getElementById("taminotchiForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    action: "addTaminotchiReport",
    taminotchiFish: document.getElementById("taminotchiFish").value,
    berilganPul: document.getElementById("berilganPulTam").value,
    xarajatTuri: document.getElementById("xarajatTuri").value,
    mashinaObyekt: document.getElementById("mashinaObyekt").value,
    xarajatSummasi: document.getElementById("xarajatSummasiTam").value,
    chekRasmi: document.getElementById("chekRasmi").value
  };
  sendReport(payload, e.target);
});

async function sendReport(payload, formElement) {
  try {
    const targetUrl = `${SCRIPT_URL}?action=${payload.action}&${new URLSearchParams(payload).toString()}`;
    const response = await fetch(CORS_PROXY + encodeURIComponent(targetUrl));
    const text = await response.text();
    const result = JSON.parse(text);
    alert(result.message || "Muvaffaqiyatli saqlandi!");
    formElement.reset();
  } catch (err) {
    alert("Saqlashda xatolik yuz berdi!");
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    currentUser = null;
    appSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    loginForm.reset();
  });
}
