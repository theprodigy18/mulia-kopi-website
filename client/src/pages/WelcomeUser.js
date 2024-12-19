import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function WelcomeUser() 
{
    let navigate = useNavigate();
    const [namaPelanggan, setNamaPelanggan] = useState("");
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
                if (!response.data.valid) 
                {
                    setNamaPelanggan("");
                    localStorage.removeItem("user");
                    navigate('/'); // Arahkan ke dashboard
                }
                else
                {
                    setNamaPelanggan(response.data.namaPelanggan);
                }
            })
        }
        else
        {
            navigate('/');
        }
    }, [navigate, apiUrl]);

    return (
        <div className='authContainer'>
            {namaPelanggan && (
                <div className='authBox'>
                        <h1>  Login Berhasil! <br /> Selamat Datang {namaPelanggan}!</h1>
                        <button className='authButton2' onClick={() => navigate("/")}> Masuk ke Halaman </button>
                </div>
            )}
        </div>
    )
}

export default WelcomeUser
