import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/ServiceRequestForm.css';

const UseOfEquipmentForm = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        equipmentType: '',
        dateOfUse: '',
        duration: '',
        purpose: '',
        projectBudgetCode: '',
        modeOfPayment: '',
        necessaryDocuments: null,
        acknowledgeTerms: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, necessaryDocuments: e.target.files[0] }));
    };

    const handleCheckboxChange = (e) => {
        setFormData((prev) => ({ ...prev, acknowledgeTerms: e.target.checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Use of Equipment Form Data:', formData);
    };

    const handleCancel = () => {
        navigate('/clientProfile');
    };

    return (
        <div className='service-request-form'>
            <div className='form-title'><h3>Use of Equipment Request Form</h3></div>
            <form className='service-request-form-contents' onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Equipment Type</label>
                    <input type='text' name='equipmentType' value={formData.equipmentType} onChange={handleInputChange} />
                </div>
                <div className='form-group'>
                    <label>Date of Use</label>
                    <input type='date' name='dateOfUse' value={formData.dateOfUse} onChange={handleInputChange} />
                </div>
                <div className='form-group'>
                    <label>Duration (in hours)</label>
                    <input type='number' name='duration' value={formData.duration} onChange={handleInputChange} />
                </div>
                <div className='form-group'>
                    <label>Purpose</label>
                    <textarea name='purpose' value={formData.purpose} onChange={handleInputChange} />
                </div>
                <div className='form-group'>
                    <label>Upload Necessary Documents</label>
                    <input type='file' name='necessaryDocuments' onChange={handleFileChange} />
                </div>
                <div className='form-group'>
                    <label className='checkbox-label'>
                        <input type='checkbox' checked={formData.acknowledgeTerms} onChange={handleCheckboxChange} />
                        I acknowledge that I have read and understood the terms and conditions.
                    </label>
                </div>
                <div className='form-actions'>
                    <button type='button' className='cancel-btn' onClick={handleCancel}>Cancel</button>
                    <button type='submit' className='submit-btn'>Submit Request</button>
                </div>
            </form>
        </div>
    );
};

export default UseOfEquipmentForm;