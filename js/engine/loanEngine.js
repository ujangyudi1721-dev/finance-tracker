export function calculateInstallment(total, tenor) {
      return Math.round(total / tenor);
}

export function generateInstallments(loanId, cicilan, tenor) {
      const installments = [];

      for (let i = 1; i <= tenor; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() + i);

            installments.push({
                  loan_id: loanId,
                  jumlah: cicilan,
                  tanggal: date.toISOString().split("T")[0],
                  status: "unpaid",
            });
      }

      return installments;
}

export function calculateLoanSummary(loans) {
      let totalLoan = 0;
      let remaining = 0;

      loans.forEach((loan) => {
            totalLoan += loan.total_loan;

            const paid = loan.loan_installments.filter(
                  (i) => i.status === "paid",
            ).length;

            remaining += loan.total_loan - paid * loan.cicilan_per_bulan;
      });

      return { totalLoan, remaining };
}
export function checkLoanReminder(loans) {
      const today = new Date();

      loans.forEach((loan) => {
            loan.loan_installments.forEach((inst) => {
                  const due = new Date(inst.tanggal);

                  const diff = (due - today) / (1000 * 60 * 60 * 24);

                  if (diff <= 3 && inst.status === "unpaid") {
                        alert(`Cicilan ${loan.nama} jatuh tempo`);
                  }
            });
      });
}
