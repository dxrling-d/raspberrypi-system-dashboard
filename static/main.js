console.log("main.js loaded");

// Contexts
const cpuCtx = document.getElementById("cpuChart").getContext("2d");
const ramCtx = document.getElementById("ramChart").getContext("2d");
const diskCtx = document.getElementById("diskChart").getContext("2d");
const networkCtx = document.getElementById("networkChart").getContext("2d");

// Charts
const cpuChart = new Chart(cpuCtx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "CPU Usage %", data: [], borderColor: "rgba(255,99,132,1)", backgroundColor: "rgba(255,99,132,0.2)", fill: false, tension: 0.3 }] }
});
const ramChart = new Chart(ramCtx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "RAM Usage %", data: [], borderColor: "rgba(54,162,235,1)", backgroundColor: "rgba(54,162,235,0.2)", fill: false, tension: 0.3 }] }
});
const diskChart = new Chart(diskCtx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "Disk Usage %", data: [], borderColor: "rgba(75,192,192,1)", backgroundColor: "rgba(75,192,192,0.2)", fill: false, tension: 0.3 }] }
});
const networkChart = new Chart(networkCtx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "Network Sent (bytes)", data: [], borderColor: "rgba(255,206,86,1)", backgroundColor: "rgba(255,206,86,0.2)", fill: false, tension: 0.3 }] }
});

// Update function
async function updateCharts(range="lastHour") {
    const response = await fetch(`/data?range=${range}`);
    const systemData = await response.json();

    if(!systemData || systemData.length === 0) return;

    const labels = systemData.map(d => new Date(d.timestamp).toLocaleTimeString());
    const cpuData = systemData.map(d => d.cpu);
    const ramData = systemData.map(d => d.ram);
    const diskData = systemData.map(d => d.disk);
    const networkData = systemData.map(d => d.network_sent);

    cpuChart.data.labels = labels;
    cpuChart.data.datasets[0].data = cpuData;
    cpuChart.update();

    ramChart.data.labels = labels;
    ramChart.data.datasets[0].data = ramData;
    ramChart.update();

    diskChart.data.labels = labels;
    diskChart.data.datasets[0].data = diskData;
    diskChart.update();

    networkChart.data.labels = labels;
    networkChart.data.datasets[0].data = networkData;
    networkChart.update();
}

// Apply filter
document.getElementById("applyFilter").addEventListener("click", () => {
    const range = document.getElementById("timeRange").value;
    updateCharts(range);
});

// Auto update every 2 seconds
setInterval(() => {
    const range = document.getElementById("timeRange").value;
    updateCharts(range);
}, 2000);
