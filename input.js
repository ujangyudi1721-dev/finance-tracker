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

      const btnSimpan = document.getElementById("btnSimpan");
      const btnUpdate = document.getElementById("btnUpdate");

      DOM.btnUpdate.style.display = "none";

      if (!id) return;

      editId = id;

      DOM.btnSimpan.style.display = "none";
      DOM.btnUpdate.style.display = "inline-block";

      await loadEditData(id);
}

// --- fungsi Load Edit Data ---
async function loadEditData(id) {
      const { data, error } = await supabaseClient
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
      DOM.jumlah.value = data.jumlah;
      DOM.keterangan.value = data.keterangan;
      DOM.akun.value = data.akun;
}

// --- UI transfer (ternary refactor) ---
function setupTransferUI() {
      DOM.tipe.addEventListener("change", () => {
            transferField.style.display =
                  tipe.value === "transfer" ? "block" : "none";
      });
}

// --- Ambil Data Form ---
function getFormData() {
      return {
            tanggal: DOM.tanggal.value,
            tipe: DOM.tipe.value,
            kategori: DOM.kategori.value,
            jumlah: Number(DOM.jumlah.value),
            keterangan: DOM.keterangan.value,
            akun: DOM.akun.value,
      };
      console.log("getFormData jalan");
}
const data = getFormData();

// --- form submit ---
function setupFormSubmit() {
      DOM.form.addEventListener("submit", async (e) => {
            e.preventDefault();

            console.log("FORM SUBMIT BERJALAN");

            const data = getFormData();

            if (data.tipe === "transfer") {
                  await handleTransfer(data);
                  return;
            }

            if (editId) {
                  await updateTransaction(data);
            } else {
                  await createTransaction(data);
            }
            console.log(data); // untuk cek apakah jalan
      });
}
// --- Create Transaction ---
async function createTransaction(data) {
      const { error } = await supabaseClient
            .from("transactions")
            .insert([data]);

      if (error) {
            console.error(error);
            alert("Gagal menyimpan data");
            return;
      }

      alert("Data berhasil disimpan");
      window.location.href = "index.html";
}

// --- edit transaksi ---
async function updateTransaction(data) {

      const { error } = await supabaseClient
            .from("transactions")
            .update(data)
            .eq("id", editId);

      if (error) {
            console.error(error);
            alert("Gagal update data");
            return;
      }

      alert("Data berhasil diupdate");

      window.location.href = "index.html";
}

// --- fungsi create transaksi ---
async function saveTransaction(data) {
      if (editId) {
            return supabaseClient
                  .from("transaction")
                  .update(data)
                  .eq("id", editId);
      }
      return supabaseClient.from("transactions").insert([data]);
      await saveTransaction(data);
}
