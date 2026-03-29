// Replace with your live endpoint (Apps Script, Sheet.best, etc.)
const DATA_ENDPOINT = "PASTE_YOUR_LIVE_DATA_ENDPOINT_HERE";

// Expected JSON:
// {
//   "startDate": "2025-01-01",
//   "plasticBottles": 1250,
//   "totalWeightKg": 320.4
// }

const fmtNumber = (n) => new Intl.NumberFormat("en-US").format(Number(n || 0));
const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function setFallback() {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  document.getElementById("dateRange").textContent = `Start date → ${today}`;
  document.getElementById("bottleCount").textContent = "--";
  document.getElementById("weightTotal").textContent = "-- kg / -- lbs";
}

async function loadImpactData() {
  if (!DATA_ENDPOINT || DATA_ENDPOINT.includes("PASTE_YOUR_LIVE_DATA_ENDPOINT_HERE")) {
    setFallback();
    return;
  }

  try {
    const res = await fetch(DATA_ENDPOINT, { cache: "no-store" });
    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();

    const startDate = data.startDate || "2025-01-01";
    const bottles = Number(data.plasticBottles || 0);
    const kg = Number(data.totalWeightKg || 0);
    const lbs = kg * 2.2046226218;

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    document.getElementById("dateRange").textContent = `${fmtDate(startDate)} → ${today}`;
    document.getElementById("bottleCount").textContent = fmtNumber(bottles);
    document.getElementById("weightTotal").textContent =
      `${fmtNumber(kg.toFixed(1))} kg / ${fmtNumber(lbs.toFixed(1))} lbs`;
  } catch (e) {
    setFallback();
  }
}

document.addEventListener("DOMContentLoaded", loadImpactData);
