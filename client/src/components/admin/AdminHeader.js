import React, { useEffect, useState } from 'react'
import User from "../../assets/images/User.svg";
import Logo from "../../assets/images/logo_mulia_kopi.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminHeader() 
{
    let navigate = useNavigate();
    const [namaAdmin, setNamaAdmin] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;

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
                if (!response.data.valid) 
                {
                    navigate('/admin/login'); // Arahkan ke dashboard
                }
                else
                {
                    setNamaAdmin(response.data.namaAdmin);
                }
            })
        }
        else
        {
            navigate('/admin/login');
        }
    }, [navigate, apiUrl]);

    return (
        <div className='adminHeader'>
            <div className='adminProfile'>
                <img src={User} alt='admin' />
                <p> {namaAdmin} </p>
            </div>
            <img src={Logo} alt='logo' onClick={() => navigate("/admin/kasir")} />
        </div>
    )
}

export default AdminHeader
