// Unik session-ID
if (!localStorage.getItem("session_id")) {
    localStorage.setItem("session_id", crypto.randomUUID());
}

const sessionId = localStorage.getItem("session_id");

// AUTOMATISK LOGGING
fetch("/auto-log", {
    method: "POST",
    headers: { "session-id": sessionId }
}).then(loadLog);

// LAGRE NAVN
document.getElementById("nameForm").onsubmit = async (e) => {
    e.preventDefault();
    const name = new FormData(nameForm).get("name");

    await fetch("/name-log", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "session-id": sessionId
        },
        body: JSON.stringify({ name })
    });

    nameStatus.textContent = "Navn lagret!";
    loadLog();
};

// HENT BESØKSLISTE
async function loadLog() {
    const res = await fetch("/get-log");
    const data = await res.json();

    const tbody = document.querySelector("#logTable tbody");
    tbody.innerHTML = "";

    data.forEach(r => {
        tbody.innerHTML += `
        <tr>
            <td>${r.id}</td>
            <td>${r.ip}</td>
            <td>${r.operating_system}</td>
            <td>${r.browser}</td>
            <td>${r.country}</td>
            <td>${r.city}</td>
            <td>${r.session_id}</td>
            <td>${r.name || ""}</td>
            <td>${r.timestamp}</td>
        </tr>`;
    });
}

// TEMA
const toggle = document.getElementById("themeToggle");
toggle.onclick = () => {
    document.documentElement.classList.toggle("dark");
};
