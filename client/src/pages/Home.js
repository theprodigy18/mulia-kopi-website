import React from 'react'
import Header from "../components/Header";
import Highlight from '../components/Highlight';
import AboutUs from '../components/AboutUs';
import Infotainment from '../components/Infotainment';
import Facility from '../components/Facility';
import Footer from '../components/Footer';
import NavigationMobile from '../components/NavigationMobile';

function Home() 
{
    return (
        <div className='homeBody'>
            <Header />
            <Highlight />
            <div className='secondBody'>
                <NavigationMobile />
                <AboutUs />
                <Infotainment />
                <Facility />
            </div>
            <Footer />
        </div>
    )
}

export default Home
