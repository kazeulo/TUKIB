import React, { useState } from "react";
import "../css/Equipment.css";

const Equipment = () => {
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

  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const toggleCategory = (categoryName) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
  };

  const handleEquipmentClick = (equipment) => {
    setSelectedEquipment(equipment);
  };

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
            <li key={index} className="category-item">
              <div
                className="category-title"
                onClick={() => toggleCategory(category.name)}
              >
                {category.name}
                <span
                  className={`dropdown-icon ${
                    activeCategory === category.name ? "open" : ""
                  }`}
                >
                  ▼
                </span>
              </div>
              {activeCategory === category.name && (
                <ul className="equipment-list">
                  {category.equipments.map((equipment) => (
                    <li
                      key={equipment.id}
                      onClick={() => handleEquipmentClick(equipment)}
                    >
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
              src={`/images/${selectedEquipment.image}`}
              alt={selectedEquipment.name}
              className="equipment-image"
            />
            <h4>{selectedEquipment.name}</h4>
            <p>Equipment details here.</p>
            <p>
              Status:{" "}
              <select
                value={selectedEquipment.status}
                onChange={(e) =>
                  updateEquipment("status", e.target.value)
                }
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
                onChange={(e) =>
                  updateEquipment("stock", parseInt(e.target.value, 10))
                }
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