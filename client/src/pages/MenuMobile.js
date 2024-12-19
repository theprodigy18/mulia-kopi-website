import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import MobileMenuSection from '../components/MobileMenuSection';

function MenuMobile() 
{
    const navigate = useNavigate();

    useEffect(() => {
        // Memeriksa apakah layar lebih kecil dari 768px (mobile)
        if (window.innerWidth > 430) {
            navigate('/menu'); // Mengarahkan ke halaman lain
        }
        else
        {
            return;
        }
    }, [navigate]);

    return (
        <div>
            <Header />
            <MobileMenuSection />
            <Footer />
        </div>
    )
}

export default MenuMobile
