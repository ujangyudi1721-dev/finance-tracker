export function renderLoanTable(loans) {
      const table = document.getElementById("loanTable");

      table.innerHTML = "";

      loans.forEach((loan) => {
            const row = document.createElement("tr");

            row.innerHTML = `
        <td>${loan.nama}</td>
        <td>${loan.total_loan}</td>
        <td>${loan.tenor}</td>
        <td>${loan.cicilan_per_bulan}</td>
        `;

            table.appendChild(row);
      });
}

export function renderInstallments(loans) {
      const table = document.getElementById("installmentTable");

      table.innerHTML = "";

      loans.forEach((loan) => {
            loan.loan_installments.forEach((inst, index) => {
                  const row = document.createElement("tr");

                  row.innerHTML = `
            <td>${index + 1}</td>
            <td>${inst.jumlah}</td>
            <td>${inst.status}</td>
            `;

                  table.appendChild(row);
            });
      });
}
