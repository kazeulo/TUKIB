import React from 'react';
import ServicePage from '../Service';

const Training = () => {
  const pageData = {
    title: "Training",
    subtitle: "Professional equipment training and certification",
    description: [
      "We offer training sessions for individuals or groups who wish to become proficient in the proper use of our laboratory equipment. These sessions are designed to ensure that users can operate the equipment safely and effectively, adhering to all best practices and protocols. The training is hands-on, allowing participants to gain practical experience with the tools, equipment, and techniques used in the lab.",
      "Our training programs cover a range of equipment and methods, including basic operation, maintenance, troubleshooting, and best practices to ensure optimal performance of the equipment. This is ideal for researchers, students, and professionals who want to utilize our equipment confidently and independently."
    ],
    additionalInfo: "The pricing for training sessions depends on the type of equipment and the duration of the training required. Please contact us for a detailed quote based on your specific needs.",
    prices: [
      {
        service: "Basic Equipment Training",
        range: "₱5000 - ₱10000 per session",
        notes: "Includes simple instruments and basic usage training"
      },
      {
        service: "Advanced Equipment Training",
        range: "₱10000 - ₱20000 per session",
        notes: "Includes specialized instruments and in-depth training"
      },
      {
        service: "Custom Training Packages",
        range: "Prices vary based on the scope of training",
        notes: "Available for groups or specific equipment needs"
      }
    ],
    steps: [
      "Use the chatbot for inquiries and to have an initial consultation regarding the specifics of the training you will be availing.",
      "Alternatively, you can send a message to rrc.upvisayas@up.edu.ph to discuss your needs.",
      "An RRC representative will help you with the available training options, schedule, and any necessary preparations.",
      "Once the training schedule is confirmed, you will receive a request form with instructions on how to complete your booking.",
      "A charge slip will be issued after the training session is completed. Please settle the bill at the UPV Cash Office.",
      "Upload the official receipt to your account for the release of your training certificate (if applicable).",
      "Provide feedback on your experience to help us improve our training services."
    ],
    customSections: [
      {
        title: "Training Benefits",
        content: [
          "Hands-on experience with laboratory equipment",
          "Professional certification (where applicable)",
          "Comprehensive understanding of safety protocols",
          "Access to expert instructors"
        ]
      }
    ]
  };

  return <ServicePage {...pageData} />;
};

export default Training;