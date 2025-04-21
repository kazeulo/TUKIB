import React from 'react';
import ServicePage from '../Service.js';
import ServiceRates from './ServiceRates'; 


const EquipmentRental = () => {
  const pageData = {
    title: "Use of Equipment",
    subtitle: "Access our state-of-the-art laboratory equipment",
    description: [
      "Clients are permitted to use the laboratory equipment under the supervision and guidance of our trained laboratory personnel. To ensure safe and effective operation, training is required prior to using any equipment. This ensures that users are familiar with the equipment's functions, proper handling, and safety protocols.",
      "Please coordinate with RRC personnel for further details on available equipment, training schedules, and usage guidelines. Our staff will be happy to assist you in scheduling training and provide instructions on how to use the equipment effectively."
    ],
    additionalInfo: "Please note that all equipment usage requires prior training and supervision by our staff.",
    
    steps: [
      "Use the chatbot for inquiries and to have an initial consultation regarding the specifics of the service you wish to avail.",
      "Alternatively, you can send a message to rrc.upvisayas@up.edu.ph for further information. An RRC representative will provide details on available equipment and the necessary training for usage.",
      "Once your training and equipment usage schedule are confirmed, an RRC representative will send you a request form with instructions on how to proceed.",
      "A charge slip will be issued after the equipment usage session. Please settle the bill at the UPV Cash Office.",
      "Upload the official receipt to your account for access to any results or certifications (if applicable).",
      "Provide feedback on your experience to help us improve our services."
    ]
  };

  return (
    <>
      <ServicePage {...pageData} customPricingComponent={<ServiceRates serviceType="equipment-usage" />} />
    </>
  );
};

export default EquipmentRental;