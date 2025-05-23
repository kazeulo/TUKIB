import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/dashboard components/Laboratories.css';
import '../../css/dashboard components/Equipments.css'; //please dont remove hehe, css for the equipments table and somethings from dashboard is here

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
        <div className="table-container">
            <div className="table-header">
                <h2>Laboratories</h2>
            </div>

            <div className="card-grid">
                {laboratories.map((lab) => (
                    <div
                        key={lab.laboratory_id}
                        className="lab-card"
                        onClick={() => navigate(`/laboratoryDetails/${lab.laboratory_id}`)}
                    >
                        <h4>{lab.laboratory_name}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Laboratories;