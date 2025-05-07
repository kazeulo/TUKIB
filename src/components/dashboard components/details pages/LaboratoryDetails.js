import React, { useEffect, useState } from 'react';
import { IoChevronBack, IoCalendarOutline, IoFlaskOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../css/dashboard components/Laboratories.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EventCalendar from '../../partials/EventCalendar';

const LaboratoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [equipments, setEquipments] = useState([]);
    const [laboratory, setLaboratory] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [filteredEquipments, setFilteredEquipments] = useState([]);
    const [equipmentToDelete, setEquipmentToDelete] = useState(null);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [labs, setLabs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

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

    const fetchEquipments = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/equipments/lab/${id}`);
            if (response.data.status === "success") {
                setEquipments(response.data.equipments);
                setFilteredEquipments(response.data.equipments);
            }
        } catch (error) {
            console.error('Error fetching equipments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLaboratory = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/laboratory/${id}`);
            if (response.data.status === "success") {
                setLaboratory(response.data.laboratory);
                console.log(laboratory)
            }
        } catch (error) {
            console.error('Error fetching laboratory:', error);
        }
    };

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
        fetchLaboratory();
    }, [id]);
    

    useEffect(() => {
        fetchEquipments();
    }, [id]);

    useEffect(() => {
        const filtered = equipments.filter(equipment =>
            Object.values(equipment)
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
        setFilteredEquipments(filtered);
    }, [searchTerm, equipments]);

    const handleDelete = async (equipment, e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete ${equipment.equipment_name}?`)) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/equipments/${equipment.equipment_id}`);
                if (response.data.status === 'success') {
                    setEquipments(prev => prev.filter(item => item.equipment_id !== equipment.equipment_id));
                    alert('Equipment deleted successfully');
                }
            } catch (error) {
                console.error('Error deleting equipment:', error);
                alert('Failed to delete equipment');
            }
        }
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
    
        const requestData = {
            equipment_name: formData.equipment_name,
            brand: formData.brand,
            model: formData.model,
            serial_number: formData.serial_number,
            quantity: formData.quantity,
            staff_name: formData.staff_name,
            laboratory_id: laboratory.laboratory_id,
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
        <div className='laboratory-details'>
            <button className='back-button' onClick={() => navigate(-1)}>
                <IoChevronBack size={16} />
                Back to Laboratories
            </button>

            <div>
                <h3>{laboratory ? laboratory.laboratory_name : "Laboratory Details"}</h3>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h3 className="equipments-title">
                        <IoCalendarOutline className="equipment-icon" />
                        Schedules
                    </h3>

                    <div className='calendar-wrapper'>
                        <EventCalendar />
                    </div>

                    <div className='equipment-section-wrapper'>
                        <div>
                            <h3 className="equipments-title">
                                <IoFlaskOutline className="euipment-icon" />
                                Laboratory Equipments
                            </h3>

                            <button className="add-btn" onClick={handleAddClick}>
                                Add Equipment
                            </button>
                        </div>

                        <table className="equipment-table">
                            <thead>
                                <tr>
                                    {/* <th>Equipment ID</th> */}
                                    <th>Equipment Name</th>
                                    <th>Quantity</th>
                                    <th>Staff Incharge</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEquipments.length > 0 ? (
                                    filteredEquipments.map(equipment => (
                                        <tr key={equipment.equipment_id}>
                                            {/* <td>{equipment.equipment_id}</td> */}
                                            <td>{equipment.equipment_name}</td>
                                            <td>{equipment.quantity}</td>
                                            <td>{equipment.staff_name}</td>
                                            <td>
                                                <button className="edit-btn" title="Edit disabled here" disabled>
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
                                        <td colSpan="5" style={{ textAlign: 'center' }}>
                                            {searchTerm ? 'No matching equipment found' : 'No equipment available'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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

export default LaboratoryDetails;