import { supabase } from "./config/supabaseClient.js";
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
      setupMode();
      setupTransferUI();
      setupFormSubmit();
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

      DOM.tanggal.value = data.tanggal;
      DOM.tipe.value = data.tipe;
      DOM.kategori.value = data.kategori;
      DOM.jumlah.valueOf = data.jumlah;
      DOM.keterangan.value = data.keterangan;
      DOM.akun.value = data.akun;
}

// --- UI transfer (ternary refactor) ---
function setupTransferUI() {
      DOM.tipe.addEventListener("change", () => {
            DOM.transferField.style.display =
                  DOM.tipe.value === "transfer" ? "block" : "none";
      });
}

// --- Ambil Data Form ---
function getFormData() {
      const data = {
            tanggal: DOM.tanggal.value,
            tipe: DOM.tipe.value,
            kategori: DOM.kategori.value,
            jumlah: DOM.jumlah.value,
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
                  await handleTransfer(data);
                  return;
            }

            await saveTransaction(data);

            alert("Data berhasil disimpan");
            window.location.href = "index.html";
      });
}

// --- fungsi create transaksi ---
async function saveTransaction(data) {
      console.log("SAVE DATA", data);
      //const { error } = await supabase.from("transactions").insert([data]);
      if (editId) {
            return supabase.from("transactions").update(data).eq("id", editId);
      }
      return supabase.from("transactions").insert([data]);
}

async function handleTransfer(data) {
      console.log("TRANSFER DATA:", data);

      const dari = data.akun;
      const ke = document.getElementById("tujuanAkun").value;

      const keluar = {
            ...data,
            tipe: "expense",
            akun: dari,
      };

      const masuk = {
            ...data,
            tipe: "income",
            akun: ke,
      };

      console.log("TRANSFER KELUAR:", keluar);
      console.log("TRANSFER MASUK:", masuk);

      await supabase.from("transactions").insert([keluar]);
      await supabase.from("transactions").insert([masuk]);

      alert("Transfer berhasil");
}
