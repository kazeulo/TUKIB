import React from 'react';

/* css imports */
import '../css/Service.css';
import '../css/Variables.css';
import '../css/AboutUs.css';

/* page imports */
import Header from './Header';
import Footer from './Footer';
import logo from '../assets/new_logo.png';
import icon from '../assets/rrc_icon.png';


const AboutUs = () => {
    return (
        <div className="about-us">
            <Header />
            {/* Section 1 */}
            <section className="about-section">
                <div className="about-content">
                    <h1>UPV REGIONAL RESEARCH CENTER</h1>
                    <img 
                        src={logo}
                        alt="Research Center Logo" 
                        className="about-logo" 
                    />
                    
                    <p>
                        The University of the Philippines Visayas – Regional Research Center (RRC) is a newly established unit in 2018 that aims to strengthen the research and innovation capabilities of UP Visayas by providing researchers access to and training on advanced analytical equipment and method development.
                    </p>
                    <p>
                        It is a centralized facility that provides various services catering to different fields of natural and physical sciences, specifically – Applied Chemistry, Biology, Food Science, Material Science and Nanotechnology, Microbiology and Bioengineering, and Computational Science. Soon to be included in the fields catered to by the RRC are Advanced Instrumentation and Device Engineering and Marine Field Studies. The UPV RRC aims to establish UPV as a leader in inter-, trans-, and multidisciplinary research in the fields of Fisheries and Aquatic Sciences, and allied disciplines by serving as a hub of knowledge and technology development, driven by the needs of the society through research, innovation, training, extension, and other services
                    </p>
                </div>
            </section>

            {/* Section 2 */}
            <section className="mission-vision-section">
                <div className="cards-container">
                    <div className="card vision-card">
                        <img 
                            src={icon}
                            alt="Vision Image" 
                        />
                        <h2>Our Vision</h2>
                        <p>
                            A dynamic advanced research institution in the Philippines, internationally recognized as a leader in innovations in the fields of Fisheries, Aquatic Sciences, and Allied disciplines.
                        </p>
                    </div>
                    <div className="card mission-card">
                        <img 
                            src={icon} 
                            alt="Mission Image" 
                        />
                        <h2>Our Mission</h2>
                        <p>
                            To establish UPV as a leader in multidisciplinary research in the fields of Fisheries, Aquatic Sciences, and allied disciplines by serving as a hub of knowledge and technology development, driven by the needs of society.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3 */}
            <section className="org-chart-section">
                <h2>Organizational Chart</h2>
                <p>Website Undergoing Construction.</p>
            </section>
            <Footer />
        </div>
    );
};

export default AboutUs;
