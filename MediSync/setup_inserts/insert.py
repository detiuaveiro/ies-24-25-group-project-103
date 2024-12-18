import requests
import json
import random
from dotenv import load_dotenv
import os

BASE_URL = "http://localhost:8080/api/v1"
HEADERS = None
load_dotenv("../.env")

def create_admin():
    r = requests.post(BASE_URL + "/hospital")
    print(r.text)
def delete_admin():
    r = requests.delete(BASE_URL + "/hospital")
    print(r.text)

def login_admin():
    global HEADERS
    login_data = {
        "username": os.getenv('ADMIN_USERNAME'),
        "password": os.getenv('ADMIN_PASSWORD')
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    if response.status_code == 200:
        token = response.json()['token']
        HEADERS = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        return True
    else:
        print("Login failed:", response.text)
        return False
    
def create_rooms():
    r = requests.post(BASE_URL + "/hospital/rooms", headers=HEADERS)
    print(r.text)

def create_doctors():
    try:
        with open("doctors.txt", "r") as file:
            for line in file:
                doctor_data = json.loads(line)
                response = requests.post(f"{BASE_URL}/doctors", headers=HEADERS, json=doctor_data)
                
                if response.status_code == 200:
                    print(f"Successfully created doctor: {doctor_data['name']}")
                else:
                    print(f"Failed to create doctor {doctor_data['name']}: {response.text}")
    except FileNotFoundError:
        print("doctors.txt file not found")
    except json.JSONDecodeError:
        print("Error parsing doctor data from file")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

def create_nurses():
    try:
        with open("nurses.txt", "r") as file:
            for line in file:
                nurse_data = json.loads(line)
                response = requests.post(f"{BASE_URL}/nurses", headers=HEADERS, json=nurse_data)
                
                if response.status_code == 200:
                    print(f"Successfully created nurse: {nurse_data['name']}")
                else:
                    print(f"Failed to create nurse {nurse_data['name']}: {response.text}")
    except FileNotFoundError:
        print("nurses.txt file not found")
    except json.JSONDecodeError:
        print("Error parsing nurse data from file")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

def create_patients():
    """
    Create patients and assign them to random doctors and beds.
    Contagious patients are only assigned to isolation rooms (floor 3, rooms 7 and 8).
    """
    try:
        doctors_response = requests.get(f"{BASE_URL}/doctors", headers=HEADERS)
        if doctors_response.status_code != 200:
            print("Failed to get doctors list")
            return
        doctors = doctors_response.json()
        doctor_ids = [doctor["id"] for doctor in doctors]
        
        rooms_response = requests.get(f"{BASE_URL}/hospital/rooms", headers=HEADERS)
        if rooms_response.status_code != 200:
            print("Failed to get rooms list")
            return
        rooms = rooms_response.json()
        room_map = {room["id"]: room["roomNumber"] for room in rooms}
        
        beds_response = requests.get(f"{BASE_URL}/hospital/beds", headers=HEADERS)
        if beds_response.status_code != 200:
            print("Failed to get beds list")
            return
        beds = beds_response.json()
        
        # separate isolation beds from regular beds
        isolation_bed_ids = set()
        regular_bed_ids = set()
        
        for bed in beds:
            room_info = bed.get("room", {})
            if isinstance(room_info, dict):
                room_number = room_info.get("roomNumber", "")
            else:
                room_number = room_map.get(room_info, "")
            
            if room_number.startswith("3") and (room_number.endswith("7") or room_number.endswith("8")):
                isolation_bed_ids.add(bed["id"])
            else:
                regular_bed_ids.add(bed["id"])
        
        used_bed_ids = set()

        with open("patients.txt", "r") as file:
            for line in file:
                patient_data = json.loads(line)
                response = requests.post(f"{BASE_URL}/patients", headers=HEADERS, json=patient_data)
                
                if response.status_code == 201:
                    patient = response.json()
                    patient_id = patient["id"]
                    print(f"Successfully created patient: {patient_data['name']}")
                    
                    if doctor_ids:
                        random_doctor_id = random.choice(doctor_ids)
                        doctor_data = {"id": random_doctor_id}
                        doctor_response = requests.post(
                            f"{BASE_URL}/patients/{patient_id}/doctor",
                            headers=HEADERS,
                            json=doctor_data
                        )
                        if doctor_response.status_code == 201:
                            print(f"Assigned doctor {random_doctor_id} to patient {patient_data['name']}")
                        else:
                            print(f"Failed to assign doctor to patient {patient_data['name']}")
                    
                    is_contagious = patient_data.get("contagious", False)
                    available_beds = set()
                    
                    if is_contagious:
                        available_beds = isolation_bed_ids - used_bed_ids
                        if not available_beds:
                            print(f"No isolation beds available for contagious patient {patient_data['name']}")
                            continue
                    else:
                        available_beds = regular_bed_ids - used_bed_ids
                        if not available_beds:
                            print(f"No regular beds available for patient {patient_data['name']}")
                            continue
                    
                    if available_beds:
                        random_bed_id = random.choice(list(available_beds))
                        bed_data = {"id": random_bed_id}
                        bed_response = requests.post(
                            f"{BASE_URL}/patients/{patient_id}/bed",
                            headers=HEADERS,
                            json=bed_data
                        )
                        if bed_response.status_code == 201:
                            used_bed_ids.add(random_bed_id)
                            bed_type = "isolation" if is_contagious else "regular"
                            
                            bed_info = next((b for b in beds if b["id"] == random_bed_id), None)
                            room_info = bed_info.get("room", {}) if bed_info else {}
                            room_number = room_info.get("roomNumber", "") if isinstance(room_info, dict) else room_map.get(room_info, "unknown")
                            
                            print(f"Assigned {bed_type} bed {random_bed_id} (Room {room_number}) to patient {patient_data['name']}")
                        else:
                            print(f"Failed to assign bed to patient {patient_data['name']}")
                else:
                    print(f"Failed to create patient {patient_data['name']}: {response.text}")        
                    
    except FileNotFoundError:
        print("patients.txt file not found")
    except json.JSONDecodeError:
        print("Error parsing patient data from file")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

def create_visitors():
    patient_ids = []
    r = requests.get(BASE_URL + "/patients", headers=HEADERS)
    patients = r.json()
    for patient in patients:
        if patient['name'] == 'Ricardo Antunes':
            patient_ids.append(patient['id'])
            
    # create a visitor for each patient
    visitor_data = {
        "phoneNumber": "+351918049638"
    }
    
    for patient_id in patient_ids:
        print(f"Creating visitor for patient {patient_id}...")
        
        response = requests.post(
            f"{BASE_URL}/visitors/add/{patient_id}",
            headers=HEADERS,
            json=visitor_data
        )
        
        if response.status_code == 200:
            print(f"Successfully created visitor for patient {patient_id}")
        else:
            print(f"Failed to create visitor: {response.text}")

def create_medication():
    """
    Create 1-3 random medications for each patient from medications.txt
    """
    try:
        r = requests.get(BASE_URL + "/patients", headers=HEADERS)
        patients = r.json()
        
        medications = []
        with open("medications.txt", "r") as file:
            for line in file:
                medications.append(json.loads(line))
        
        for patient in patients:
            # randomly select 1-3 medications for each patient
            num_medications = random.randint(1, 3)
            patient_medications = random.sample(medications, num_medications)
            
            print(f"\nCreating {num_medications} medications for patient {patient['name']}...")
            
            for medication in patient_medications:
                response = requests.post(
                    f"{BASE_URL}/patients/{patient['id']}/medications",
                    headers=HEADERS,
                    json=medication
                )
                
                if response.status_code == 201:
                    print(f"Successfully created medication {medication['name']}")
                else:
                    print(f"Failed to create medication {medication['name']}: {response.text}")
                    
    except FileNotFoundError:
        print("medications.txt file not found")
    except json.JSONDecodeError:
        print("Error parsing medication data from file")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

def create_schedules():
    """
    Create 10 schedule entries for each nurse
    """
    try:
        # Get all nurses
        r = requests.get(BASE_URL + "/nurses", headers=HEADERS)
        nurses = r.json()

        # Define possible shift times
        shifts = [
            {
                "start": "08:00:00",
                "end": "16:00:00"
            },
            {
                "start": "16:00:00",
                "end": "23:00:00"
            },
            {
                "start": "00:00:00",
                "end": "08:00:00"
            }
        ]

        for nurse in nurses:
            print(f"\nCreating schedules for nurse {nurse['name']}...")

            # Randomly select 8 room IDs from 1-25
            room_ids = random.sample(range(1, 25), 8)
            rooms = [{"id": room_id} for room_id in room_ids]

            # Create 10 schedule entries
            for i in range(10):
                # Select a random shift
                shift = random.choice(shifts)

                day = random.randint(14, 19)

                schedule_data = {
                    "start_time": f"2024-12-{day:02d}T{shift['start']}Z",
                    "end_time": f"2024-12-{day:02d}T{shift['end']}Z",
                    "interval": False,
                    "room": rooms
                }

                response = requests.post(
                    f"{BASE_URL}/nurses/{nurse['id']}/schedule",
                    headers=HEADERS,
                    json=schedule_data
                )

                if response.status_code == 200:
                    print(f"Successfully created schedule entry {i+1} for nurse {nurse['name']}")
                else:
                    print(f"Failed to create schedule entry {i+1} for nurse {nurse['name']}: {response.text}")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

def start_application():
    # do this just to be sure
    delete_admin()
    create_admin()
    if not login_admin():
        print("Exiting...\n")
        return
    create_rooms()
    
def insert_data():
    if not login_admin():
        print("Exiting...\n")
        return
    create_doctors()
    create_nurses()
    create_patients()
    create_visitors()
    create_medication()
    create_schedules()

if __name__ == "__main__":
    start_application()
    insert_data()