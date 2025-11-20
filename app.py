from flask import Flask, render_template, jsonify
import psutil
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def data():
    system_data = {
        "timestamp": datetime.now().isoformat(),
        "cpu": float(psutil.cpu_percent(interval=0.5)),
        "ram": float(psutil.virtual_memory().percent),
        "disk": float(psutil.disk_usage('/').percent),
        "network_sent": float(psutil.net_io_counters().bytes_sent),
        "network_recv": float(psutil.net_io_counters().bytes_recv)
    }
    return jsonify(system_data)

if __name__ == "__main__":
    # host=0.0.0.0 اجازه دسترسی از شبکه میده
    app.run(host="0.0.0.0", port=5000, debug=True)
