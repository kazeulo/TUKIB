# TUKIB: Tracking Utility for Knowledge Integration and Benchmarking

TUKIB is an integrated system designed to streamline the full-service management cycle for the University of the Philippines Visayas Regional Research Center. This system aims to improve the efficiency and effectiveness of research center operations, ranging from project initiation to management and reporting.

### Features

- **User Accounts Based on Roles**: Users can be assigned specific roles with access levels tailored to their responsibilities.
- **Automated Service Requests**: Automation of the end-to-end service management process of UPV RRC, from request initiation to completion.
- **Chatbot for Consultation Process and Client Inquiries**: A conversational AI bot powered by Rasa to assist with consultations and client inquiries.
- **Real-Time Tracking of Service Requests' Status and Equipment/Facility Availability**: Live updates on service requests status, equipment/facility availability for users.
- **Data Management and Reporting**: Efficient management of data and generation of reports for research operations and decision-making.
- **Feedback Mechanism**: A built-in feedback system that allows clients and users to provide valuable input on services.

### Tech Stack

- **React**: A JavaScript library for building user interfaces.
- **Node.js**: A JavaScript runtime for building server-side applications.
- **Express**: A web application framework for Node.js used to build the backend server.
- **PostgreSQL**: A powerful, open-source relational database system used for data storage.
- **Rasa**: An open-source machine learning framework for building conversational AI and chatbots.

### How to Run

To run this project locally, follow these steps:

1. Clone the repository.
2. Install the dependencies by running `npm install` in the project directory.
3. Start the development server by running `npm start`.
4. Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the app in action.
5. For backend, navigate to the backend folder. Install the dependencies by running `npm install`. Start the backend server with node server.js.
6. For chatbot, navigate to Lira Chatbot folder. Run rasa run --enable-api --cors "*" to start the Rasa server. In a separate terminal window, run rasa run actions to start the action server.

### How to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Open a Pull Request.

Please ensure that there are no errors or issues before submitting a pull request.

### Contributors

- Sheryl Betonio
- Kzlyr Shaira Manejo
- Rainer Mayagma

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
