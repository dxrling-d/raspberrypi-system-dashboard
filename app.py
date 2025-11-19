from flask import Flask, render_template, jsonify, request
import psutil
from datetime import datetime, timedelta

app = Flask(__name__)

# برای نگهداری داده‌ها
data_store = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def data():
    # ذخیره داده فعلی
    now = datetime.now()
    system_data = {
        "timestamp": now.isoformat(),
        "cpu": psutil.cpu_percent(interval=0.5),
        "ram": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('/').percent,
        "network_sent": psutil.net_io_counters().bytes_sent,
        "network_recv": psutil.net_io_counters().bytes_recv
    }
    data_store.append(system_data)

    # پارامتر بازه زمانی از کوئری
    time_range = request.args.get("range", "lastHour")

    if time_range == "lastHour":
        cutoff = now - timedelta(hours=1)
    elif time_range == "last6Hours":
        cutoff = now - timedelta(hours=6)
    elif time_range == "last12Hours":
        cutoff = now - timedelta(hours=12)
    elif time_range == "today":
        cutoff = datetime(now.year, now.month, now.day)
    else:
        cutoff = now - timedelta(hours=1)

    filtered = [d for d in data_store if datetime.fromisoformat(d["timestamp"]) >= cutoff]

    return jsonify(filtered)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
