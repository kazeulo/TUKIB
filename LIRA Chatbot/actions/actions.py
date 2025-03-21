import csv
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionSaveServiceRequestToCSV(Action):

    def name(self) -> Text:
        return "action_save_service_request_to_csv"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get the slot values
        service = tracker.get_slot('service')
        first_name = tracker.get_slot('first_name')
        last_name = tracker.get_slot('last_name')
        email = tracker.get_slot('email')
        affiliation = tracker.get_slot('affiliation')
        lab_partner = tracker.get_slot('lab_partner')
        date = tracker.get_slot('date')
        facility = tracker.get_slot('facility')
        start_date = tracker.get_slot('start_date')
        end_date = tracker.get_slot('end_date')
        # Add any other slots you want to save

        # Define the CSV file path
        csv_file = 'service_requests.csv'

        # Create or append to the CSV file
        with open(csv_file, mode='a', newline='') as file:
            writer = csv.writer(file)
            # Write the header row only if the file is empty
            if file.tell() == 0:
                writer.writerow(['Service', 'First Name', 'Last Name', 'Email', 'Affiliation', 'Lab Partner', 'Date', 'Facility', 'Start Date', 'End Date'])
            
            # Write the slot values
            writer.writerow([service, first_name, last_name, email, affiliation, lab_partner, date, facility, start_date, end_date])

        # Send a message to the user confirming the request is saved
        dispatcher.utter_message(text="Your service request has been saved.")

        return []
