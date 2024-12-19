import React, { useEffect, useState } from 'react'
import Person from "../assets/images/person-mood.svg";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Highlight() 
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
        <div className='highlightContainer'>
            {errMessage && (
                <div className='errors'>
                    <p>{errMessage}</p>
                    <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                </div>
            )}
            <div className='personMood'>
                <div>
                    <img src={Person} alt='person' />
                    <div className='moodDetail'>
                        <p className='title'> Bagaimana mood mu hari ini? </p>
                        <p> Dapatkan rekomendasi menu yang cocok sesuai dengan mood mu </p>
                    </div>
                </div>
            </div>
            <div className='cekMood'>
                <h1> Cek mood yuk </h1>
                <p> Kami dapat membantu anda untuk memilih menu apa yang tepat buat mngembalikan mood anda </p>
                <div onClick={handleScanButton} className='scanMood'>
                    <p> scan now </p>
                </div>
            </div>
        </div>
    )
}

export default Highlight
