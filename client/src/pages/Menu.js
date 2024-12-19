import React from 'react';
import HeaderMenu from '../components/HeaderMenu';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuSection from '../components/MenuSection';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Menu() 
{
    const navigate = useNavigate();

    useEffect(() => {
        // Memeriksa apakah layar lebih kecil dari 768px (mobile)
        if (window.innerWidth < 431) 
        {
            navigate('/'); // Mengarahkan ke halaman lain
        }
    }, [navigate]);

    return (
        <div>
            <Header />
            <HeaderMenu />
            <MenuSection />
            <Footer />
        </div>
    )
}

export default Menu
