import React, { useEffect, useState } from 'react';
import Footer from './partials/Footer';
import '../css/Laboratory.css';

import equipment1 from '../assets/labpage/1.png';
import equipment2 from '../assets/labpage/2.png';
import equipment3 from '../assets/labpage/3.png';
import equipment4 from '../assets/labpage/4.png';
import equipment5 from '../assets/labpage/5.png';
import equipment6 from '../assets/labpage/6.png';
import equipment7 from '../assets/labpage/7.png';
import equipment8 from '../assets/labpage/8.png';
import equipment9 from '../assets/labpage/9.png';
import equipment10 from '../assets/labpage/10.png';
import equipment11 from '../assets/labpage/11.png';
import equipment12 from '../assets/labpage/12.png';
import equipment13 from '../assets/labpage/13.png';
import equipment14 from '../assets/labpage/14.png';
import equipment15 from '../assets/labpage/15.png';
import equipment16 from '../assets/labpage/16.png';
import equipment17 from '../assets/labpage/17.png';
import equipment18 from '../assets/labpage/18.png';
import equipment19 from '../assets/labpage/19.png';
import equipment20 from '../assets/labpage/20.png';
import equipment21 from '../assets/labpage/21.png';
import equipment22 from '../assets/labpage/22.png';


const Laboratory = () => {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
  
    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rrc-lab-card-visible');
          observer.unobserve(entry.target);
        }
      });
    };
  
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all lab cards
    document.querySelectorAll('.rrc-laboratory-card').forEach(card => {
      observer.observe(card);
    });
  
    return () => {
      observer.disconnect();
    };
  }, []);
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };



  return (
    <div className="rrc-laboratory-container">
      <section className="rrc-laboratory-header">
        <div className="rrc-laboratory-image"> </div>
        <div className="rrc-general-description">
        <h1>RRC LABORATORIES</h1>
        <p>
          The Regional Research Center (RRC) houses state-of-the-art laboratories equipped with modern instruments
          to support research activities, education, and innovation. Our facilities are available for academic research,
          industry collaborations, and community service. The center aims to provide technical expertise and
          cutting-edge equipment to advance scientific discovery and technological development in the region.
        </p> </div>
      </section>

      <section className='rrc-laboratory-names'>
        <h2 className="rrc-laboratories-heading">Our Laboratories</h2>
        <div className="rrc-laboratory-cards-container">
          <div 
            className="rrc-laboratory-card" 
            onClick={() => scrollToSection('rrc-material-science')}
          >
            <div className="rrc-laboratory-card-content">
              <h3>Material Science and <br/> Nanotechnology</h3>
            </div>
            <div className="rrc-laboratory-card-image">    </div>

          </div>
          
          <div 
            className="rrc-laboratory-card" 
            onClick={() => scrollToSection('rrc-applied-chemistry')}
          >
            <div className="rrc-laboratory-card-content">
              <h3>Applied Chemistry</h3>
            </div>
            <div className="rrc-laboratory-card-image">
            </div>
          </div>
          
          <div 
            className="rrc-laboratory-card" 
            onClick={() => scrollToSection('rrc-food-lab')}
          >
            <div className="rrc-laboratory-card-content">
              <h3>Food, Feeds, and <br/>Functional Nutrition</h3>
            </div>
            <div className="rrc-laboratory-card-image">            </div>

          </div>
          
          <div 
            className="rrc-laboratory-card" 
            onClick={() => scrollToSection('rrc-biology-microbiology')}
          >
            <div className="rrc-laboratory-card-content">
              <h3>Biology and <br/>Microbiology</h3>
            </div>
            <div className="rrc-laboratory-card-image">            </div>

          </div>
        </div>
      </section>

      <section className="rrc-laboratory-types">
        <div className="rrc-lab-type" id='rrc-material-science'>
          <h2>Material Science and Nanotechnology Laboratory</h2>
          <p>
            Specializes in the analysis, characterization, and development of materials at micro and nano scales.
            This laboratory supports research in advanced materials, surface analysis, and material properties
            for applications in industry, electronics, and engineering.
          </p>
          <h3>Equipment</h3>
          <div className="rrc-equipment-grid">
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                <img src={equipment1} alt="Spin Coater" />
              </div>
              <h4>Spin Coater</h4>
              <p>Used to spread uniform thin films on flat substrates by centrifugal force.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                <img src={equipment8} alt="Atomic Force Microscope" />
              </div>
              <h4>Atomic Force Microscope</h4>
              <p>Used to image topography of surfaces of any type of materials including polymers, ceramics, composites, glass, and nanomaterials.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                <img src={equipment9} alt="Scanning Electron Microscope" />
              </div>
              <h4>Scanning Electron Microscope</h4>
              <p>Used to project and scan a focused stream of electrons over a surface to create an image. Provides information about the surface's topography and composition.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                <img src={equipment2} alt="Muffle Furnace" />
              </div>
              <h4>Muffle Furnace</h4>
              <p>Used to heat a material to significantly high temperatures while keeping it contained and fully isolated from external contaminants, chemicals, or substances.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                <img src={equipment7} alt="MidIR-NIR-Raman Spectrometer" />
              </div>
              <h4>MidIR-NIR-Raman Spectrometer</h4>
              <p>Used to measure how much a chemical substance absorbs/reflects light.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                <img src={equipment4} alt="Simultaneous Thermal Analyzer" />
              </div>
              <h4>Simultaneous Thermal Analyzer</h4>
              <p>Used to continuously measure mass while the temperature of a sample is changed over time.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                <img src={equipment3} alt="Microwave Synthesizer" />
              </div>
              <h4>Microwave Synthesizer</h4>
              <p>Use to significantly reduce synthesis time for both organic and inorganic compounds—in some cases reducing a reaction that would occur over several hours to several minutes.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                <img src={equipment5} alt="Spectrofluorometer" />
              </div>
              <h4>Spectrofluorometer</h4>
              <p>Uses the fluorescence characteristics of chemicals to provide information on the concentration and chemical environment of those compounds in a sample.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                <img src={equipment6} alt="UV-Vis-NIR-DRS Spectrophotometer" />
              </div>
              <h4>UV-Vis-NIR-DRS Spectrophotometer</h4>
              <p>Used to measure how much a chemical substance absorbs/reflects light.</p>
            </div>
          </div>
        </div>

        <div className="rrc-lab-type" id="rrc-food-lab">
          <h2>Food, Feeds, and Functional Nutrition Laboratory</h2>
          <p>
            Focuses on research activities related to food science, nutrition, feed development, and functional food products.
            The laboratory supports studies on post-harvest processing, physical and functional characterization, and storage and shelf-life analysis.
          </p>
          <h3>Equipment</h3>
          <div className="rrc-equipment-grid">
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/freeze-dryer.jpg" alt="Freeze Dryer" />
              </div>
              <h4>Freeze Dryer</h4>
              <p>Gentle removal of water from frozen samples/products by sublimation under vacuum.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/spray-dryer.jpg" alt="Spray Dryer" />
              </div>
              <h4>Spray Dryer</h4>
              <p>Sprays the aqueous solutions into fine droplets through the nozzle and simultaneously blown by hot dehumidified gas into dry and fine particles.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/texture-analyzer.jpg" alt="Texture Analyzer" />
              </div>
              <h4>Texture Analyzer</h4>
              <p>Quantitatively measures mechanical properties of product or fixtures, which may be correlated with sensory perception.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/drying-oven.jpg" alt="Constant Temperature Drying Oven" />
              </div>
              <h4>Constant Temperature Drying Oven</h4>
              <p>Features constant convection drying with temperature range of 50-200 °C.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/forced-air-oven.jpg" alt="Forced Air Drying Oven" />
              </div>
              <h4>Forced Air Drying Oven</h4>
              <p>Convection drying with continuous draft air blowing.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/vacuum-oven.jpg" alt="Vacuum Drying Oven" />
              </div>
              <h4>Vacuum Drying Oven</h4>
              <p>Drying under vacuum condition with temperature range of 30-250 °C.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/rheometer.jpg" alt="Rheometer" />
              </div>
              <h4>Rheometer</h4>
              <p>Measures fluid sample viscosity behavior (centipoise cP) in single point or as a function of shear rate, time, etc.</p>
            </div>
          </div>
        </div>

        <div className="rrc-lab-type" id="rrc-applied-chemistry">
          <h2>Applied Chemistry Laboratory</h2>
          <p>
            Provides analytical services and research support for chemical analysis, synthesis, and characterization.
            The laboratory employs various techniques for qualitative and quantitative analysis of compounds in different matrices.
          </p>
          <h3>Equipment</h3>
          <div className="rrc-equipment-grid">
          <div className="rrc-equipment-card">
            <div className="rrc-equipment-image">
              <img src={equipment10} alt="Shaking Incubator" />
            </div>
            <h4>Shaking Incubator</h4>
            <p>Used to simultaneously incubate, agitate, and shake samples in a temperature-controlled system.</p>
          </div>
          <div className="rrc-equipment-card">
            <div className="rrc-equipment-image">
              <img src={equipment10} alt="Refrigerated Centrifuge" />
            </div>
            <h4>Refrigerated Centrifuge</h4>
            <p>Used to separate various temperature-sensitive heterogeneous sample mixtures using high-speed rotors in a constant temperature environment.</p>
          </div>
          <div className="rrc-equipment-card">
            <div className="rrc-equipment-image">
              <img src={equipment11} alt="Ultrasonic Homogenizer" />
            </div>
            <h4>Ultrasonic Homogenizer</h4>
            <p>Used in microscae extraction/sample dispersion/microscale cavitation and mixing; cell wall disruption and organic matter solubilization by ultrasonic waves.</p>
          </div>
          <div className="rrc-equipment-card">
            <div className="rrc-equipment-image">
              <img src={equipment12} alt="Homogenizer" />
            </div>
            <h4>Homogenizer</h4>
            <p>Used for mechanical disruption, disintegration, homogenization, and mixing of various mixtures.</p>
          </div>
          <div className="rrc-equipment-card">
            <div className="rrc-equipment-image">
              <img src={equipment13} alt="pH Meter" />
            </div>
            <h4>pH Meter</h4>
            <p>Used to measure hydrogen ion (H+ activity) in solutions which correlates to their acidity or basicity</p>
          </div>
          <div className="rrc-equipment-card">
            <div className="rrc-equipment-image">
              <img src={equipment14} alt="Vortex Mixer" />
            </div>
            <h4>Vortex Mixer</h4>
            <p>Used to mix liquids in small vials, test tubes, or similar containers via a rapid oscillating motion.</p>
          </div>
          <div className="rrc-equipment-card">
            <div className="rrc-equipment-image">
              <img src={equipment15} alt="Analytical Balance" />
            </div>
            <h4>Analytical Balance</h4>
            <p>Used to accurately measure mass of solid and liquid samples.</p>
          </div>
          <div className="rrc-equipment-card">
            <div className="rrc-equipment-image">
              <img src={equipment16} alt="Hotplate with Magnetic Stirrer" />
            </div>
            <h4>Hotplate with Magnetic Stirrer</h4>
            <p>Used to stir and heatsolutions simultaneously which aids in speeding up chemical reactions and to properly dissolve solutes in a solvent.</p>
          </div>
          <div className="rrc-equipment-card">
            <div className="rrc-equipment-image">
              <img src={equipment17} alt="Vacuum Evaporation System" />
            </div>
            <h4>Vacuum Evaporation System</h4>
            <p>Used to evaporate and concentrate small volumes of samples by combining heat, infrared,a nd centrifugal force under vacuum.</p>
          </div>
          <div className="rrc-equipment-card">
            <div className="rrc-equipment-image">
              <img src={equipment18} alt="UPLC/QTof-MS" />
            </div>
            <h4>Ultra-High Performance Liquid Chromatograph/Quadrupole TIme-of-Flight Mass Spectrometer (UPLC/QTof-MS)</h4>
            <p>Uses electrospray ionization (ESI) to ionize samples in vacuum for screening, characterization, structure elucidation, and identification of fragmentation patterns of various non-volatile, polar to mid-polar organic compounds by accurate mass determination.</p>
          </div>          
          <div className="rrc-equipment-card">
           <div className="rrc-equipment-image">
              <img src={equipment19} alt="HPLC" />
            </div>
            <h4>HPLC (High Performance Liquid Chromatograph) with PDA Detector</h4>
            <p>Used to separate, identify, and quantity various components in a mixture using an appropriate column and photodiode array detection.</p>
          </div>
          <div className="rrc-equipment-card">
           <div className="rrc-equipment-image">
              <img src={equipment20} alt="Preparative HPLC" />
            </div>
            <h4>Preparative HPLC</h4>
            <p>Used for separation and fraction collection/purification/isolation of both known and unknwon components in a sample mixture.</p>
          </div>
          <div className="rrc-equipment-card">
           <div className="rrc-equipment-image">
              <img src={equipment21} alt="Microplate Reader" />
            </div>
            <h4>Microplate Reader</h4>
            <p>Used to measure chemical, biological, or physical reactions, properties,a dn analytes within the well of a microplate by absorbance or flruorescnece detection.</p>
          </div>
          <div className="rrc-equipment-card">
           <div className="rrc-equipment-image">
              <img src={equipment22} alt="Lab Water Purification System" />
            </div>
            <h4>Lab Water Purification System</h4>
            <p>Used to produce both Ultrapure (Type1) and Pure (Type2) water for Chromatography, mass spectrometry, sample preparation, and washing purposes.</p>
          </div>
          </div>
        </div>

        <div className="rrc-lab-type" id="rrc-biology-microbiology">
          <h2>Biology and Microbiology Laboratory</h2>
          <p>
            Dedicated to research on biological systems, microorganisms, and cellular structures.
            This laboratory supports studies in microbial diversity, biotechnology, genetics, and environmental microbiology.
          </p>
          <h3>Equipment</h3>
          <div className="rrc-equipment-grid">
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/stereomicroscope.jpg" alt="Stereomicroscope" />
              </div>
              <h4>Stereomicroscope</h4>
              <p>Bright field and dark field microscopy with high resolution for dissecting 3-dimensional objects, biological specimen, and mineral microscope slides.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/microtome.jpg" alt="Microtome" />
              </div>
              <h4>Microtome</h4>
              <p>Cutting thin sections of tissues (1-50 microns) embedded in paraffin.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/slide-drying-bench.jpg" alt="Slide Drying Bench" />
              </div>
              <h4>Slide Drying Bench</h4>
              <p>Drying the mounted slides as the specimen dries.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/paraffin-dispenser.jpg" alt="Paraffin Dispenser" />
              </div>
              <h4>Paraffin Dispenser</h4>
              <p>Melting and dispensing of paraffin for histology slide embedding.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/bod-incubator.jpg" alt="Low Temp/BOD Incubator" />
              </div>
              <h4>Low Temp/BOD Incubator</h4>
              <p>Provides the required temperature for growth of microorganisms for BOD (biological oxygen demand) testing.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/microanalytical-balance.jpg" alt="Microanalytical Balance" />
              </div>
              <h4>Microanalytical Balance</h4>
              <p>Measures the weight of minute and delicate objects/samples.</p>
            </div>
            <div className="rrc-equipment-card">
              <div className="rrc-equipment-image">
                {/* Replace with actual image */}
                <img src="/placeholder-images/diamond-saw.jpg" alt="Low Speed Diamond Saw" />
              </div>
              <h4>Low Speed Diamond Saw</h4>
              <p>Precision cutting of a wide variety of materials (bones, metals, shells, etc.)</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Laboratory;