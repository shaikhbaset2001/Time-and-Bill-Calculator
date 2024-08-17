function toggleMenu() {
    const menu = document.getElementById("menu");
    const hamburger = document.querySelector(".hamburger");

    menu.classList.toggle("show");
    hamburger.classList.toggle("open");
}

function calculation() {
    let totalHours = 0;
    let totalMinutes = 0;

    document.querySelectorAll(".hours").forEach(input => {
        totalHours += parseFloat(input.value) || 0;
    });

    document.querySelectorAll(".minutes").forEach(input => {
        totalMinutes += parseFloat(input.value) || 0;
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    document.getElementById("totalhours").textContent = `${totalHours} Hours`;
    document.getElementById("totalminutes").textContent = `${totalMinutes} Minutes`;
}
