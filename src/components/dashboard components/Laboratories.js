import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard components/Laboratories.css';

const fetchLaboratories = async (setLaboratories) => {
    try {
        const response = await fetch('http://localhost:5000/api/laboratory');
        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.laboratories)) {
            setLaboratories(data.laboratories);
        } else {
            console.error('Fetched data is not an array:', data);
        }
    } catch (error) {
        console.error('Error fetching laboratories:', error);
    }
};

const Laboratories = () => {
    const [laboratories, setLaboratories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLaboratories(setLaboratories);
    }, []);

    return (
        <div className="laboratory-card-container">
            <h2>Laboratories</h2>
            <div className="card-grid">
                {laboratories.map((lab) => (
                    <div
                        key={lab.laboratory_id}
                        className="lab-card"
                        onClick={() => navigate(`/laboratory/${lab.laboratory_id}`)}
                    >
                        <h3>{lab.laboratory_name}</h3>
                        <p>Click to view details</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Laboratories;