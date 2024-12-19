import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

function LoginAccess() 
{
    let navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() =>
    {
        const token = localStorage.getItem('user');
        if (token) 
        {
            // Memverifikasi token di server
            axios.get(`${apiUrl}auth/verify-token`, 
            {
                headers: {
                    Authorization: token // Kirim token dalam header
                }
            }).then((response) => 
            {
                if (response.data.valid) 
                {
                    navigate('/'); // Arahkan ke dashboard
                }
                else
                {
                    localStorage.removeItem("user");
                }
            })
        }
    }, [navigate, apiUrl]);
    return (
        <div>

        </div>
    )
}

export default LoginAccess
