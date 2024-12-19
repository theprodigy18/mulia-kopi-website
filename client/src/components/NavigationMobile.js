import React from 'react';
import Kopi from "../assets/images/kopi-logo.svg";
import NonKopi from "../assets/images/nonkopi-logo.svg";
import Makanan from "../assets/images/makanan-logo.svg";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function NavigationMobile() 
{
    let navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useState(false);
    const [errMessage, setErrMessage] = useState("");
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
                    setLoginStatus(true);
                }
                else
                {
                    localStorage.removeItem("user");
                    setLoginStatus(false);
                }
            })
        }
        else
        {
            setLoginStatus(false);
        }
    }, [apiUrl]);


    const handleScanButton = () =>
    {
        if (loginStatus)
        {
            navigate("/mood-detection");
            setErrMessage("");
        }
        else
        {
            setErrMessage("Login terlebih dahulu untuk mengakses scan mood");
        }
    };

    return (
        <div className='navMobileContainer'>
            {errMessage && (
                <div className='errors'>
                    <p>{errMessage}</p>
                    <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                </div>
            )}
            <div className='scanMood' onClick={handleScanButton}>
                    <p> scan now </p>
            </div>
            <div className='categoryMenuMobile'>
                <div className='categoryBox'>
                    <a href='/menu-mobile/kopi'>
                        <img src={Kopi} alt='logo' />
                    </a>
                    <p> Kopi </p>
                </div>  
                <div className='categoryBox'>
                    <a href='/menu-mobile/non-kopi'>
                        <img src={NonKopi} alt='logo' />
                    </a>
                    <p> Non Kopi </p>
                </div>
                <div className='categoryBox'>
                    <a href='/menu-mobile/makanan'>
                        <img src={Makanan} alt='logo' />
                    </a>
                    <p> Makanan </p>
                </div>
            </div>
        </div>
    )
}

export default NavigationMobile
