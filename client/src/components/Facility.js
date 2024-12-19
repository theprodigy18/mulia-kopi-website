import React from 'react'
import Sholat from "../assets/images/sholat.svg";
import Wifi from "../assets/images/wifi.svg";
import Layanan from "../assets/images/layanan.svg";

function Facility() 
{
    return (
        <div className='facilityContainer'>
            <p> Fasilitas dan layanan yang tersedia <i className="fa-solid fa-arrow-right"></i></p>
            <div className='facility'>
                <div className='facilityBox'>
                    <img src={Sholat} alt='logo' />
                    <div className='oval'>
                        <h1> Mushola </h1>
                        <p> Kami menyediakan mushola untuk penunjang ibadah bagi seorang muslim </p>
                    </div>
                    <p className='facilityLabel'> Fasilitas </p>
                </div>
                <div className='facilityBox'>
                    <img src={Wifi} alt='logo' />
                    <div className='oval'>
                        <h1> Wi-Fi </h1>
                        <p> Kami menyediakan wifi dengan kecepatan 50 mbps yang dapat menunjang segala aktivitas anda </p>
                    </div>
                    <p className='facilityLabel'> Fasilitas </p>
                </div>
                <div className='facilityBox'>
                    <img src={Layanan} alt='logo' />
                    <div className='oval'>
                        <h1> Layanan </h1>
                        <p> Kami menyedia layanan yang senantiasa membantu anda </p>
                    </div>
                    <p className='facilityLabel'> Layanan </p>
                </div>
            </div>
        </div>
    )
}

export default Facility
