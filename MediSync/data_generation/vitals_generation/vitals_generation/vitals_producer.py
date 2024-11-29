from kafka import KafkaProducer
from kafka.errors import KafkaError
import json
import random
import time

producer = KafkaProducer(bootstrap_servers=['localhost:29092'], value_serializer=lambda m: json.dumps(m).encode('ascii'))
nBeds = 96
curVitals = {}
for i in range(1, nBeds+1):
    curVitals[i] = {
        "heart_rate": 60,
        "oxygen_saturation": 96,
        "blood_pressure": [120, 70],
        "temperature": 36.5
    }
while True:
    for i in range(1, nBeds+1):
        curVitals[i]["heart_rate"] += random.randint(-5, 5)
        curVitals[i]["oxygen_saturation"] += int(random.randint(-2, 2) * 0.5)
        curVitals[i]["blood_pressure"][0] += random.randint(-5, 5)
        curVitals[i]["blood_pressure"][1] += random.randint(-5, 5)
        curVitals[i]["temperature"] += random.random() * random.randint(-1, 1)
        vitals = {
            "bed_id": str(i),
            "heart_rate": str(curVitals[i]["heart_rate"]),
            "oxygen_saturation": str(curVitals[i]["oxygen_saturation"]),
            "blood_pressure": [str(curVitals[i]["blood_pressure"][0]), str(curVitals[i]["blood_pressure"][1])],
            "temperature": f"{curVitals[i]['temperature']:.1f}"
        }
        producer.send('vitals', vitals)
    time.sleep(1)