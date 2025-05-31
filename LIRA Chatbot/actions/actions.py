from datetime import datetime
import os
import pathlib
import random
import string
import psycopg2
from psycopg2.errors import UniqueViolation
from typing import Any, Text, Dict, List, Optional
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk import FormValidationAction
from rasa_sdk.events import SlotSet, UserUtteranceReverted, ActiveLoop, FollowupAction
from rasa_sdk.types import DomainDict
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

####################################################################################################
# DATABASE                                                                                         #
####################################################################################################
# class ActionSaveServiceRequestToDB(Action):

#     def name(self) -> Text:
#         return "action_save_service_request"

#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

#         # Get slot values
#         service = tracker.get_slot('service')
#         first_name = tracker.get_slot('first_name')
#         last_name = tracker.get_slot('last_name')
#         email = tracker.get_slot('email')
#         affiliation = tracker.get_slot('affiliation')
#         phone_number = tracker.get_slot('phone_number')
#         lab_partner = tracker.get_slot('lab_partner')
#         auth_representative = tracker.get_slot('auth_representative')
#         equipment_name = tracker.get_slot('equipment_name')
#         training_topic = tracker.get_slot('training_topic')
#         number_of_participants = tracker.get_slot('number_of_participants')
#         facility = tracker.get_slot('facility')
#         start_date = tracker.get_slot('start_date')
#         end_date = tracker.get_slot('end_date')

#         # Generate a random password for the user
#         password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

#         # Database connection config
#         db_config = {
#             "dbname": "tukib_db",
#             "user": "tukib",
#             "password": "123456789",
#             "host": "localhost",
#             "port": "5432"
#         }

#         try:
#             # Connect to PostgreSQL
#             connection = psycopg2.connect(**db_config)
#             cursor = connection.cursor()

#             # Insert into userstable
#             insert_user_query = """
#                 INSERT INTO userstable (name, email, role, password, institution, contact_number, created_at)
#                 VALUES (%s, %s, %s, %s, %s, %s, %s)
#                 RETURNING id
#             """
#             user_values = (
#                 f"{first_name} {last_name}",
#                 email,
#                 'client',
#                 password,
#                 affiliation,
#                 phone_number,
#                 datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
#             )
#             cursor.execute(insert_user_query, user_values)
#             user_id = cursor.fetchone()[0]  # Get the user ID of the newly inserted user

#             # Insert into service_requests table
#             insert_request_query = """
#                 INSERT INTO service_requests (
#                     service, first_name, last_name, email, affiliation, lab_partner, 
#                     auth_representative, equipment_name, training_topic, number_of_participants, 
#                     facility, start_date, end_date, user_id
#                 ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """
#             request_values = (
#                 service, first_name, last_name, email, affiliation, lab_partner,
#                 auth_representative, equipment_name, training_topic, number_of_participants,
#                 facility, start_date, end_date, user_id
#             )
#             cursor.execute(insert_request_query, request_values)
#             connection.commit()
#             dispatcher.utter_message(text="Your service request has been saved successfully.")

#         except Exception as e:
#             dispatcher.utter_message(text=f"An error occurred while saving your request: {str(e)}")

#         finally:
#             if cursor:
#                 cursor.close()
#             if connection:
#                 connection.close()

#         # Clear all slots after saving
#         return [SlotSet(slot, None) for slot in [
#             "service", "first_name", "last_name", "email", "affiliation", "lab_partner",
#             "auth_representative", "equipment_name", "training_topic", "number_of_participants",
#             "facility", "start_date", "end_date", "phone_number"
#         ]]

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
        phone_number = tracker.get_slot('phone_number')
        lab_partner = tracker.get_slot('lab_partner')
        auth_representative = tracker.get_slot('auth_representative')
        equipment_name = tracker.get_slot('equipment_name')
        training_topic = tracker.get_slot('training_topic')
        number_of_participants = tracker.get_slot('number_of_participants')
        facility = tracker.get_slot('facility')
        start_date = tracker.get_slot('start_date')
        end_date = tracker.get_slot('end_date')

        if not email or not first_name or not last_name:
            dispatcher.utter_message(text="Missing required fields. Cannot save the request.")
            return []

        password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

        db_config = {
            "dbname": "tukib_db",
            "user": "tukib",
            "password": "123456789",
            "host": "localhost",
            "port": "5432"
        }

        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Insert into service_requests
            insert_request_query = """
                INSERT INTO service_requests (
                    service, first_name, last_name, email, affiliation, lab_partner, 
                    auth_representative, equipment_name, training_topic, number_of_participants, 
                    facility, start_date, end_date
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """
            cursor.execute(insert_request_query, (
                service, first_name, last_name, email, affiliation, lab_partner,
                auth_representative, equipment_name, training_topic, number_of_participants,
                facility, start_date, end_date
            ))
            request_result = cursor.fetchone()
            if request_result is None:
                dispatcher.utter_message(text="Failed to insert service request.")
                connection.rollback()
                return []
            request_id = request_result[0]

            # Insert into userstable
            insert_user_query = """
                INSERT INTO userstable (name, email, role, password, institution, contact_number, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING user_id
            """
            cursor.execute(insert_user_query, (
                f"{first_name} {last_name}",
                email,
                'Client',
                password,
                affiliation,
                phone_number or 'N/A',
                datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
            ))
            user_result = cursor.fetchone()
            if user_result is None:
                dispatcher.utter_message(text="Failed to insert user.")
                connection.rollback()
                return []
            user_id = user_result[0]

            # Update request with user_id
            cursor.execute("""
                UPDATE service_requests SET user_id = %s WHERE id = %s
            """, (user_id, request_id))

            connection.commit()

            # Send confirmation email
            # self.send_email(email, password)
            dispatcher.utter_message(text="Your service request has been saved successfully.")

        except UniqueViolation:
            # Rollback so the transaction can be reused
            if connection:
                connection.rollback()
            dispatcher.utter_message(text="The email you entered already exists. Use that email to login.")

        except Exception:
            # General catch-all, no details leaked
            if connection:
                connection.rollback()
            dispatcher.utter_message(text="An error occurred while saving your request. Please try again later.")


        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

        return [SlotSet(slot, None) for slot in [
            "service", "first_name", "last_name", "email", "affiliation", "lab_partner",
            "auth_representative", "equipment_name", "training_topic", "number_of_participants",
            "facility", "start_date", "end_date", "phone_number"
        ]]

    def send_email(self, to_email: str, password: str):
        from_email = "kanondilhevia@gmail.com"  # Replace with your sender email
        subject = "Your Service Request Details"
        body = f"""
        Dear user,

        Your service request has been successfully saved.
        
        Here are your login credentials:
        Email: {to_email}
        Temporary Password: {password}

        Please keep this information secure.
        
        Thank you!
        """

        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        try:
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            # It's recommended to store your email password securely using environment variables
            server.login(from_email, 'supersoniclovemachine0930')
            server.sendmail(from_email, to_email, msg.as_string())
            server.quit()
        except Exception as e:
            print(f"Failed to send email: {e}")

class ActionDefaultFallback(Action):
    def name(self) -> Text:
        return "action_default_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        active_loop = tracker.active_loop.get("name") if tracker.active_loop else None

        if active_loop:
            dispatcher.utter_message(text="I'm sorry, I didn't understand that. Can you rephrase?")
            return [
                ActiveLoop(name=active_loop),
                FollowupAction(name=active_loop)
            ]

        dispatcher.utter_message(text="I'm sorry, I didn't understand that. Can you rephrase?")
        return [UserUtteranceReverted()]

####################################################################################################
# GET NAMES                                                                                        #
####################################################################################################

# class ValidateGetCredentialsForm(FormValidationAction):
#     def name(self) -> str:
#         return "validate_get_credentials_form"

#     async def extract_first_name(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict) -> dict:
#         first_name = next(tracker.get_latest_entity_values("first_name"), None)
#         if first_name:
#             # Ask for confirmation of spelling for first name
#             dispatcher.utter_message(text=f"Is {first_name} spelled correctly?")
#             return {"first_name": first_name, "name_spelled_correctly": None}
#         return {}

#     async def validate_name_spelled_correctly(
#         self, slot_value: Any, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict
#     ) -> dict:
#         if slot_value is None:  # If we haven't received a response yet, ask for confirmation
#             return {}

#         if slot_value:  # User said it's correct (affirm)
#             dispatcher.utter_message(text="Great! Now, what's your last name?")
#             return {"name_spelled_correctly": True}
#         else:  # User said it's wrong (deny), ask for first name again
#             dispatcher.utter_message(text="Alright, please tell me your first name again.")
#             return {"first_name": None, "name_spelled_correctly": None}

#     async def extract_last_name(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict) -> dict:
#         last_name = next(tracker.get_latest_entity_values("last_name"), None)
#         if last_name:
#             # Ask for confirmation of spelling for last name
#             dispatcher.utter_message(text=f"Is {last_name} spelled correctly?")
#             return {"last_name": last_name, "name_spelled_correctly": None}
#         return {}

#     async def validate_last_name_spelled_correctly(
#         self, slot_value: Any, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict
#     ) -> dict:
#         if slot_value:  # User said it's correct (affirm)
#             return {"name_spelled_correctly": True}
#         else:  # User said it's wrong (deny), ask for last name again
#             dispatcher.utter_message(text="Alright, please tell me your last name again.")
#             return {"last_name": None, "name_spelled_correctly": None}