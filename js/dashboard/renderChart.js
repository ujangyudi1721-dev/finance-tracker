import { ACCOUNT_CONFIG } from "../config/accountConfig.js";
export function renderChart(result) {
      const accounts = result.accounts;

      const ACCOUNT_COLORS = {
            cash: "orchid",
            cimb: "#dc2626",
            neo: "gold",
            sea: "#ede738",
            bri: "rgb(34, 88, 235)",
      };

      const labels = Object.values(ACCOUNT_CONFIG);

      const values = Object.keys(ACCOUNT_CONFIG).map((key) => accounts[key]);

      const colors = Object.keys(ACCOUNT_CONFIG).map(
            (key) => ACCOUNT_COLORS[key],
      );

      const ctx = document.getElementById("financeChart");

      if (window.financeChart instanceof Chart) {
            window.financeChart.destroy();
      }

      window.financeChart = new Chart(ctx, {
            type: "bar",
            data: {
                  labels: labels,
                  datasets: [
                        {
                              label: "Grafik Saldo Akun",
                              data: values,
                              backgroundColor: colors,
                        },
                  ],
            },
            options: {
                  responsive: true,
                  plugins: {
                        legend: {
                              display: false,
                        },
                  },
            },
      });
}
