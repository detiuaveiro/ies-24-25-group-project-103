import json
import random
from datetime import datetime, timedelta

def generate_doctors():
    """
    Create a txt file with 15 doctors in a json format.
    """
    doctors = [
        "Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Jones", "Dr. Garcia", "Dr. Miller", "Dr. Davis",
        "Dr. Rodriguez", "Dr. Martinez", "Dr. Hernandez", "Dr. Lopez", "Dr. Gonzalez", "Dr. Wilson", "Dr. Anderson"
    ]
    with open("doctors.txt", "w") as file:
        for doctor in doctors:
            # Extract last name for username and email
            last_name = doctor.split(". ")[1].lower()

            data = {
                "username": f"doc_{last_name}",
                "name": doctor,
                "email": f"doctor.{last_name}@medisync.com",
                "password": f"doc_{last_name}123",  # Simple password pattern
                "role": "DOCTOR",
                "profilePictureUrl": None,
                "enabled": True
            }
            file.write(json.dumps(data) + "\n")
    print("Doctors data written to doctors.txt")

def format_date(date_str):
    """Convert date to required format"""
    return f"{date_str}T00:00:00.000+00:00"

def generate_random_date(start_year, end_year):
    start_date = datetime(start_year, 1, 1)
    end_date = datetime(end_year, 12, 31)
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    return (start_date + timedelta(days=random_number_of_days)).strftime("%Y-%m-%d")

def generate_patients():
    """
    Create a txt file with 50 patients in a json format.
    Four patients will be marked as contagious.
    """
    patients = [
    "Cristiano Ronaldo", "Óscar Cardozo", "Eusébio", "Rui Costa", "João Félix",
    "Bruno Fernandes", "Nuno Gomes", "Ángel Di María", "Bernardo Silva", "João Cancelo",
    "Pepe", "Jan Oblak", "David Luiz", "Victor Lindelöf", "Nemanja Matić",
    "Darwin Núñez", "Gonçalo Ramos", "Gonçalo Guedes", "João Mário", "Rafa Silva",
    "Pizzi", "Manuel Rui Águas", "Simão Sabrosa", "Paulo Futre", "Fernando Chalana",
    "Ricardo Quaresma", "Hélder Costa", "Gedson Fernandes", "André Gomes", "Renato Sanches",
    "Luisão", "Jonas", "Jardel", "Enzo Fernández", "Axel Witsel",
    "Pablo Aimar", "Nicolás Gaitán", "Nélson Semedo", "Ederson Moraes", "Fábio Coentrão",
    "Bruno Lage", "Carlos Mozer", "Hugo Almeida", "Pedro Pauleta", "Tiago Mendes",
    "Nuno Valente", "José Fonte", "Ricardo Carvalho", "Hélder Postiga", "Deco",
    "Pedro Ponte", "Afonso Ferreira", "João Neto", "Ricardo Antunes", "João Almeida",
    "Eduardo Lopes", "Rodrigo Abreu", "Tomás Brás", "Hugo Ribeiro", "Cole Palmer", "Daniel Ferreira"
    ]

    conditions = [
        "Hypertension", "Diabetes", "Asthma", "Arthritis", "Heart Disease",
        "COPD", "Pneumonia", "Bronchitis", "Anemia", "Obesity"
    ]

    contagious_conditions = ["COVID-19", "Flu", "Pneumonia"]

    observations = [
        "Requires wheelchair assistance",
        "Prefers a quiet environment",
        "Allergic to penicillin",
        "Regular physiotherapy needed",
        "Light diet recommended",
        "Needs assistance with daily activities",
        "Regular blood pressure monitoring",
        "Sleep apnea patient",
        "Regular temperature checks needed",
        "Limited mobility"
    ]

    # select 4 patients to be contagious
    contagious_indices = random.sample(range(len(patients)), 4)

    with open("patients.txt", "w") as file:
        for index, patient in enumerate(patients):
            birth_date = format_date(generate_random_date(1950, 2004))
            discharge_date = format_date(generate_random_date(2024, 2025))

            is_contagious = index in contagious_indices

            # if patient is contagious they have at least one contagious condition
            if is_contagious:
                patient_conditions = random.sample(contagious_conditions, 1)
                additional_conditions = random.sample([c for c in conditions if c not in contagious_conditions], 
                                                   random.randint(0, 2))
                patient_conditions.extend(additional_conditions)
            else:
                patient_conditions = random.sample(conditions, random.randint(1, 3))

            data = {
                "name": patient,
                "gender": random.choice(["Male", "Female"]),
                "birthDate": birth_date,
                "estimatedDischargeDate": discharge_date,
                "weight": round(random.uniform(60.0, 95.0), 1),
                "height": random.randint(150, 195),  # Height in centimeters
                "conditions": patient_conditions,
                "observations": random.sample(observations, random.randint(1, 3)),
                "state": "IN_BED",
                "contagious": is_contagious
            }
            file.write(json.dumps(data) + "\n")

    print("Patients data written to patients.txt")

def generate_nurses():
    """
    Create a txt file with nurses in a json format.\n
    Can create 100 nurses, but we'll only create 30.
    """
    first_names = [
        "Emma", "Olivia", "Charlotte", "Sophia", "Ava", "Isabella", "Lucy", "Emily", "Grace", "Sarah",
        "James", "William", "Henry", "Oliver", "Jack", "Thomas", "George", "Charlie", "Harry", "John"
    ]
    last_names = [
        "Smith", "Jones", "Williams", "Brown", "Taylor", "Davies", "Wilson", "Evans", "Thomas", "Johnson",
        "Roberts", "Walker", "Wright", "Thompson", "White", "Hughes", "Edwards", "Green", "Hall", "Wood"
    ]

    used_names = set()
    with open("nurses.txt", "w") as file:
        # Generate 20 nurses
        for i in range(30):
            valid_name = False
            while not valid_name:
                first_name = random.choice(first_names)
                last_name = random.choice(last_names)
                full_name = f"{first_name} {last_name}"

                if full_name not in used_names:
                    used_names.add(full_name)
                    valid_name = True

            data = {
                "username": f"nurse_{first_name.lower()}{last_name.lower()}",
                "name": f"Nurse {full_name}",
                "email": f"nurse.{first_name.lower()}.{last_name.lower()}@medisync.com",
                "password": f"nurse_{first_name.lower()}{last_name.lower()}123",  # Simple password pattern
                "role": "NURSE",
                "profilePictureUrl": None,
                "enabled": True
            }
            file.write(json.dumps(data) + "\n")

    print("Nurses data written to nurses.txt")

def generate_medications():
    """
    Generate 100 medications and save them to a txt file
    """
    medication_names = [
        "Acetaminophen", "Ibuprofen", "Amoxicillin", "Lisinopril", "Metformin",
        "Omeprazole", "Levothyroxine", "Amlodipine", "Metoprolol", "Gabapentin",
        "Sertraline", "Fluoxetine", "Escitalopram", "Alprazolam", "Lorazepam",
        "Zolpidem", "Hydrochlorothiazide", "Losartan", "Atorvastatin", "Simvastatin"
    ]

    dosage_units = ["mg", "mcg", "g", "mL"]
    common_dosages = ["100", "200", "250", "400", "500", "600", "750", "1000"]
    hour_intervals = ["4", "6", "8", "12", "24"]

    with open("medications.txt", "w") as file:
        for _ in range(100):
            medication = {
                "name": random.choice(medication_names),
                "hourInterval": random.choice(hour_intervals),
                "dosage": f"{random.choice(common_dosages)}{random.choice(dosage_units)}",
                "hasTaken": False,
                "lastTaken": "2024-01-14T08:00:00"
            }
            file.write(json.dumps(medication) + "\n")

    print("Medications data written to medications.txt")

if __name__ == "__main__":
    #generate_doctors()
    generate_patients()
    #generate_nurses()
    #generate_medications()
    pass