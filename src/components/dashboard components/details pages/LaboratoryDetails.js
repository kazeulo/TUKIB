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
    const [filteredEquipments, setFilteredEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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

    return (
        <div className='laboratory-details'>
            <button className='back-button' onClick={() => navigate(-1)}>
                <IoChevronBack size={16} />
                Back to Laboratories
            </button>

            <h3>{laboratory ? laboratory.laboratory_name : "Laboratory Details"}</h3>

            <h3 className="equipments-title">
                <IoCalendarOutline className="equipment-icon" />
                Schedules
            </h3>

            <EventCalendar />

            <h3 className="equipments-title">
            <IoFlaskOutline className="euipment-icon" />
                Laboratory Equipments
            </h3>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='laboratory-details'>
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
            )}
        </div>
    );
};

export default LaboratoryDetails;