import psutil
import json
from datetime import datetime

data = {
    "timestamp": datetime.now().isoformat(),
    "cpu_percent": psutil.cpu_percent(interval=1),
    "ram_percent": psutil.virtual_memory().percent,
    "disk_percent": psutil.disk_usage('/').percent,
    "network": psutil.net_io_counters()._asdict()
}

with open("system_status.json", "w") as f:
    json.dump(data, f, indent=4)

print("System status saved to system_status.json")
