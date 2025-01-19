let datas = [];

const getStoreData = JSON.parse(localStorage.getItem("totalData"));
if (getStoreData) {
    getStoreData.forEach(data => {
        addHistoryEntry(data.dateSun, data.dateSat, data.totalHours, data.totalMinutes, data.totalBill);
    });
}

// Format a date as "01 January 2024"
function formatDate(date) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}

// Hamburger Toggle Menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    const hamburger = document.querySelector('.hamburger');
    menu.classList.toggle('show');
    hamburger.classList.toggle('open');
}

// Handle the first day input and update the rest of the week
document.getElementById("firstDay").addEventListener("change", function() {
    const firstDay = new Date(this.value);
    document.getElementById("dateSun").textContent = formatDate(firstDay);

    const days = ["datemon", "datetue", "datewed", "datethus", "datefri", "datesat"];
    days.forEach((day, index) => {
        const nextDay = new Date(firstDay);
        nextDay.setDate(firstDay.getDate() + index + 1);
        document.getElementById(day).textContent = formatDate(nextDay);
    });

    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    const lastDayString = formatDate(lastDay);

    document.getElementById("datesat").textContent = lastDayString;
    document.querySelectorAll(".lastDay").forEach(el => el.textContent = lastDayString);

    totalBill();
});

// Calculation for total hours and minutes
function calculation() {
    let totalHours = 0;
    let totalMinutes = 0;

    const hoursInputs = document.querySelectorAll('.hours');
    const minutesInputs = document.querySelectorAll('.minutes');

    hoursInputs.forEach(input => {
        totalHours += parseInt(input.value) || 0;
    });

    minutesInputs.forEach(input => {
        totalMinutes += parseInt(input.value) || 0;
    });

    // Convert total minutes to hours and minutes
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    document.getElementById('totalhours').textContent = totalHours;
    document.getElementById('totalminutes').textContent = totalMinutes;

    totalBill();
}

// Function to calculate and display the total bill
function totalBill() {
    const hourlyRate = 100;
    let totalHours = 0;
    let totalMinutes = 0;

    document.querySelectorAll(".hours").forEach(input => {
        totalHours += parseFloat(input.value) || 0;
    });

    document.querySelectorAll(".minutes").forEach(input => {
        totalMinutes += parseFloat(input.value) || 0;
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    const totalBill = (totalHours * hourlyRate) + ((totalMinutes / 60) * hourlyRate);
    document.getElementById("totalBill").textContent = `৳ ${totalBill.toFixed(2)}`;
}

// Function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to delete a cookie
function eraseCookie(name) {
    document.cookie = `${name}=; Max-Age=-99999999;`;
}

// Add event listener for the Save button
document.querySelector(".save-button").addEventListener("click", function() {
    saveData();
    clearTable(); // Clear table after saving
    localStorage.setItem("totalData", JSON.stringify(datas));
});

// Function to clear table data
function clearTable() {
    document.querySelectorAll(".hours").forEach(input => input.value = "");
    document.querySelectorAll(".minutes").forEach(input => input.value = "");
    document.getElementById("totalhours").textContent = "0 Hours";
    document.getElementById("totalminutes").textContent = "0 Minutes";
    document.getElementById("totalBill").textContent = "৳ 0.00";
}

// Function to save data and add it to history
function saveData() {
    const dateSun = document.getElementById("dateSun").textContent;
    const dateSat = document.getElementById("datesat").textContent;
    const totalHours = document.getElementById("totalhours").textContent;
    const totalMinutes = document.getElementById("totalminutes").textContent;
    const totalBill = document.getElementById("totalBill").textContent;

    if (!dateSun || !totalHours || !totalMinutes) {
        alert("Please fill in all required fields.");
        return;
    }

    addHistoryEntry(dateSun, dateSat, totalHours, totalMinutes, totalBill);
    datas.push({ dateSun, dateSat, totalHours, totalMinutes, totalBill });

    // Save history to cookies
    setCookie("history", document.getElementById("history").innerHTML, 1);
}

// Function to add a history entry
function addHistoryEntry(dateSun, dateSat, totalHours, totalMinutes, totalBill) {
    const historyDiv = document.getElementById("history");
    const entry = document.createElement("div");
    entry.className = "history-entry";
    entry.innerHTML = `
        <p><strong>Date:</strong><span><b> ${dateSun}</b></span> - <span><b> ${dateSat}</b></span></p>
        <p><strong>Total Time:</strong><span> ${totalHours}</span> <span> ${totalMinutes}</span></p>
        <p><strong>Total Bill:</strong> <span>${totalBill}</span></p>
        <hr>
    `;
    historyDiv.prepend(entry);
}

// Retrieve cookies on page load
window.onload = function() {
    const savedHours = getCookie("totalHours");
    const savedMinutes = getCookie("totalMinutes");
    const savedBill = getCookie("totalBill");
    const savedHistory = getCookie("history");

    if (savedHours && savedMinutes && savedBill) {
        document.getElementById("totalhours").textContent = savedHours;
        document.getElementById("totalminutes").textContent = savedMinutes;
        document.getElementById("totalBill").textContent = savedBill;
    }

    if (savedHistory) {
        document.getElementById("history").innerHTML = savedHistory;
    }
}
