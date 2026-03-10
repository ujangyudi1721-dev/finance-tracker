import { supabase } from "../config/supabaseClient.js";

export async function createLoan(loanData) {

  console.log("CREATE LOAN:", loanData);

  const { data, error } = await supabase
    .from("loans")
    .insert([loanData])
    .select()
    .single();

  if (error) {
    console.error("CREATE LOAN ERROR:", error);
    return null;
  }

  console.log("LOAN CREATED:", data);

  return data;
}


export async function createInstallments(installments) {

  console.log("CREATE INSTALLMENTS:", installments);

  const { data, error } = await supabase
    .from("loan_installments")
    .insert(installments);

  if (error) {
    console.error("INSTALLMENT ERROR:", error);
    return null;
  }

  console.log("INSTALLMENTS CREATED:", data);

  return data;
}