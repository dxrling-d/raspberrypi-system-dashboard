# ~/pipro/client.py
import psutil
import requests
import socket
import time

SERVER_URL = "http://172.22.145.52:5000/update_client"  # آدرس سرور
CLIENT_ID = socket.gethostname()  # نام دستگاه به عنوان شناسه کلاینت
INTERVAL = 5  # ثانیه

def collect_data():
    return {
        "cpu": psutil.cpu_percent(interval=0.5),
        "ram": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage("/").percent,
        "network_sent": psutil.net_io_counters().bytes_sent,
        "network_recv": psutil.net_io_counters().bytes_recv,
        "uptime": int(time.time() - psutil.boot_time())
    }

def send_data():
    while True:
        data = collect_data()
        try:
            response = requests.post(SERVER_URL, json={"client_id": CLIENT_ID, "data": data})
            if response.status_code == 200:
                print(f"Data sent: {data}")
            else:
                print(f"Error sending data: {response.text}")
        except Exception as e:
            print(f"Connection error: {e}")
        time.sleep(INTERVAL)

if __name__ == "__main__":
    send_data()
