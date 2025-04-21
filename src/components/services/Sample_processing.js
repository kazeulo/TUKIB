import React from 'react';
import ServicePage from '../Service';
import ServiceRates from './ServiceRates'; 


const SampleProcessing = () => {
  const pageData = {
    title: "Sample Processing",
    subtitle: "Professional analysis of your samples",
    description: [
      "Clients can send their samples for processing, where raw data/results will be generated directly from the instrument. Please note that this service only provides raw data and does not include data processing, interpretation, or a Certificate of Analysis.",
      "To ensure smooth processing, your sample should be prepared and ready for analysis. If there are any specific protocols or guidelines, kindly provide them at the time of submission (if applicable)."
    ],
    prices: [
      {
        service: "Basic Sample Analysis",
        range: "₱500 - ₱1000 per sample",
        notes: "Includes simple chemical analysis, pH testing"
      },
      {
        service: "Advanced Sample Analysis",
        range: "₱1500 - ₱3000 per sample",
        notes: "Includes spectrometry, chromatography"
      },
      {
        service: "Specialized Testing",
        range: "₱2000 - ₱5000 per sample",
        notes: "Includes environmental samples, complex biological samples"
      }
    ],
    additionalInfo: "Please use the chatbot or contact us for a more detailed quote based on your specific needs. We will be happy to provide a tailored estimate.",
    steps: [
      "Use the chatbot for inquiries and to have an initial consultation regarding the specifics of the service you will be availing.",
      "Alternatively, you can send a message to rrc.upvisayas@up.edu.ph.",
      "An RRC representative will discuss the specifics of the services you will be availing, including the availability of the facility, schedule, and other details.",
      "Once the schedule and mode of sample submission have been set, clients will be given an account where they can fill out the form for their service request.",
      "Your request will be evaluated for approval. Once approved, you will receive a notification from the RRC.",
      "A charge slip will be issued after the sample processing is done. Please settle the bill at the UPV Cash Office.",
      "Upload the Official Receipt to your account for the release of your results.",
      "Provide feedback on your experience to help us improve our services."
    ]
  };

  return (
    <>
      <ServicePage {...pageData} customPricingComponent={<ServiceRates serviceType="sample-processing" />} />
    </>
  );
};

export default SampleProcessing;