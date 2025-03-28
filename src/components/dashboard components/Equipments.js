import React, { useState, useEffect } from 'react';
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

    const handleRowClick = (equipment) => {
        setSelectedEquipment(equipment);
    };

    const handleEditClick = (equipment, e) => {
        e.stopPropagation();
        setSelectedEquipment(equipment);
        setIsEditing(true);
    };

    const handleDeleteClick = (equipment, e) => {
        e.stopPropagation();
        setEquipmentToDelete(equipment);
        setShowDeleteConfirm(true);
    };

    const handleAddClick = () => {
        setSelectedEquipment(null);
        setIsAdding(true);
    };

    const handleCloseOverlay = () => {
        setSelectedEquipment(null);
        setIsEditing(false);
        setIsAdding(false);
        setShowDeleteConfirm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        handleCloseOverlay();
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
                                <th>Location</th>
                                <th>Staff Incharge</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipments.length > 0 ? (
                                filteredEquipments.map(equipment => (
                                    <tr key={equipment.equipment_id} onClick={() => handleRowClick(equipment)}>
                                        <td>{equipment.equipment_id}</td>
                                        <td>{equipment.equipment_name}</td>
                                        <td>{equipment.quantity}</td>
                                        <td>{equipment.location}</td>
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
                                                onClick={(e) => handleDeleteClick(equipment, e)}
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

            {(selectedEquipment && !isEditing && !isAdding) && (
                <div className="overlay" onClick={handleCloseOverlay}>
                    <div className="overlay-content" onClick={e => e.stopPropagation()}>
                        <h3>Equipment Details</h3>
                        <p><strong>Equipment:</strong> {selectedEquipment.equipment_name}</p>
                        <p><strong>Brand/Model:</strong> {selectedEquipment.brand}</p>
                        <p><strong>Serial Number:</strong> {selectedEquipment.serial_number}</p>
                        <p><strong>Supplier:</strong> {selectedEquipment.supplier}</p>
                        <p><strong>Acquisition Cost:</strong> {selectedEquipment.acquisition_cost}</p>
                        <p><strong>Property Number:</strong> {selectedEquipment.property_number}</p>
                        <p><strong>MR Number:</strong> {selectedEquipment.mr_number}</p>
                        <p><strong>End-user:</strong> {selectedEquipment.end_user}</p>
                        <p><strong>Accountable Officer:</strong> {selectedEquipment.accountable_officer}</p>
                        <p><strong>Location:</strong> {selectedEquipment.location}</p>
                        <p><strong>Remarks:</strong> {selectedEquipment.remarks}</p>
                        <button onClick={handleCloseOverlay}>Close</button>
                    </div>
                </div>
            )}

            {(isEditing || isAdding) && (
                <div className="overlay" onClick={handleCloseOverlay}>
                    <div className="overlay-content" onClick={e => e.stopPropagation()}>
                        <h3>{isAdding ? "Add Equipment" : "Edit Equipment"}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Equipment Name</label>
                            <input type="text" defaultValue={selectedEquipment?.equipment_name || ""} required />
                            <label>Brand/Model</label>
                            <input type="text" defaultValue={selectedEquipment?.brand || ""} required />
                            <label>Serial Number</label>
                            <input type="text" defaultValue={selectedEquipment?.serial_number || ""} required />
                            <label>Supplier</label>
                            <input type="text" defaultValue={selectedEquipment?.supplier || ""} required />
                            <label>Acquisition Cost</label>
                            <input type="number" defaultValue={selectedEquipment?.acquisition_cost || ""} required />
                            <label>Property Number</label>
                            <input type="text" defaultValue={selectedEquipment?.property_number || ""} required />
                            <label>MR Number</label>
                            <input type="text" defaultValue={selectedEquipment?.mr_number || ""} required />
                            <label>End-user</label>
                            <input type="text" defaultValue={selectedEquipment?.end_user || ""} required />
                            <label>Accountable Officer</label>
                            <input type="text" defaultValue={selectedEquipment?.accountable_officer || ""} required />
                            <label>Location</label>
                            <input type="text" defaultValue={selectedEquipment?.location || ""} required />
                            <label>Remarks</label>
                            <input type="text" defaultValue={selectedEquipment?.remarks || ""} />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit">Save</button>
                                <button type="button" className="cancel-btn" onClick={handleCloseOverlay}>Cancel</button>
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