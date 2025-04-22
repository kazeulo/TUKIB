import React from 'react';
import { useNavigate } from 'react-router-dom';


/* CSS Imports */
import '../css/Service.css';
import '../css/Variables.css';
import '../css/AboutUs.css';

/* Page Imports */
import Footer from './partials/Footer';
import logo from '../assets/new_logo.png';
import missionPic from '../assets/missionpic.png';
import visionPic from '../assets/visionpic.png';
import profilepic from '../assets/profile.png';
import vidbg1 from '../assets/vidbg1.mp4';

const AboutUs = () => {
	const navigate = useNavigate();

	return (
		<div>
			{' '}
			<div className='about-us'>
				<div className='about-banner'>
					<div className='banner-text'>
						<h1>About Us</h1>
						<p>Get To Know Us More</p>
					</div>
				</div>

				{/* Section 1: About Section  */}
				<section className='about-section'>
					<div className='about-container'>
						<div className='about-header'>
							<h1>UPV REGIONAL RESEARCH CENTER</h1>
							<div className='header-divider'></div>
						</div>
						
						<div className='about-content-wrapper'>
							<div className='about-intro-block'>
								<div className='logo-container'>
									<img src={logo} alt='Research Center Logo' className='about-logo' />
									<span className='est-badge'>EST. 2018</span>
								</div>
								
								<div className='intro-text'>
									<p>
										The University of the Philippines Visayas – Regional Research
										Center (RRC) is a newly established unit that aims to strengthen the research and innovation capabilities of UP Visayas
										by providing researchers access to and training on advanced
										analytical equipment and method development.
									</p>
								</div>
							</div>
							
							<div className='expertise-block'>
								<h2>Fields of Research Excellence</h2>
								<div className='expertise-columns'>
									<ul className='expertise-list'>
										<li>Applied Chemistry</li>
										<li>Food Science</li>
										<li>Microbiology & Bioengineering</li>
									</ul>
									<ul className='expertise-list'>
										<li>Biology</li>
										<li>Material Science & Nanotechnology</li>
										<li>Computational Science</li>
									</ul>
								</div>
								<p className='expansion-note'>
									<em>Expanding soon to include:</em> Advanced Instrumentation and Device Engineering, Marine Field Studies
								</p>
							</div>
							
							<div className='mission-block'>
								<p>
									The UPV RRC aims to establish UPV as a leader in inter-, trans-, and multidisciplinary research in the
									fields of Fisheries and Aquatic Sciences, and allied disciplines by serving as a hub of knowledge and technology development, driven by the needs of society.
								</p>
								<div className='action-container'>
									<button 
										className='explore-button' 
										onClick={() => navigate('/Sample_processing')}
									>
										Explore Our Services
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Section 2: Mission and Vision */}
				<section className='mission-vision-section'>
					<div className='video-background'>
						<video autoPlay muted loop id="background-video">
						<source src={vidbg1} type="video/mp4" />
						Your browser does not support the video tag.
						</video>
					</div>
					<div className='cards-container'>
						<div className='about-card vision-card'>
							<img
								src={visionPic}
								alt='Vision Image'
							/>
							<h2>Our Vision</h2>
							<p>
								A dynamic advanced research institution in the Philippines,
								internationally recognized as a leader in innovations in the
								fields of Fisheries, Aquatic Sciences, and Allied disciplines.
							</p>
						</div>
						<div className='about-card mission-card'>
							<img
								src={missionPic}
								alt='Mission Image'
							/>
							<h2>Our Mission</h2>
							<p>
								To establish UPV as a leader in multidisciplinary research in
								the fields of Fisheries, Aquatic Sciences, and allied
								disciplines by serving as a hub of knowledge and technology
								development, driven by the needs of society.
							</p>
						</div>
					</div>
				</section>

				{/* Section 3: Organizational Chart */}
				<section className='org-chart-section'>
					<h2>Organizational Chart</h2>
					<div className='org-chart'>
						{/* Director */}
						<div className='org-group director'>
							<div className='org-card'>
								<img
									src={profilepic}
									alt='Mary Grace Sedanza'
								/>
								<h3>Asst. Prof. Mary Grace Sedanza, PhD</h3>
								<p>Director</p>
							</div>
						</div>

						{/* Research Innovation Division */}
						<h3 className='division-title'>Research Innovation Division</h3>
						<div className='org-group'>
							<div className='org-card'>
								<img
									src={profilepic}
									alt='Jade G. Pahila'
								/>
								<h4>Jade G. Pahila, PhD</h4>
								<p>
									University Researcher I<br />
									Food, Feeds, and Functional Nutrition Laboratory
								</p>
							</div>
							<div className='org-card'>
								<img
									src={profilepic}
									alt='David James M. Lopez'
								/>
								<h4>David James M. Lopez</h4>
								<p>
									Laboratory Technician II
									<br />
									Food, Feeds, and Functional Nutrition Laboratory
								</p>
							</div>
							<div className='org-card'>
								<img
									src={profilepic}
									alt='Luke Drandel D. Atencio'
								/>
								<h4>Luke Drandel D. Atencio</h4>
								<p>
									University Researcher I<br />
									Microbiology Laboratory and Biology Laboratory
								</p>
							</div>
							<div className='org-card'>
								<img
									src={profilepic}
									alt='Ma. Jamaica Trexy E. Magdayao'
								/>
								<h4>Ma. Jamaica Trexy E. Magdayao, R.Ch.</h4>
								<p>
									University Researcher I<br />
									Applied Chemistry Laboratory and Material Science Laboratory
								</p>
							</div>
						</div>

						{/* TECD & Admin Section */}
						<h3 className='division-title'>TECD & Admin Section</h3>
						<div className='org-group'>
							<div className='org-card'>
								<img
									src={profilepic}
									alt='Jose Marie A. Eslopor'
								/>
								<h4>Jose Marie A. Eslopor</h4>
								<p>
									University Extension Specialist I<br />
									Training, Extension, and Communication Division
								</p>
							</div>
							<div className='org-card'>
								<img
									src={profilepic}
									alt='Susci Ann J. Sobrevega'
								/>
								<h4>Susci Ann J. Sobrevega</h4>
								<p>
									Administrative Assistant IV
									<br />
									Administrative Section
								</p>
							</div>
						</div>

						{/* Engineering Section */}
						<h3 className='division-title'>Engineering Section</h3>
						<div className='org-group'>
							<div className='org-card'>
								<img
									src={profilepic}
									alt='Vincent John D. Fuentes'
								/>
								<h4>Engr. Vincent John D. Fuentes</h4>
								<p>
									Engineer IV
									<br />
									Engineering Section
								</p>
							</div>
							<div className='org-card'>
								<img
									src={profilepic}
									alt='Arnie G. Moquera'
								/>
								<h4>Engr. Arnie G. Moquera</h4>
								<p>
									Engineer III
									<br />
									Engineering Section
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>
			<Footer />
		</div>
	);
};

export default AboutUs;
