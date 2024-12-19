import React from 'react'
import LoginAccess from '../components/auth/LoginAccess';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { useState } from 'react';
import axios from 'axios';

function LupaPassword() 
{
    const apiUrl = process.env.REACT_APP_API_URL;
    const [errMessage, setErrMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const navigate = useNavigate();

    const initialValues =
    {
        email: ""
    };

    const validationSchema = Yup.object().shape(
        {
            email: Yup.string().email('*Invalid email format').required('*Required')
        });

    const onSubmit = async (data) => {
        setLoading(true);
        await delay(1000);

        await axios.post(`${apiUrl}auth/lupaPassword`, { email: data.email}).then((response) =>
        {
            if (response.data.error)
            {
                setErrMessage(response.data.error);
                setLoading(false);
            }
            else
            {
                setSuccess(response.data.message);
                setLoading(false);
            }
        });
        
    };

    const openGmail = () => {
        setSuccess("");
        window.open("https://mail.google.com/", "_blank");
    };

    return (
        <div className='authContainer'>
            {loading && (
                <div className='successModal'>
                    <div className='loading'></div>
                </div>
            )}
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
                    <h1> Lupa Password </h1>
                    <ErrorMessage name='email' component="span" className='errMessage' />
                    <Field
                        className="authField"
                        name="email"
                        placeholder="email"
                    />
                    <div className='linksBox'>
                        <p></p>
                        <a href='/login'> Sudah punya akun? Masuk </a>
                    </div>

                    <button type='submit' className='authButton'> Kirim Verifikasi </button>
                    <a href='/'> Lanjut tanpa login </a>
                </Form>
            </Formik>
            <LoginAccess />
        </div>
    )
}

export default LupaPassword
