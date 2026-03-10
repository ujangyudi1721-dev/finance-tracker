export function generateInstallments(loanId, total, tenor) {
      console.log("GENERATE INSTALLMENTS:", loanId, total, tenor);

      const installmentAmount = total / tenor;

      const installments = [];

      for (let i = 1; i <= tenor; i++) {
            const item = {
                  loan_id: loanId,
                  cicilan_ke: i,
                  jumlah: installmentAmount,
                  status: "unpaid",
            };

            installments.push(item);
      }

      console.log("INSTALLMENTS GENERATED:", installments);

      return installments;
}
