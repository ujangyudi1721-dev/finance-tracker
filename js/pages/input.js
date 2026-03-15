import {
      createTransaction,
      updateTransaction,
} from "../services/transactionService.js";
import { createTransfer } from "../services/transferService.js";
import { supabase } from "../config/supabaseClient.js";

let editId = null;
// --- struktur kode input ---
document.addEventListener("DOMContentLoaded", init);

const DOM = {
      form: document.getElementById("formKeuangan"),
      tanggal: document.getElementById("tanggal"),
      tipe: document.getElementById("tipe"),
      kategori: document.getElementById("kategori"),
      jumlah: document.getElementById("jumlah"),
      keterangan: document.getElementById("keterangan"),
      akun: document.getElementById("akun"),
      transferField: document.getElementById("transferField"),
      btnSimpan: document.getElementById("btnSimpan"),
      btnUpdate: document.getElementById("btnUpdate"),
};
// --- fungsi init ---
async function init() {
      console.log("INPUT PAGE LOADED");

      setupMode();
      setupTransferUI();
      setupFormSubmit();
}

// --- setup transfer ---
function setupTransferUI() {
      DOM.tipe.addEventListener("change", () => {
            DOM.transferField.style.display =
                  DOM.tipe.value === "transfer" ? "block" : "none";
      });
}

// --- Mode EDIT ---
async function setupMode() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      DOM.btnUpdate.style.display = "none";

      if (!id) return;

      editId = id;

      DOM.btnSimpan.style.display = "none";
      DOM.btnUpdate.style.display = "inline-block";

      await loadEditData(id);
}

// --- fungsi Load Edit Data ---
async function loadEditData(id) {
      const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("id", id)
            .single();

      if (error) {
            console.error(error);
            return;
      }

      console.log("EDIT DATA: ", data);

      DOM.tanggal.value = data.tanggal;
      DOM.tipe.value = data.tipe;
      DOM.kategori.value = data.kategori;
      DOM.jumlah.value = data.jumlah;
      DOM.keterangan.value = data.keterangan;
      DOM.akun.value = data.akun;
}

// --- Ambil Data Form ---
function getFormData() {
      const data = {
            tanggal: DOM.tanggal.value,
            tipe: DOM.tipe.value,
            kategori: DOM.kategori.value,
            jumlah: Number(DOM.jumlah.value),
            keterangan: DOM.keterangan.value,
            akun: DOM.akun.value,
      };

      console.log("getFormData jalan");
      return data;
}

// --- form submit ---
function setupFormSubmit() {
      DOM.form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = getFormData();

            if (data.tipe === "transfer") {
                  const tujuanAkun =
                        document.getElementById("tujuanAkun").value;
                  await createTransfer(data, tujuanAkun);
                  alert("Transfer berhasil");
                  window.location.href = "index.html";
                  return;
            }

            if (editId) {
                  await updateTransaction(editId, data);
                  alert("Transaksi berhasil diupdate");
            } else {
                  await createTransaction(data);
                  alert("Transaksi berhasil disimpan");
            }

            window.location.href = "index.html";
      });
}
