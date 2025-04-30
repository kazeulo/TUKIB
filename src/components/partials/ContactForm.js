import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/partials/ContactForm.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [messageStatus, setMessageStatus] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/messages/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Form submitted successfully:', data);

                // Reset the form
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                });

                // Show success message
                setMessageStatus('Your message has been successfully sent!');
                setMessageType('success');

                // Clear message after 5 seconds
                setTimeout(() => {
                    setMessageStatus('');
                    setMessageType('');
                }, 5000);
            } else {
                const errorData = await response.json();
                console.error('Error submitting form:', errorData);
                setMessageStatus('There was an error sending your message. Please try again.');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessageStatus('There was an error sending your message. Please try again.');
            setMessageType('error');
        }
    };

    return (
        <div className="contact-us">
			<div className='contactInfo row'> 
				<div className="col-md-6">
					<div className="info-item d-flex align-items-center">
						<i className="icon bi bi-map flex-shrink-0"></i>
						<div>
							<h4>Our Address</h4>
							<p>University of the Philippines - Visayas, Miagao, Iloilo</p>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="info-item d-flex align-items-center">
						<i className="icon bi bi-envelope flex-shrink-0"></i>
						<div>
							<h4>Email Us</h4>
							<p>upvrrc@gmail.com</p>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="info-item d-flex align-items-center">
						<i className="icon bi bi-telephone flex-shrink-0"></i>
						<div>
							<h4>Call Us</h4>
							<p>+63 912 345 6789</p>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="info-item d-flex align-items-center">
						<i className="icon bi bi-share flex-shrink-0"></i>
						<div>
							<h4>Opening Hours</h4>
							<div>
								<p>
									<strong>Mon-Sat:</strong> 11AM - 11PM &emsp;
									<strong>Sunday:</strong> Closed
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

            <Form onSubmit={handleSubmit} className='contact-form'>
                <Row>
                    {/* Name Field */}
                    <Col md={6}>
                        <Form.Group controlId='name'>
                            <Form.Control
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder='Your name'
                            />
                        </Form.Group>
                    </Col>

                    {/* Email Field */}
                    <Col md={6}>
                        <Form.Group controlId='email'>
                            <Form.Control
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder='Your email'
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Subject Field */}
                <Form.Group controlId='subject'>
                    <Form.Control
                        type='text'
                        name='subject'
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder='Subject'
                    />
                </Form.Group>

                {/* Message Field */}
                <Form.Group controlId='message'>
                    <Form.Control
                        as='textarea'
                        rows={4}
                        name='message'
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder='Message'
                    />
                </Form.Group>

                {/* Submit Button */}
                <Button type='submit' className='primary-button'>
                    Submit
                </Button>

                {/* Message Status (Success/Error) */}
                {messageStatus && (
                    <div
                        className={`message-status ${messageType === 'success' ? 'success' : 'error'}`}
                    >
                        {messageStatus}
                    </div>
                )}
            </Form>

			<div className='location'>
				<h5>Visit us</h5>
				<iframe
					title='"Regional Research Center Location"'
					src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2201.961444697611!2d122.22112810096463!3d10.642847900860765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33ae5d39c45fc653%3A0x3677cdbbf1b7509d!2sRegional%20Research%20Center!5e0!3m2!1sen!2sph!4v1731212160252!5m2!1sen!2sph'
					width='100%'
					height='450'
					style={{ border: 0 }}
					allowFullScreen=''
					loading='lazy'
					referrerPolicy='no-referrer-when-downgrade'></iframe>
			</div>
        </div>
    );
};

export default ContactForm;