from typing import Any, Text, Dict, List

from rasa_sdk.events import SlotSet
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


class ActionReviewDetails(Action):

    def name(self) -> Text:
        return "action_review_details"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        first_name = tracker.get_slot("first_name")
        last_name = tracker.get_slot("last_name")
        email = tracker.get_slot("email")
        service = tracker.get_slot("service")

        if not (first_name or last_name or email or service):
            dispatcher.utter_message(text="I was not able to get all your details. Please try again.")
        else:
            dispatcher.utter_message(text=f"Name: {first_name} {last_name}, Email: {email}, Service: {service}. Is this correct?")
        return []

class ActionConfirmDetails(Action):

    def name(self) -> Text:
        return "action_confirm_details"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        confirmation = tracker.get_slot("confirmation")

        if confirmation == "yes":
            dispatcher.utter_message(text="Your details have been confirmed. Proceeding with the next steps.")
            return []
        elif confirmation == "no":
            dispatcher.utter_message(text="Let's go over your details again.")
            return [SlotSet("first_name", None), SlotSet("last_name", None), SlotSet("email", None)]  # Clear the slots
        else:
            dispatcher.utter_message(text="I'm not sure. Could you please confirm your details?")
            return []
