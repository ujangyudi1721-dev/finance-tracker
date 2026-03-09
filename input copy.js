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
      const btnUpdate = document.getElementById("btnEdit");

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
function setupTransferUI () {

      const tipe = document.getElementById("tipe");
      const transferField = document.getElementById("transferField");

      tipe.addEventListener("change", () => {
            transferField.style.display =
                  tipe.value === "transfer" ? "block" : "none";
      });
}

// --- Ambil Data Form ---
function getFormDAta() {
      return {
            tanggal: document.getElementById("tanggal").value,
            tipe: document.getElementById("tipe").value,
            kategori: document.getElementById("kategori").value,
            jumlah: document.getElementById("jumlah").value,
            keterangan: document.getElementById("keterangan").value,
            akun: document.getElementById("akun").value,
      };
}
const data = getFormData();