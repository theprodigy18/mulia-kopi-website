import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function GantiPassword() 
{
    const { email, token } = useParams();
    const [errMessage, setErrMessage] = useState("");
    const [errMessageVerify, setErrMessageVerify] = useState("");
    const [successVerify, setSuccessVerify] = useState(false);
    const [success, setSuccess] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        axios.get(`${apiUrl}auth/verify/lupaPassword/${email}/${token}`).then((response) => {
            if (response.data.error) {
                setSuccessVerify("");
                setErrMessageVerify(response.data.error);
            }
            else {
                setErrMessageVerify("");
                setSuccessVerify(true);
            }
        })
    }, [apiUrl, email, token]);

    const initialValues =
    {
        password : "",
        confirmPassword : ""
    };

    const validationSchema = Yup.object().shape(
    {
            password: Yup.string().min(8, '*Must be at least 8 characters').max(20, '*Must be 20 characters or less').required('*Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], '*Passwords must match')
                .required('*Required')
    });

    const onSubmit = async (data) =>
    {
        setLoading(true);
        await delay(1000);

        const change = await axios.post(`${apiUrl}auth/changePassword`, 
        {
            email: email,
            password: data.password
        })

        if (change.data.error)
        {
            setErrMessage(change.data.error);
            setLoading(false);
        }
        else
        {
            setSuccess(change.data.message);
            setLoading(false);
        }
    }
    
    

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
                        <button onClick={() => navigate("/login")}> Login </button>
                    </div>
                </div>
            )}
            {successVerify && (
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
                        <h1> Ganti Password </h1>
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

                        <button type='submit' className='authButton'> Ganti Password </button>
                    </Form>
                </Formik>
            )}
            {errMessageVerify && (
                <div className='authBox'>
                    <p> {errMessageVerify} </p>
                    <button className='authButton2' onClick={() => navigate("/")}> Home </button>
                </div>
            )}
        </div>
    )
}

export default GantiPassword
