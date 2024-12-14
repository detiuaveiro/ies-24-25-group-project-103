from kafka import KafkaProducer
import json
import random
import time
import math

# Initialize Kafka producer
producer = KafkaProducer(bootstrap_servers=['kafka:9092'], value_serializer=lambda m: json.dumps(m).encode('ascii'), api_version=(0, 10, 1))

nBeds = 96
curVitals = {}
distressState = {}

NORMAL_RANGES = {
    "heart_rate": (40, 130),
    "oxygen_saturation": (90, 100),
    "blood_pressure_systolic": (70, 140),
    "blood_pressure_diastolic": (40, 90),
    "temperature": (34.0, 37.5),
}

HARD_LIMITS = {
    "heart_rate": (20, 180),
    "oxygen_saturation": (70, 100),
    "blood_pressure_systolic": (50, 200),
    "blood_pressure_diastolic": (20, 150),
    "temperature": (30.0, 45.0),
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
        "temperature": {"in_distress": False, "duration": 0},
        "dying": False
    }

def circadian_adjustment(base_value, amplitude, time_of_day):
    """Adjusts a base value using a sinusoidal function for circadian rhythm."""
    return base_value + 0.05 * amplitude * math.sin(2 * math.pi * time_of_day / 24)

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

def add_sensor_noise(value, noise_level=0.005):
    """Adds random noise to simulate sensor inaccuracy."""
    noise = random.uniform(-noise_level * value, noise_level * value)
    return value + noise

def maintain_realistic_bp(systolic, diastolic):
    """Ensure the systolic and diastolic values maintain a physiological gap."""
    # Ensure a realistic range difference
    while systolic - diastolic < 30:
        diastolic -= 1
    while systolic - diastolic > 40:
        diastolic += 1
    return diastolic

while True:
    time_of_day = (time.time() % 86400) / 3600  # Time of day in hours (0-23)

    for i in range(1, nBeds + 1):
        patient_state = distressState[i]

        if patient_state["dying"]:
            # Rapid deterioration of vitals
            curVitals[i]["heart_rate"] = max(HARD_LIMITS["heart_rate"][0] - 1, curVitals[i]["heart_rate"] - random.randint(3, 7))
            curVitals[i]["oxygen_saturation"] = max(HARD_LIMITS["oxygen_saturation"][0] - 1, curVitals[i]["oxygen_saturation"] - random.randint(1, 3))
            curVitals[i]["blood_pressure"][0] = max(HARD_LIMITS["blood_pressure_systolic"][0] - 1, curVitals[i]["blood_pressure"][0] - random.uniform(0.25, 0.5))
            curVitals[i]["blood_pressure"][1] = max(HARD_LIMITS["blood_pressure_diastolic"][0] - 1, curVitals[i]["blood_pressure"][1] - random.uniform(0.125, 0.25))
            curVitals[i]["temperature"] = max(HARD_LIMITS["temperature"][0] - 0.1, curVitals[i]["temperature"] - random.uniform(0.01, 0.025))

            if (curVitals[i]["heart_rate"] <= HARD_LIMITS["heart_rate"][0] or
                curVitals[i]["oxygen_saturation"] <= HARD_LIMITS["oxygen_saturation"][0] or
                curVitals[i]["blood_pressure"][0] <= HARD_LIMITS["blood_pressure_systolic"][0] or
                curVitals[i]["blood_pressure"][1] <= HARD_LIMITS["blood_pressure_diastolic"][0] or
                curVitals[i]["temperature"] <= HARD_LIMITS["temperature"][0]):
                print(f"Patient in bed {i} has died.")
                continue

        else:
            for vital, ranges in NORMAL_RANGES.items():
                vital_state = patient_state[vital]

                if vital_state["in_distress"]:
                    vital_state["duration"] += 1
                    if vital == "blood_pressure_systolic":
                        curVitals[i]["blood_pressure"][0] = max(
                            HARD_LIMITS["blood_pressure_systolic"][0] - 1,
                            curVitals[i]["blood_pressure"][0] - random.uniform(2, 5)
                        )
                        # Adjust diastolic proportionally
                        curVitals[i]["blood_pressure"][1] = max(
                            HARD_LIMITS["blood_pressure_diastolic"][0] - 1,
                            curVitals[i]["blood_pressure"][1] - random.uniform(1, 2.5)
                        )
                    if vital == "heart_rate":
                        curVitals[i]["heart_rate"] = max(
                            HARD_LIMITS["heart_rate"][0] - 1,
                            curVitals[i]["heart_rate"] - random.randint(3, 7)
                        )
                    if vital == "oxygen_saturation":
                        curVitals[i]["oxygen_saturation"] = max(
                            HARD_LIMITS["oxygen_saturation"][0] - 1,
                            curVitals[i]["oxygen_saturation"] - random.uniform(0.5, 1.5)
                        )
                    if vital == "temperature":
                        curVitals[i]["temperature"] = max(
                            HARD_LIMITS["temperature"][0] - 0.1,
                            curVitals[i]["temperature"] - random.uniform(0.05, 0.1)
                        )

                    if vital_state["duration"] > random.randint(10, 30):
                        vital_state["in_distress"] = False
                        vital_state["duration"] = 0

                else:
                    if random.random() < 0.000001:
                        patient_state["dying"] = True
                    if random.random() < 0.0002:
                        vital_state["in_distress"] = True

                if vital == "heart_rate":
                    curVitals[i]["heart_rate"] = enforce_hard_limits(
                        circadian_adjustment(
                            bounded_random_walk(
                                curVitals[i]["heart_rate"], ranges[0], ranges[1], max_variation=2),
                            amplitude=1, time_of_day=time_of_day
                        ), HARD_LIMITS["heart_rate"][0], HARD_LIMITS["heart_rate"][1]
                    )
                elif vital == "oxygen_saturation":
                    curVitals[i]["oxygen_saturation"] = enforce_hard_limits(
                        bounded_random_walk(
                            curVitals[i]["oxygen_saturation"], ranges[0], ranges[1], max_variation=0.15),
                        HARD_LIMITS["oxygen_saturation"][0], HARD_LIMITS["oxygen_saturation"][1]
                    )
                elif vital == "blood_pressure_systolic":
                    curVitals[i]["blood_pressure"][0] = enforce_hard_limits(
                        circadian_adjustment(
                            bounded_random_walk(
                                curVitals[i]["blood_pressure"][0], ranges[0], ranges[1], max_variation=0.9),
                            amplitude=1, time_of_day=time_of_day
                        ), HARD_LIMITS["blood_pressure_systolic"][0], HARD_LIMITS["blood_pressure_systolic"][1]
                    )
                elif vital == "blood_pressure_diastolic":
                    curVitals[i]["blood_pressure"][1] = enforce_hard_limits(
                        bounded_random_walk(
                            curVitals[i]["blood_pressure"][1], 
                            NORMAL_RANGES["blood_pressure_diastolic"][0], 
                            NORMAL_RANGES["blood_pressure_diastolic"][1], 
                            max_variation=0.6
                        ), HARD_LIMITS["blood_pressure_diastolic"][0], HARD_LIMITS["blood_pressure_diastolic"][1]
                    )
                elif vital == "temperature":
                    curVitals[i]["temperature"] = enforce_hard_limits(
                        bounded_random_walk(
                            curVitals[i]["temperature"], ranges[0], ranges[1], max_variation=0.05
                        ), HARD_LIMITS["temperature"][0], HARD_LIMITS["temperature"][1]
                    )

                # Adjust diastolic to maintain a realistic gap if changes are made
                new_diastolic = maintain_realistic_bp(curVitals[i]["blood_pressure"][0], curVitals[i]["blood_pressure"][1])
                curVitals[i]["blood_pressure"][1] = new_diastolic

        # Add sensor noise to simulate inaccuracies
        curVitals[i]["heart_rate"] = add_sensor_noise(curVitals[i]["heart_rate"])
        curVitals[i]["oxygen_saturation"] = add_sensor_noise(curVitals[i]["oxygen_saturation"])
        curVitals[i]["blood_pressure"][0] = add_sensor_noise(curVitals[i]["blood_pressure"][0])
        curVitals[i]["blood_pressure"][1] = add_sensor_noise(curVitals[i]["blood_pressure"][1])
        curVitals[i]["temperature"] = add_sensor_noise(curVitals[i]["temperature"])

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
        print(vitals)

    time.sleep(3)

