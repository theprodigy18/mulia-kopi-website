import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function MoodDetection() {
    const webcamRef = useRef(null);
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
                    setEmail(response.data.email);
                }
                else
                {
                    localStorage.removeItem("user");
                    navigate("/");
                }
            })
        }
        else
        {
            navigate("/");
        }
    }, [navigate, apiUrl]);

    const captureImage = async () => 
    {
        setLoading(true);
        await delay(1000);
        const imageSrc = webcamRef.current.getScreenshot();
        // console.log(imageSrc); // Check if imageSrc is correctly captured
    
        axios.post(`${apiUrl}mood-detection`, { image: imageSrc }).then((response) =>
        {
            if (response.data.error)
            {
                setErrMessage(response.data.error);
                setLoading(false);
            }
            else
            {
                // console.log(response.data.mood);
                getUniqueCode().then((id) =>
                {
                    axios.post(`${apiUrl}scanMood`, 
                    { 
                        idScan: id,
                        email: email,
                        mood: response.data.mood
                    }).then(() =>
                    {
                        navigate(`/recommendation/${id}`);
                    });
                });

                
            }

        }).catch((error) => 
        {
            console.error("Mood detection error:", error);
            console.log("Error details:", error.response ? error.response.data : "No response data");
            setLoading(false);
        });;
    };
    
    async function generateUniqueCode () 
    {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 3; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    async function getUniqueCode ()  
    {
        let id;
        let isUnique = false;
    
        while (!isUnique) 
        {
            id = await generateUniqueCode();
    
            try {
                const response = await axios.get(`${apiUrl}scanMood/byId/${id}`);
                // Jika respons tidak berisi error, maka kodenya unik
                if (response.data.valid) 
                {
                    isUnique = true;
                }
            } catch (error) 
            {
                // Jika terjadi error saat memeriksa ID, anggap kode ini belum ada dan unik
                isUnique = true;
            }
        }
        
        return id;
    }


    return (
        <div className='moodDetectionContainer'>
            {loading && (
                <div className='successModal'>
                    <div className='loading'></div>
                </div>
            )}
            {errMessage && (
                <div className='errors'>
                    <p>{errMessage}</p>
                    <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                </div>
            )}
            <Header />
            <div className='scanBox'>
                <p> Scan Mood mu Sekarang </p>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                    height={300}
                    className='webcam'
                />
                <button onClick={captureImage}>Scan Mood</button>
            </div>
        </div>
    );
}

export default MoodDetection;
