import { checkLoanReminder } from "../engine/loanEngine.js";
import { getLoans } from "../services/loanService.js";
import {
      renderLoanTable,
      renderInstallments,
} from "../dashboard/renderLoans.js";

document.addEventListener("DOMContentLoaded", init);

async function init() {
      const loans = await getLoans();

      renderLoanTable(loans);

      renderInstallments(loans);

      checkLoanReminder(loans);
}
