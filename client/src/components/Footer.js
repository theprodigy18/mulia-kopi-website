import React from 'react';
import Maps from "../assets/images/maps.svg"; 
import Icon from "../assets/images/icon_map.svg";
import axios from "axios";
import { useEffect, useState } from 'react';

function Footer() 
{
    const [listOfSchedule, setListOfSchedule] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    // useEffect(() =>
    // {
    //     axios.get(`${apiUrl}waktuBuka`).then((response) =>
    //     {
    //         setListOfSchedule(response.data);
    //     });
    // }, [apiUrl]);

    return (
        <div className='footer' id='footer'>
            <div className="locationSection">
                <h2> Lokasi Kami <img src={Icon} alt='icon' /></h2>
                <a className="mapContainer" href='https://maps.app.goo.gl/AvgkF7ZZVkx9hLNL9'>
                    <img src={Maps} alt="Lokasi pada peta" />
                </a>
                <div className="socialLinks">
                    
                    <a href="https://www.instagram.com/kopimuliaa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="socialIcon"><i className="fab fa-instagram"></i></a>
                    <a href="/" className="socialIcon"><i className="fab fa-whatsapp"></i></a>
                </div>
            </div>
            <div className='scheduleSection'>
                {/* <h2> Waktu Buka <i className="fas fa-clock"></i> </h2>
                <div className='scheduleList'>
                    {listOfSchedule.map((value, key) => 
                    {
                        const buka = value.waktuBuka.slice(0, 5).replace(":", ".");
                        const tutup = value.waktuTutup.slice(0, 5).replace(":", ".");

                        const schedule = `${buka} - ${tutup}`;

                        return (
                            <div className="scheduleItem" key={key}>
                                <span> {value.hari} </span>
                                <span> {schedule} </span>
                            </div>
                        );
                    })}
                </div> */}
                <h2> Under Maintenance </h2>
            </div>
            <div className='copyright'>
                &copy; 2024 Mulia Kopi, Inc. All Right Reserved. 
            </div>
        </div>
    )
}

export default Footer
