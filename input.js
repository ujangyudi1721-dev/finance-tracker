let editId = null;
// --- struktur kode input ---
document.addEventListener("DOMContentLoaded", init);

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

      btnUpdate.style.display = "none";

      if (!id) return;

      editId = id;

      btnSimpan.style.display = "none";
      btnUpdate.style.display = "inline-block";

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

      document.getElementById("tanggal").value = data.tanggal;
      document.getElementById("tipe").value = data.tipe;
      document.getElementById("kategori").value = data.kategori;
      document.getElementById("jumlah").value = data.jumlah;
      document.getElementById("keterangan").value = data.keterangan;
      document.getElementById("akun").value = data.akun;
}

// --- UI transfer (ternary refactor) ---
function setupTransferUI() {
      const tipe = document.getElementById("tipe");
      const transferField = document.getElementById("transferField");

      tipe.addEventListener("change", () => {
            transferField.style.display =
                  tipe.value === "transfer" ? "block" : "none";
      });
}

// --- Ambil Data Form ---
function getFormData() {
      return {
            tanggal: document.getElementById("tanggal").value,
            tipe: document.getElementById("tipe").value,
            kategori: document.getElementById("kategori").value,
            jumlah: Number(document.getElementById("jumlah").value),
            keterangan: document.getElementById("keterangan").value,
            akun: document.getElementById("akun").value,
      };
      console.log("getFormData jalan");
}
const data = getFormData();

// --- form submit ---
function setupFormSubmit() {
      const form = document.getElementById("formKeuangan");

      form.addEventListener("submit", async (e) => {
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

// --- fungsi create transaksi ---
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
      window.location = "index.html";
}
