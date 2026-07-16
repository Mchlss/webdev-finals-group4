document.addEventListener("DOMContentLoaded", () => {
    fetch('/webdev-finals-group4/pages/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });
});