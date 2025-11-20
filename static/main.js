console.log("main.js loaded");

async function getData() {
    try {
        const response = await fetch("/data");
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

const cpuCtx = document.getElementById("cpuChart").getContext("2d");
const ramCtx = document.getElementById("ramChart").getContext("2d");
const diskCtx = document.getElementById("diskChart").getContext("2d");
const netCtx = document.getElementById("networkChart").getContext("2d");

//  CPU
const cpuChart = new Chart(cpuCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "CPU Usage %",
            data: [],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true, max: 100 } }
    }
});

//  RAM
const ramChart = new Chart(ramCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "RAM Usage %",
            data: [],
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true, max: 100 } }
    }
});

//  Disk
const diskChart = new Chart(diskCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Disk Usage %",
            data: [],
            borderColor: "rgba(255, 206, 86, 1)",
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true, max: 100 } }
    }
});

const netChart = new Chart(netCtx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Network Sent (Bytes)",
                data: [],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
                fill: true
            },
            {
                label: "Network Received (Bytes)",
                data: [],
                borderColor: "rgba(153, 102, 255, 1)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                tension: 0.4,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    }
});

async function updateCharts() {
    const data = await getData();
    if (!data) return;

    const time = new Date().toLocaleTimeString();

    // CPU
    cpuChart.data.labels.push(time);
    cpuChart.data.datasets[0].data.push(data.cpu);
    if (cpuChart.data.labels.length > 20) {
        cpuChart.data.labels.shift();
        cpuChart.data.datasets[0].data.shift();
    }
    cpuChart.update();

    // RAM
    ramChart.data.labels.push(time);
    ramChart.data.datasets[0].data.push(data.ram);
    if (ramChart.data.labels.length > 20) {
        ramChart.data.labels.shift();
        ramChart.data.datasets[0].data.shift();
    }
    ramChart.update();

    // Disk
    diskChart.data.labels.push(time);
    diskChart.data.datasets[0].data.push(data.disk);
    if (diskChart.data.labels.length > 20) {
        diskChart.data.labels.shift();
        diskChart.data.datasets[0].data.shift();
    }
    diskChart.update();

    // Network
    netChart.data.labels.push(time);
    netChart.data.datasets[0].data.push(data.network_sent);
    netChart.data.datasets[1].data.push(data.network_recv);
    if (netChart.data.labels.length > 20) {
        netChart.data.labels.shift();
        netChart.data.datasets[0].data.shift();
        netChart.data.datasets[1].data.shift();
    }
    netChart.update();
}

setInterval(updateCharts, 2000);
