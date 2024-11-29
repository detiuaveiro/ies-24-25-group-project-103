from kafka import KafkaProducer
from kafka.errors import KafkaError
import json
import random
import time

# Initialize Kafka producer
producer = KafkaProducer(
    bootstrap_servers=['localhost:29092'], 
    value_serializer=lambda m: json.dumps(m).encode('ascii')
)

# Number of beds to simulate
nBeds = 96

curVitals = {}
for i in range(1, nBeds+1):
    curVitals[i] = {
        "HeartRate": 60.0,
        "BloodPressureDiastolic": 70.0,
        "BloodPressureSystolic": 120.0,
        "Temperature": 36.5,
        "OxygenSaturation": 96.0
    }

while True:
    for i in range(1, nBeds+1):
        curVitals[i]["HeartRate"] += random.uniform(-5, 5)
        curVitals[i]["OxygenSaturation"] += random.uniform(-1, 1)
        curVitals[i]["BloodPressureDiastolic"] += random.uniform(-3, 3)
        curVitals[i]["BloodPressureSystolic"] += random.uniform(-5, 5)
        curVitals[i]["Temperature"] += random.uniform(-0.5, 0.5)

        vitals = {
            "HeartRate": round(curVitals[i]["HeartRate"], 1),
            "BloodPressureDiastolic": round(curVitals[i]["BloodPressureDiastolic"], 1),
            "BloodPressureSystolic": round(curVitals[i]["BloodPressureSystolic"], 1),
            "Temperature": round(curVitals[i]["Temperature"], 1),
            "OxygenSaturation": round(curVitals[i]["OxygenSaturation"], 1)
        }
        print(vitals)
        producer.send('vitals', vitals)

    # Wait for a few seconds before sending the next batch
    time.sleep(5)
