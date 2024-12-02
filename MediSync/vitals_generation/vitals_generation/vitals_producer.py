from kafka import KafkaProducer
import json
import random
import time

producer = KafkaProducer(bootstrap_servers=['kafka:9092'], value_serializer=lambda m: json.dumps(m).encode('ascii'))

nBeds = 96
curVitals = {}
distressState = {} 

NORMAL_RANGES = {
    "heart_rate": (60, 100),
    "oxygen_saturation": (94, 100),
    "blood_pressure_systolic": (90, 120),
    "blood_pressure_diastolic": (60, 80),
    "temperature": (36.0, 37.5),
}

HARD_LIMITS = {
    "heart_rate": (40, 180),
    "oxygen_saturation": (85, 100),
    "blood_pressure_systolic": (70, 200),
    "blood_pressure_diastolic": (40, 120),
    "temperature": (34.0, 42.0),
}

for i in range(1, nBeds + 1):
    curVitals[i] = {
        "heart_rate": random.randint(70, 80),
        "oxygen_saturation": random.randint(95, 99),
        "blood_pressure": [
            random.randint(110, 120), 
            random.randint(70, 80) 
        ],
        "temperature": round(random.uniform(36.5, 37.0), 1)
    }
    distressState[i] = {
        "heart_rate": {"in_distress": False, "duration": 0},
        "oxygen_saturation": {"in_distress": False, "duration": 0},
        "blood_pressure_systolic": {"in_distress": False, "duration": 0},
        "blood_pressure_diastolic": {"in_distress": False, "duration": 0},
        "temperature": {"in_distress": False, "duration": 0}
    }


def bounded_random_walk(value, normal_min, normal_max, max_variation=5, drift_towards_normal=True):
    """Simulates bounded random walk for a vital."""
    if drift_towards_normal:
        if value < normal_min:
            value += random.uniform(0.1, max_variation)
        elif value > normal_max:
            value -= random.uniform(0.1, max_variation)
    value += random.uniform(-max_variation, max_variation)
    return round(value, 1)


def enforce_hard_limits(value, hard_min, hard_max):
    """Ensures the value remains within hard limits."""
    return max(hard_min, min(value, hard_max))


while True:
    for i in range(1, nBeds + 1):
        for vital, ranges in NORMAL_RANGES.items():
            vital_state = distressState[i][vital]

            if vital_state["in_distress"]:
                vital_state["duration"] += 1

                if vital == "heart_rate":
                    curVitals[i]["heart_rate"] += random.randint(-15, 15)
                    curVitals[i]["heart_rate"] = enforce_hard_limits(
                        curVitals[i]["heart_rate"], HARD_LIMITS["heart_rate"][0], HARD_LIMITS["heart_rate"][1])

                elif vital == "oxygen_saturation":
                    curVitals[i]["oxygen_saturation"] += random.randint(-3, 0)
                    curVitals[i]["oxygen_saturation"] = enforce_hard_limits(
                        curVitals[i]["oxygen_saturation"], HARD_LIMITS["oxygen_saturation"][0], HARD_LIMITS["oxygen_saturation"][1])

                elif vital == "blood_pressure_systolic":
                    curVitals[i]["blood_pressure"][0] += random.randint(-20, 20)
                    curVitals[i]["blood_pressure"][0] = enforce_hard_limits(
                        curVitals[i]["blood_pressure"][0], HARD_LIMITS["blood_pressure_systolic"][0], HARD_LIMITS["blood_pressure_systolic"][1])

                elif vital == "blood_pressure_diastolic":
                    curVitals[i]["blood_pressure"][1] += random.randint(-10, 10)
                    curVitals[i]["blood_pressure"][1] = enforce_hard_limits(
                        curVitals[i]["blood_pressure"][1], HARD_LIMITS["blood_pressure_diastolic"][0], HARD_LIMITS["blood_pressure_diastolic"][1])

                elif vital == "temperature":
                    curVitals[i]["temperature"] += random.uniform(-1.0, 1.0)
                    curVitals[i]["temperature"] = enforce_hard_limits(
                        curVitals[i]["temperature"], HARD_LIMITS["temperature"][0], HARD_LIMITS["temperature"][1])

                if vital_state["duration"] > random.randint(10, 30):
                    vital_state["in_distress"] = False
                    vital_state["duration"] = 0

            else:
                if random.random() < 0.005: 
                    vital_state["in_distress"] = True

                if vital == "heart_rate":
                    curVitals[i]["heart_rate"] = bounded_random_walk(
                        curVitals[i]["heart_rate"], ranges[0], ranges[1])
                elif vital == "oxygen_saturation":
                    curVitals[i]["oxygen_saturation"] = bounded_random_walk(
                        curVitals[i]["oxygen_saturation"], ranges[0], ranges[1], max_variation=1)
                elif vital == "blood_pressure_systolic":
                    curVitals[i]["blood_pressure"][0] = bounded_random_walk(
                        curVitals[i]["blood_pressure"][0], NORMAL_RANGES["blood_pressure_systolic"][0], NORMAL_RANGES["blood_pressure_systolic"][1])
                elif vital == "blood_pressure_diastolic":
                    curVitals[i]["blood_pressure"][1] = bounded_random_walk(
                        curVitals[i]["blood_pressure"][1], NORMAL_RANGES["blood_pressure_diastolic"][0], NORMAL_RANGES["blood_pressure_diastolic"][1])
                elif vital == "temperature":
                    curVitals[i]["temperature"] = bounded_random_walk(
                        curVitals[i]["temperature"], ranges[0], ranges[1], max_variation=0.2)

        vitals = {
            "bed_id": str(i),
            "heart_rate": str(int(curVitals[i]["heart_rate"])),
            "oxygen_saturation": str(int(curVitals[i]["oxygen_saturation"])),
            "blood_pressure": [
                str(int(curVitals[i]["blood_pressure"][0])),
                str(int(curVitals[i]["blood_pressure"][1]))
            ],
            "temperature": f"{curVitals[i]['temperature']:.1f}"
        }
        producer.send('vitals', vitals)
        if i == 1:
            print(vitals)

    time.sleep(3)
