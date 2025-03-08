import React from 'react';
import ServicePage from '../Service.js';

const FacilityRental = () => {
  const pageData = {
    title: "Use of Facility",
    subtitle: "Access our modern facilities for your events and meetings",
    description: [
      "Clients are welcome to rent facilities within the UPV RRC, such as the Audio-Visual Room (AVR) and other available spaces. These facilities can be used for various purposes, including meetings, seminars, workshops, or events. Each facility is equipped with modern amenities to support your specific needs.",
      "To ensure proper usage and availability, prior coordination and booking are required. Our staff will assist you in securing the space, ensuring all necessary equipment and arrangements are in place for your event."
    ],
    additionalInfo: "All facilities come equipped with basic amenities. Additional equipment can be arranged upon request.",
    prices: [
      {
        service: "AVR Rental (e.g., for meetings, seminars, training sessions)",
        range: "₱8000 - ₱15000 per session"
      },
      {
        service: "Meeting Room Rental (e.g., smaller spaces for group discussions)",
        range: "₱5000 - ₱8000 per session"
      },
      {
        service: "Event Space Rental (e.g., for larger conferences, workshops)",
        range: "₱10000 - ₱20000 per session"
      },
      {
        service: "Additional Services (e.g., AV equipment, setup assistance)",
        range: "Prices vary based on services requested"
      }
    ],
    steps: [
      "Use the chatbot for inquiries and to have an initial consultation regarding the specifics of the facility rental you will be availing.",
      "Alternatively, you can send a message to rrc.upvisayas@up.edu.ph for further information. An RRC representative will provide you with details on the available facilities, equipment, and the rental process.",
      "Once the facility and rental schedule are confirmed, you will be given an account where you can fill out a form and formally submit your request.",
      "A charge slip will be issued for the rental. Payment must be settled before the usage of the facility. Please settle the bill at the UPV Cash Office.",
      "Upload the official receipt to your account for confirmation of your rental.",
      "Provide feedback on your experience to help us improve our services."
    ]
  };

  return <ServicePage {...pageData} />;
};

export default FacilityRental;