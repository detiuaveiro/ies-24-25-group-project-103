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

def create_rooms():
    r = requests.post(BASE_URL + "/hospital/rooms")
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

def start_application():
    # do this just to be sure
    delete_admin()
    create_admin()
    create_rooms()
    
    if not login_admin():
        print("Exiting...\n")
        return
    
    create_doctors()
    create_nurses()
    

if __name__ == "__main__":
    start_application()