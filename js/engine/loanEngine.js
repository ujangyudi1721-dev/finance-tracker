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
