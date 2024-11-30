import React, { useState } from "react";
import "../css/Equipment.css";

const Equipment = () => {
  // Categories and equipment data
  const [categories] = useState([
    {
      name: "Applied Chemistry",
      equipments: [
        { id: 1, name: "Spectrophotometer", image: "spectrophotometer.jpg", status: "Available", stock: 10 },
        { id: 2, name: "pH Meter", image: "ph_meter.jpg", status: "Available", stock: 5 },
      ],
    },
    {
      name: "Biology",
      equipments: [
        { id: 3, name: "Microscope", image: "microscope.jpg", status: "Out of Stock", stock: 0 },
        { id: 4, name: "Centrifuge", image: "centrifuge.jpg", status: "Available", stock: 8 },
      ],
    },
    {
      name: "Food Science",
      equipments: [
        { id: 5, name: "Texture Analyzer", image: "texture_analyzer.jpg", status: "Unavailable", stock: 3 },
      ],
    },
    {
      name: "Material Science and Nanotechnology",
      equipments: [
        { id: 6, name: "X-Ray Diffractometer", image: "xray_diffractometer.jpg", status: "Available", stock: 2 },
      ],
    },
    {
      name: "Microbiology and Bioengineering",
      equipments: [
        { id: 7, name: "Fermenter", image: "fermenter.jpg", status: "Available", stock: 4 },
        { id: 8, name: "Autoclave", image: "autoclave.jpg", status: "Unavailable", stock: 0 },
      ],
    },
  ]);

  // State for managing active dropdown and selected equipment
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Function to toggle category dropdown
  const toggleCategory = (categoryName) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  // Function to handle equipment click
  const handleEquipmentClick = (equipment) => {
    setSelectedEquipment(equipment);
  };

  // Function to update equipment status or stock
  const updateEquipment = (field, value) => {
    setSelectedEquipment((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="equipment-page">
      {/* Sidebar for Categories */}
      <aside className="categories-sidebar">
        <h3>Laboratories</h3>
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              <strong onClick={() => toggleCategory(category.name)} className="category-title">
                {category.name}
              </strong>
              {activeCategory === category.name && (
                <ul className="equipment-list">
                  {category.equipments.map((equipment) => (
                    <li key={equipment.id} onClick={() => handleEquipmentClick(equipment)}>
                      {equipment.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content for Equipment Details */}
      <main className="equipment-content">
        <h3>Equipment Details</h3>
        {selectedEquipment ? (
          <div className="equipment-details">
            <img
              src={`/images/${selectedEquipment.image}`} // Ensure images are stored in /public/images/
              alt={selectedEquipment.name}
              className="equipment-image"
            />
            <h4>{selectedEquipment.name}</h4>
            <p>
              Status:{" "}
              <select
                value={selectedEquipment.status}
                onChange={(e) => updateEquipment("status", e.target.value)}
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </p>
            <p>
              Stock:{" "}
              <input
                type="number"
                value={selectedEquipment.stock}
                min="0"
                onChange={(e) => updateEquipment("stock", parseInt(e.target.value, 10))}
              />
            </p>
          </div>
        ) : (
          <p>Select an equipment from the list to view details.</p>
        )}
      </main>
    </div>
  );
};

export default Equipment;
