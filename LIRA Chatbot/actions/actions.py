import psycopg2
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionSaveServiceRequestToDB(Action):

    def name(self) -> Text:
        return "action_save_service_request"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get slot values
        service = tracker.get_slot('service')
        first_name = tracker.get_slot('first_name')
        last_name = tracker.get_slot('last_name')
        email = tracker.get_slot('email')
        affiliation = tracker.get_slot('affiliation')
        lab_partner = tracker.get_slot('lab_partner')
        facility = tracker.get_slot('facility')
        start_date = tracker.get_slot('start_date')
        end_date = tracker.get_slot('end_date')

        # Database connection details
        db_config = {
            "dbname": "tukib_db",
            "user": "tukib",
            "password": "123456789",
            "host": "localhost",
            "port": "5432"
        }

        try:
            # Connect to PostgreSQL
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Insert data into service_requests table
            insert_query = """
                INSERT INTO service_requests 
                (service, first_name, last_name, email, affiliation, lab_partner, facility, start_date, end_date) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (service, first_name, last_name, email, affiliation, lab_partner, facility, start_date, end_date))

            # Commit transaction
            connection.commit()
            dispatcher.utter_message(text="Your service request has been saved successfully.")

        except Exception as e:
            dispatcher.utter_message(text=f"An error occurred while saving your request: {str(e)}")

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

        # Clear the slots after saving
        return [
            SlotSet("service", None),
            SlotSet("first_name", None),
            SlotSet("last_name", None),
            SlotSet("email", None),
            SlotSet("affiliation", None),
            SlotSet("lab_partner", None),
            SlotSet("facility", None),
            SlotSet("start_date", None),
            SlotSet("end_date", None),
        ]
