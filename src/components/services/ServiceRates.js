import { useState } from 'react';
import '../../css/ServiceRates.css';

// This component can be imported into each service file (EquipmentRental.js, SampleProcessing.js, etc.)
const ServiceRates = ({ serviceType }) => {
  const [activeLab, setActiveLab] = useState('all');
  
  // Define laboratory names and their display labels
  const laboratories = {
    'food-feeds': 'FOOD, FEEDS, and FUNCTIONAL LABORATORY',
    'material-science': 'MATERIAL SCIENCE & NANOTECHNOLOGY LABORATORY',
    'applied-chemistry': 'APPLIED CHEMISTRY LABORATORY',
    'biology': 'BIOLOGY LABORATORY',
    'microbiology': 'MICROBIOLOGY & BIOENGINEERING LABORATORY'
  };

  // This data structure would be imported from a separate file in a production app
  // For this example, we'll include sample data for equipment usage
  const pricingData = {
    'equipment-usage': {
      'food-feeds': [
        { service: 'Analytical Balance', rate: 'Php120.00/hour' },
        { service: 'Chamber Vacuum Sealer', rate: 'Php100.00/hour' },
        { service: 'Chemical Fume Hood', rate: 'Php170.00/hour' },
        { service: 'Constant Climate Chamber', rate: 'Php240.00 – Php330.00/hour' },
        { service: 'Constant Temperature Drying Oven', rate: 'Php100.00/hour' },
        { service: 'Forced Air Drying Oven', rate: 'Php100.00/hour' },
        { service: 'HPLC', rate: 'Php1,300.00 – Php1,600.00/hour' },
        { service: 'Ice Cream Maker', rate: 'Php100.00/hour' },
        { service: 'Moisture Analyzer', rate: 'Php140.00/hour' },
        { service: 'pH Meter', rate: 'Php100.00/hour' },
        { service: 'Refractometer', rate: 'Php140.00/hour' },
        { service: 'Rheometer', rate: 'Php340.00/hour' },
        { service: 'Rotary Evaporator', rate: 'Php440.00/hour' },
        { service: 'Spray Dryer', rate: 'Php650.00/hour' },
        { service: 'Texture Analyzer', rate: 'Php240.00/hour' },
        { service: 'Ultrasonic Bath', rate: 'Php100.00/hour' },
        { service: 'UV-Vis Spectrophotometer, 6-placer (190-1100nm)', rate: 'Php550.00/hour' },
        { service: 'Water Activity Meter', rate: 'Php140.00/hour' }
      ],
      'biology': [
        { service: 'Biochemical incubator', rate: 'Php150.00/hour' },
        { service: 'Diamond saw', rate: 'Php280.00/hour' },
        { service: 'Drying oven', rate: 'Php100.00/hour' },
        { service: 'Microanalytical balance', rate: 'Php350.00/hour' },
        { service: 'Microtome', rate: 'Php280.00/hour' },
        { service: 'Paraffin dispenser', rate: 'Php140.00/hour' },
        { service: 'Slide drying bench', rate: 'Php100.00/hour' },
        { service: 'Stereomicroscopes', rate: 'Php140.00 – Php420.00/hour' }
      ],
      'applied-chemistry': [
        { service: 'Analytical Balance', rate: 'Php120.00/hour' },
        { service: 'Homogenizer', rate: 'Php200.00/hour' },
        { service: 'HPLC', rate: 'Php1,300.00 – Php1,600.00/hour' },
        { service: 'Microplate Reader', rate: 'Php580.00/hour' },
        { service: 'pH meter', rate: 'Php100.00/hour' },
        { service: 'Preparative HPLC', rate: 'Php1,300.00 – Php1,600.00/hour' },
        { service: 'Refrigerated Centrifuge', rate: 'Php450.00/hour' },
        { service: 'Shaking Incubator', rate: 'Php200.00/hour' },
        { service: 'Ultrasonicator (probe-type)/ Ultrasonic Homogenizer', rate: 'Php230.00/hour' },
        { service: 'UPLC-ToF/MS', rate: 'Php6,840.00 – Php6,970.00/hour' },
        { service: 'Vacuum Evaporation System', rate: 'Php190.00/hour' }
      ],
      'material-science': [
        { service: 'Atomic Force Microscope (AFM)', rate: 'Php2,040.00/hour' },
        { service: 'Microwave Synthesizer', rate: 'Php940.00/hour' },
        { service: 'MidIR-NIR-Raman Spectrometer', rate: 'Php1,970.00/hour' },
        { service: 'Muffle Furnace', rate: 'Php250.00/hour' },
        { service: 'Scanning Electron Microscope - Energy Dispersive Spectrometer (SEM-EDS)', rate: 'Php2,360.00/hour' },
        { service: 'Spectrofluorometer', rate: 'Php2,100.00/hour' },
        { service: 'STA-DSC', rate: 'Php1,920.00/hour' },
        { service: 'UV-Vis Spectrophotometer, (200-1800nm: UV-Vis, NIR, with DRA)', rate: 'Php930.00/hour' }
      ],
      'microbiology': [
        { service: 'Autoclave', rate: 'Php240.00/hour' },
        { service: 'Biosafety Cabinet', rate: 'Php270.00/hour' },
        { service: 'Compound Microscope', rate: 'Php280.00/hour' },
        { service: 'Incubators (Shaker & Standard)', rate: 'Php200.00/hour' },
        { service: 'Laminar Flow Hood', rate: 'Php170.00/hour' },
        { service: 'pH meter', rate: 'Php100.00/hour' }
      ]
    },
    'sample-processing': {
      'food-feeds': [
        { service: 'Texture Analysis (Basic Compression)', rate: 'Php130.00/sample' },
        { service: 'Texture Analysis (Basic Tensile)', rate: 'Php130.00/sample' },
        { service: 'Freeze Drying', rate: 'Php250.00/hour' },
        { service: 'Spray Drying', rate: 'Php1,410.00/liter of sample' }
      ],
      'material-science': [
        { service: 'AFM Imaging', rate: 'Php6,410.00/sample', inclusion: '2 scans per sample' },
        { service: 'Surface Profilometry', rate: 'Php8,010.00/sample', inclusion: '2 scans per sample' },
        { service: 'Surface Roughness', rate: 'Php8,010.00/sample', inclusion: '2 scans per sample' },
        { service: 'Topography', rate: 'Php8,010.00/sample', inclusion: '2 scans per sample' },
        { service: 'FTIR-ATR Analysis (No ID)', rate: 'Php4,260.00/sample', inclusion: '2 replicates per sample' },
        { service: 'FT-MIDR Analysis (No ID)', rate: 'Php4,260.00/sample', inclusion: '2 replicates per sample' },
        { service: 'FT-NIR Analysis (No ID)', rate: 'Php4,260.00/sample', inclusion: '2 replicates per sample' },
        { service: 'Raman Analysis', rate: 'Php4,120.00/sample', inclusion: '2 replicates per sample' },
        { service: 'SEM Analysis', rate: 'Php5,900.00/sample', inclusion: '5 SEM images' },
        { service: 'SEM Imaging -EDS Point Analysis', rate: 'Php6,300.00/sample', inclusion: '5 SEM images and 2 EDS scans per sample' },
        { service: 'SEM Imaging -EDS Line Analysis', rate: 'Php7,560.00/sample', inclusion: '5 SEM images and 2 EDS scans per sample' },
        { service: 'SEM Imaging -EDS Mapping Analysis', rate: 'Php8,920.00/sample', inclusion: '5 SEM images and 2 EDS scans per sample' },
        { service: 'Sputter Coater', rate: 'Php590.00/sample' },
        { service: 'Spin Coater', rate: 'Php590.00/sample' },
        { service: 'Fluorescence Analysis', rate: 'Php3,470.00/sample', inclusion: '2 replicates per sample' },
        { service: 'Phosphorescence Analysis', rate: 'Php3,470.00/sample', inclusion: '2 replicates per sample' },
        { service: 'Lifetime Measurements', rate: 'Php3,470.00/sample', inclusion: '2 replicates per sample' },
        { service: 'Thermogravimetric Analysis', rate: 'Php4,140.00/sample', inclusion: '2 replicates per sample' },
        { service: 'Differential Scanning Calorimetry', rate: 'Php4,140.00/sample', inclusion: '2 replicates per sample' },
        { service: 'Absorbance Measurements (UV-Vis)', rate: 'Php430.00/sample', inclusion: '2 replicates per sample' },
        { service: 'Absorbance Measurements (UV-Vis-NIR)', rate: 'Php860.00/sample', inclusion: '2 replicates per sample' },
        { service: 'Reflectance Measurements', rate: 'Php1,710.00/sample', inclusion: '2 replicates per sample' },
        { service: 'Transmission Analysis', rate: 'Php1,710.00/sample', inclusion: '2 replicates per sample' }
      ],
      'applied-chemistry': [
        { service: 'Type 1 (Ultrapure) water (per L)', rate: 'Php300.00/3 liter' },
        { service: 'Type 2 (Pure) water (per L)', rate: 'Php280.00/liter' }
      ]
    }
  };

  // Find available labs for the current service type
  const availableLabs = Object.keys(pricingData[serviceType] || {}).filter(
    lab => pricingData[serviceType][lab].length > 0
  );

  // Get services for the selected lab (or all labs if "all" is selected)
  const getServicesForActiveLab = () => {
    if (activeLab === 'all') {
      // Combine all labs' services
      let allServices = [];
      availableLabs.forEach(lab => {
        allServices = [...allServices, ...pricingData[serviceType][lab]];
      });
      return allServices;
    } else {
      return pricingData[serviceType][activeLab] || [];
    }
  };

  // Check if we need to display the inclusions column (for sample processing)
  const needsInclusionsColumn = serviceType === 'sample-processing' && 
    getServicesForActiveLab().some(service => service.inclusion);

  return (
    <div className="service-pricing">
      {availableLabs.length > 0 ? (
        <>
          <div className="lab-filter">
            <h3>Filter by Laboratory</h3>
            <div className="lab-buttons">
              <button 
                className={activeLab === 'all' ? 'active' : ''} 
                onClick={() => setActiveLab('all')}
              >
                All Laboratories
              </button>
              {availableLabs.map(lab => (
                <button
                  key={lab}
                  className={activeLab === lab ? 'active' : ''}
                  onClick={() => setActiveLab(lab)}
                >
                  {laboratories[lab]}
                </button>
              ))}
            </div>
          </div>

          <div className="pricing-tables">
            {activeLab === 'all' ? (
              // Display separate tables for each lab when "All" is selected
              availableLabs.map(lab => (
                <div key={lab} className="lab-pricing-section">
                  <h3>{laboratories[lab]}</h3>
                  <table className="pricing-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Rate/Fee</th>
                        {needsInclusionsColumn && <th>Inclusions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {pricingData[serviceType][lab].map((service, index) => (
                        <tr key={index}>
                          <td>{service.service}</td>
                          <td>{service.rate}</td>
                          {needsInclusionsColumn && (
                            <td>{service.inclusion || '-'}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              // Display single table for selected lab
              <div className="lab-pricing-section">
                <h3>{laboratories[activeLab]}</h3>
                <table className="pricing-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Rate/Fee</th>
                      {needsInclusionsColumn && <th>Inclusions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {getServicesForActiveLab().map((service, index) => (
                      <tr key={index}>
                        <td>{service.service}</td>
                        <td>{service.rate}</td>
                        {needsInclusionsColumn && (
                          <td>{service.inclusion || '-'}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>No pricing information available for this service type.</p>
      )}
    </div>
  );
};

export default ServiceRates;