import { supabase } from "../config/supabaseClient.js";
import {
      calculateInstallment,
      generateInstallments,
} from "../engine/loanEngine.js";

export async function createLoan(loan) {
      const cicilan = calculateInstallment(loan.total_loan, loan.tenor);

      const { data, error } = await supabase
            .from("loans")
            .insert([
                  {
                        nama: loan.nama,
                        total_loan: loan.total_loan,
                        tenor: loan.tenor,
                        cicilan_per_bulan: cicilan,
                  },
            ])
            .select()
            .single();

      if (error) {
            console.error(error);
            return;
      }

      const installments = generateInstallments(data.id, cicilan, loan.tenor);

      await supabase.from("loan_installments").insert(installments);

      return data;
}

export async function getLoans() {
      const { data, error } = await supabase.from("loans").select(`
        id,
        nama,
        total_loan,
        tenor,
        cicilan_per_bulan,
        loan_installments(
            id,
            jumlah,
            tanggal,
            status
        )
    `);

      if (error) {
            console.error(error);
            return [];
      }

      return data;
}

export async function payInstallment(installment) {
      await supabase.from("transactions").insert([
            {
                  tanggal: installment.tanggal,
                  tipe: "expense",
                  kategori: "loan",
                  jumlah: installment.jumlah,
                  akun: "cash",
                  keterangan: "Bayar cicilan",
            },
      ]);

      await supabase
            .from("loan_installments")
            .update({ status: "paid" })
            .eq("id", installment.id);
}
