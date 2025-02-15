import React, { useState, useEffect } from 'react';
import '../../css/dashboard/Table.css';  // Assuming you have the same styling for tables

// Function to fetch equipment data
const fetchEquipments = async (setEquipments) => {
    try {
        const response = await fetch('http://localhost:5000/api/equipments');
        const data = await response.json();

        console.log('Fetched data:', data);

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

    useEffect(() => {
        fetchEquipments(setEquipments);
    }, []);  

    return (
        <div>
            <div className="table-container">
                <h3>Equipment List</h3>
                <table className="equipment-table">
                    <thead>
                        <tr>
                            <th>Equipment ID</th>
                            <th>Equipment Name</th>
                            <th>Quantity</th>
                            <th>Location</th>
                            <th>Staff Incharge</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipments.length > 0 ? (
                            equipments.map(equipment => (
                                <tr key={equipment.equipment_id}>
                                    <td>{equipment.equipment_id}</td>
                                    <td>{equipment.equipment_name}</td>
                                    <td>{equipment.quantity}</td>
                                    <td>{equipment.location}</td>
                                    <td>{equipment.staff_name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No equipment found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Equipments;
