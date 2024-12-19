import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { useState } from 'react';
import LoginAccess from '../components/auth/LoginAccess';

function Register() 
{
    const [errMessage, setErrMessage] = useState("");
    const [success, setSuccess] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;

    const initialValues = 
    {
        namaPelanggan: "",
        email: "",
        password: "",
        confirmPassword: ""
    };

    const validationSchema = Yup.object().shape(
    {
        namaPelanggan: Yup.string().min(3, '*Must be at least 3 characters').required('*Required'),
        email: Yup.string().email('Invalid email format').required('*Required'),
        password: Yup.string().min(8, '*Must be at least 8 characters').max(20, '*Must be 20 characters or less').required('*Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], '*Passwords must match')
            .required('*Required')
    });


    const onSubmit = (data) =>
    {
        axios.post(`${apiUrl}auth`, data).then((response) =>
        {
            if (response.data.error)
            {
                setSuccess("");
                setErrMessage(response.data.error);
            }
            else
            {
                setErrMessage("");
                setSuccess(response.data.message);
            }
        }).catch(error => console.error("Error:", error));
    };

    const openGmail = () =>
    {
        setSuccess("");
        window.open("https://mail.google.com/", "_blank");
    };

    return (
        <div className='authContainer'>
            {success && (
                <div className='successModal'>
                    <div className='successBox'>
                        <p>{success}</p>
                        <button onClick={openGmail}> Check Email </button>
                    </div>
                </div>
            )}
            <Formik 
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                <Form className='authBox'>
                    {errMessage && (
                        <div className='errors'>
                            <p>{errMessage}</p>
                            <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                        </div>
                    )}
                    <h1> Register </h1>
                    <ErrorMessage name='namaPelanggan' component="span" className='errMessage' />
                    <Field 
                        className="authField" 
                        name="namaPelanggan" 
                        placeholder="username" 
                    /> 
                    <ErrorMessage name='email' component="span" className='errMessage' />
                    <Field 
                        className="authField" 
                        name="email" 
                        placeholder="email" 
                    /> 
                    <ErrorMessage name='password' component="span" className='errMessage' />
                    <Field 
                        className="authField" 
                        name="password" 
                        placeholder="password" 
                        type="password"
                    /> 
                    <ErrorMessage name='confirmPassword' component="span" className='errMessage' />
                    <Field 
                        className="authField"
                        name="confirmPassword" 
                        placeholder="confirm password" 
                        type="password"
                    /> 
                    <div className='linksBox'>
                        <p></p>
                        <a href='/login'> Sudah punya akun? Masuk </a>
                    </div>

                    <button type='submit' className='authButton'> Register </button>
                    <a href='/'> Lanjut tanpa login </a>
                </Form>
            </Formik>
            <LoginAccess />
        </div>
    )
}

export default Register
