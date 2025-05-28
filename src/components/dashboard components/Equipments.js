import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/dashboard components/Table.css';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import '../../css/dashboard components/Equipments.css';

const fetchEquipments = async (setEquipments) => {
    try {
        const response = await fetch('http://localhost:5000/api/equipments');
        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.equipments)) {
            setEquipments(data.equipments);
        } else {
            console.error('Fetched data is not an array:', data);
        }
    } catch (error) {
        console.error('Error fetching equipments:', error);
    }
};

const Equipments = () => {
    const [equipments, setEquipments] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [equipmentToDelete, setEquipmentToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEquipments, setFilteredEquipments] = useState([]);
    const [labs, setLabs] = useState([]);
    const [formData, setFormData] = useState({
        equipment_name: '',
        brand: '',
        model: '',
        serial_number: '',
        quantity: 0,
        staff_name: '',
        laboratory_id: '',
        sticker_paper_printed: false,
        remarks: ''
    });

    // fetching laboratories
    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/laboratory');
                if (response.data.status === 'success') {
                    setLabs(response.data.laboratories);
                }
            } catch (err) {
                console.error('Failed to fetch laboratories:', err);
            }
        };
        fetchLabs();
    }, []);

    useEffect(() => {
        fetchEquipments(setEquipments);
    }, []);

    useEffect(() => {
        const filtered = equipments.filter(equipment =>
            Object.values(equipment)
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
        setFilteredEquipments(filtered);
    }, [searchTerm, equipments]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // const handleRowClick = (equipment) => {
    //     setSelectedEquipment(equipment);
    // };

    const handleDelete = async (equipment, e) => {
        e.stopPropagation();
    
        if (window.confirm(`Are you sure you want to delete ${equipment.equipment_name}?`)) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/equipments/${equipment.equipment_id}`);
    
                if (response.data.status === 'success') {
                    // Remove the deleted equipment from the UI
                    setEquipments(prevEquipments => 
                        prevEquipments.filter(item => item.equipment_id !== equipment.equipment_id)
                    );
                    alert('Equipment deleted successfully');
                }
            } catch (error) {
                console.error('Error deleting equipment:', error);
                alert('Failed to delete equipment');
            }
        }
    };    

    const handleEditClick = (equipment, e) => {
        e.stopPropagation();
        setSelectedEquipment(equipment);
        setFormData({
            equipment_name: equipment.equipment_name,
            brand: equipment.brand,
            model: equipment.model,
            serial_number: equipment.serial_number,
            quantity: equipment.quantity,
            staff_name: equipment.staff_name,
            laboratory_id: equipment.laboratory_id,
            sticker_paper_printed: equipment.sticker_paper_printed,
            remarks: equipment.remarks
        });
        setIsEditing(true);
    };

    const handleAddClick = () => {
        setSelectedEquipment(null);
        setFormData({
            equipment_name: '',
            brand: '',
            model: '',
            serial_number: '',
            quantity: 0,
            staff_name: '',
            laboratory_id: '',
            sticker_paper_printed: false,
            remarks: ''
        });
        setIsAdding(true);
    };

    const handleCloseOverlay = () => {
        setSelectedEquipment(null);
        setIsEditing(false);
        setIsAdding(false);
        setShowDeleteConfirm(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
    
        const selectedLab = labs.find(lab => lab.laboratory_name === formData.laboratory_id);

        if (!selectedLab) {
            alert("Laboratory missing or invalid.");
            return;
        }
    
        const requestData = {
            equipment_name: formData.equipment_name,
            brand: formData.brand,
            model: formData.model,
            serial_number: formData.serial_number,
            quantity: formData.quantity,
            staff_name: formData.staff_name,
            laboratory_id: selectedLab.laboratory_id,
            sticker_paper_printed: formData.sticker_paper_printed,
            remarks: formData.remarks,
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/equipments', requestData);
    
            if (response.data.status === 'success') {
                alert('Equipment added successfully');
                fetchEquipments(setEquipments); 
                handleCloseOverlay();
            } else {
                alert('Failed to add equipment');
            }
        } catch (error) {
            console.error('Error adding equipment:', error);
            alert('Failed to add equipment');
        }
    };    

    return (
        <div>
            <div className="table-container">
                <div className="table-header">
                    <h2>EQUIPMENT LIST</h2>
                    <button className="add-btn" onClick={handleAddClick}>
                        Add Equipment
                    </button>
                </div>

                <div className="filtering-container">
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search equipment by any field..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className='table-wrapper table-responsive'>
                    <table className="equipment-table">
                        <thead>
                            <tr>
                                <th>Equipment ID</th>
                                <th>Equipment Name</th>
                                <th>Quantity</th>
                                <th>Laboratory</th>
                                <th>Staff Incharge</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipments.length > 0 ? (
                                filteredEquipments.map(equipment => (
                                    // <tr key={equipment.equipment_id} onClick={() => handleRowClick(equipment)}>
                                        <tr key={equipment.equipment_id}>
                                        <td>{equipment.equipment_id}</td>
                                        <td>{equipment.equipment_name}</td>
                                        <td>{equipment.quantity}</td>
                                        <td>{equipment.laboratory_name}</td>
                                        <td>{equipment.staff_name}</td>
                                        <td>
                                            <button 
                                                className="edit-btn" 
                                                onClick={(e) => handleEditClick(equipment, e)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="delete-btn" 
                                                onClick={(e) => handleDelete(equipment, e)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                        {searchTerm ? 'No matching equipment found' : 'No equipment available'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {(isEditing || isAdding) && (
                <div className="overlay" onClick={handleCloseOverlay}>
                    <div className="overlay-content" onClick={e => e.stopPropagation()}>
                        <h3>{isAdding ? "Add Equipment" : "Edit Equipment"}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Equipment Name</label>
                            <input 
                                type="text" 
                                name="equipment_name"
                                value={formData.equipment_name}
                                onChange={handleInputChange}
                                required 
                            />

                            <label>Brand</label>
                            <input 
                                type="text" 
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                            />

                            <label>Model</label>
                            <input 
                                type="text" 
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                            />

                            <label>Serial Number</label>
                            <input 
                                type="text" 
                                name="serial_number"
                                value={formData.serial_number}
                                onChange={handleInputChange}
                            />

                            <label>Quantity</label>
                            <input 
                                type="number" 
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required 
                            />

                            <label>Staff Name</label>
                            <input 
                                type="text" 
                                name="staff_name"
                                value={formData.staff_name}
                                onChange={handleInputChange}
                            />

                            <label>Laboratory</label>
                            <select
                                name="laboratory_id"
                                value={formData.laboratory_id}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Laboratory</option>
                                {labs.map((lab) => (
                                    <option key={lab.laboratory_id} value={lab.laboratory_name}>
                                        {lab.laboratory_name}
                                    </option>
                                ))}
                            </select>

                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    name="sticker_paper_printed"
                                    checked={formData.sticker_paper_printed}
                                    onChange={handleInputChange}
                                />
                                Sticker Paper Printed
                            </label>

                            <label>Remarks</label>
                            <input 
                                type="text" 
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleInputChange}
                            />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="cancel-btn" onClick={handleCloseOverlay}>Cancel</button>
                                <button type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="overlay" onClick={handleCloseOverlay}>
                    <div className="overlay-content confirmation-dialog" onClick={e => e.stopPropagation()}>
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete {equipmentToDelete?.equipment_name}?</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                            <button onClick={() => {
                                // Add delete logic here
                                handleCloseOverlay();
                            }}>Delete</button>
                            <button className="cancel-btn" onClick={handleCloseOverlay}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Equipments;