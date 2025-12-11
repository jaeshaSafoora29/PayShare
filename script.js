let expenses = [];

document.getElementById('expenseForm').addEventListener('submit', function(e){
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const contributors = document.getElementById('contributors').value.split(',').map(c => c.trim());

    const expense = { description, amount, contributors };
    expenses.push(expense);
    updateDashboard();
    displayExpenses();

    this.reset();
});

function updateDashboard() {
    let total = expenses.reduce((acc, e) => acc + e.amount, 0);
    let paid = total;  // Simplified: assume paid fully
    let pending = 0;   // Simplified
    
    document.getElementById('total').textContent = total.toFixed(2);
    document.getElementById('paid').textContent = paid.toFixed(2);
    document.getElementById('pending').textContent = pending.toFixed(2);
}

function displayExpenses() {
    const tbody = document.querySelector('#expenseTable tbody');
    tbody.innerHTML = '';

    expenses.forEach((e, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${e.description}</td>
            <td>$${e.amount.toFixed(2)}</td>
            <td>${e.contributors.join(', ')}</td>
            <td>
                <button onclick="deleteExpense(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateDashboard();
    displayExpenses();
}
