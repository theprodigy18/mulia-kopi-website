import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { useEffect } from 'react';

function LoginAdmin() 
{
    let navigate = useNavigate();
    const [errMessage, setErrMessage] = useState("");
    const [success, setSuccess] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;

    const initialValues = 
    {
        username: "",
        password: ""
    };

    const validationSchema = Yup.object().shape(
    {
        username: Yup.string().required("*Required"),
        password: Yup.string().required("*Required")
    });

    useEffect(() => 
    {
        const token = localStorage.getItem('token');
        if (token) 
        {
            // Memverifikasi token di server
            axios.get(`${apiUrl}admin/verify-token`, 
            {
                headers: {
                    Authorization: token // Kirim token dalam header
                }
            }).then((response) => 
            {
                // Jika token valid, arahkan ke dashboard
                if (response.data.valid) 
                {
                    navigate('/admin/kasir'); // Arahkan ke dashboard
                }
                else
                {
                    localStorage.removeItem("token");
                }
            })
        }
    }, [navigate, apiUrl]);

    const onSubmit = (data) =>
    {
        axios.post(`${apiUrl}admin/login`, data).then((response) =>
        {
            if (response.data.token) 
            {
                setErrMessage("");
                setSuccess("Login berhasil");
                localStorage.setItem("token", response.data.token);
            }
            else
            {
                setSuccess("");
                setErrMessage(response.data.message);
            }
        });
    };

    return (
        <div className='loginAdminContainer'>
            {success && (
                <div className='successModal'>
                    <div className='successBox'>
                        <p>{success}</p>
                        <button onClick={() => navigate("/admin/kasir")}> Go To Page </button>
                    </div>
                </div>
            )}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                <Form className='adminForm'>
                    {errMessage && (
                        <div className='errors'>
                            <p>{errMessage}</p>
                            <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                        </div>
                    )}
                    <h1> Welcome </h1>
                    <ErrorMessage name='username' component="span" className='errMessage' />
                    <Field 
                        className="adminInput" 
                        name="username" 
                        placeholder="username" 
                    /> 
                    <ErrorMessage name='password' component="span" className='errMessage' />
                    <Field 
                        className="adminInput" 
                        name="password" 
                        placeholder="password" 
                        type="password"
                    /> 
                    <button type='submit'> Login </button>
                    
                </Form>
            </Formik>

        </div>
    )
}

export default LoginAdmin
