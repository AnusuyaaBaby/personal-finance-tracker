let transactions = [];

function addTransaction() {
    const kind = document.getElementById("kind").value.trim().toLowerCase();
    const category = document.getElementById("category").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value.trim();
    const date = document.getElementById("date").value || new Date().toISOString().split('T')[0];

    if (!kind || !category || isNaN(amount) || !description) {
        alert("Please fill all fields!");
        return;
    }

    if (kind !== "income" && kind !== "expense") {
        alert("Type must be 'income' or 'expense'");
        return;
    }

    const tx = { kind, category, amount, description, date };
    transactions.push(tx);

    clearForm();
    loadTransactions();
    updateSummary();
}

function clearForm() {
    document.getElementById("kind").value = "";
    document.getElementById("category").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";
}

function loadTransactions() {
    const tbody = document.querySelector("#transactions tbody");
    tbody.innerHTML = "";

    transactions.forEach(tx => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${tx.kind}</td>
            <td>${tx.category}</td>
            <td>${tx.amount}</td>
            <td>${tx.description}</td>
            <td>${tx.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateSummary() {
    const totalIncome = transactions
        .filter(tx => tx.kind === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpense = transactions
        .filter(tx => tx.kind === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = totalIncome - totalExpense;

    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
    document.getElementById("balance").textContent = balance.toFixed(2);
}

window.onload = () => {
    loadTransactions();
    updateSummary();
};
