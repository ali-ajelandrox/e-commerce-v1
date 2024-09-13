import React, { useState } from 'react';
import axios from 'axios';
import { categoriesMap } from '../components/categories'; // Asegúrate de usar la ruta correcta
import '../styles/login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer',
        companyName: '',
        industry: '',
        country: '',
        commonInterest: [],
    });

    const handleChange = (e) => {
        const { name, value, selectedOptions } = e.target;
        if (name === 'commonInterest') {
            const selectedValues = Array.from(selectedOptions).map(option => option.value);
            setFormData({ ...formData, [name]: selectedValues });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert('Registration successful');
        } catch (error) {
            alert('Error registering');
        }
    };

    return (
        <div className="login-master">
            <div className="login-container">
                <h2>Register</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="login-input"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="login-input"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="login-input"
                        required
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="login-input"
                    >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>

                    {formData.role === 'seller' && (
                        <>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Company Name"
                                className="login-input"
                                required
                            />
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                placeholder="Industry"
                                className="login-input"
                                required
                            />
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                                className="login-input"
                                required
                            />
                        </>
                    )}

                    {formData.role === 'buyer' && (
                        <select
                            name="commonInterest"
                            multiple
                            value={formData.commonInterest}
                            onChange={handleChange}
                            className="login-input"
                            required
                        >
                            <option value="" disabled>Selecciona una categoría</option>
                            {Object.keys(categoriesMap).map(category => (
                                <option key={category} value={category}>
                                    {categoriesMap[category]}
                                </option>
                            ))}
                        </select>
                    )}

                    <button type="submit" className="login-button">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;