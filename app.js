let expenses = [];

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("expenseForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const description = document.getElementById("description").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const contributors = document
            .getElementById("contributors")
            .value
            .split(",")
            .map(c => c.trim());

        const expense = {
            description,
            amount,
            contributors
        };

        expenses.push(expense);

        updateDashboard();
        displayExpenses();

        form.reset();
    });
});

function updateDashboard() {
    let total = expenses.reduce((sum, e) => sum + e.amount, 0);

    document.getElementById("total").textContent = total.toFixed(2);
    document.getElementById("paid").textContent = total.toFixed(2);
    document.getElementById("pending").textContent = "0.00";
}

function displayExpenses() {
    const tbody = document.querySelector("#expenseTable tbody");
    tbody.innerHTML = "";

    expenses.forEach((e, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${e.description}</td>
            <td>$${e.amount.toFixed(2)}</td>
            <td>${e.contributors.join(", ")}</td>
            <td>
                <button onclick="deleteExpense(${index})">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateDashboard();
    displayExpenses();
}
