import React from 'react'
import Logo from "../assets/images/logo_mulia_kopi.png";

function AboutUs() 
{
    return (
        <div className='aboutContainer' id='aboutUs'>
            <h1> Tentang kami </h1>
            <div className='aboutUs'>
                <div className='leftAbout'>
                    <p> Mulia kopi adalah cofee shop yang bertemakan sub tropis dengan tempat yang menyajikan pemandangan alam yang memanjakan mata. </p>
                    <p> Tempat yang strategis untuk menikmati kopi dengan berbagai varian dan tempat yang cocok untuk kaum mahasiswa yang membutuhkan tempat mengerjakan tugas maupun rapat semi formal. </p>

                    <a href='/'>
                        <p> selengkapnya </p>
                    </a>
                </div>
                <div className='rightAbout'>
                    <img src={Logo} alt='logo' />
                </div>
            </div>
        </div>
    )
}

export default AboutUs
