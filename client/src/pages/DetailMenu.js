import React from 'react';
import MenuDescription from '../components/MenuDescription';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect } from 'react';

function DetailMenu() 
{
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <Header />
            <MenuDescription />
            <Footer />
        </div>
    )
}

export default DetailMenu
