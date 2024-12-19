import React from 'react'
import { useState, useRef, useEffect } from 'react';
import Info from "../assets/images/Group 42.png";

function Infotainment() 
{
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        document.body.style.userSelect = 'none';
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = 'auto';
        updateActiveIndex();
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        document.body.style.userSelect = 'auto';
        updateActiveIndex();
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX);
        scrollRef.current.scrollLeft = scrollLeft - walk;
        updateActiveIndex();
    };

    const updateActiveIndex = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollPosition = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            // Jika di posisi paling kiri
            if (scrollPosition === 0) {
                setActiveIndex(0);
                return;
            }
            
            // Jika di posisi paling kanan
            if (Math.abs(scrollPosition - maxScroll) < 5) { // toleransi 5px
                setActiveIndex(3); // sesuaikan dengan jumlah box - 1
                return;
            }
            
            // Posisi di tengah
            const boxWidth = 730; // lebar box + gap
            const index = Math.round(scrollPosition / boxWidth);
            setActiveIndex(index);
        }
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', updateActiveIndex);
        }
        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', updateActiveIndex);
            }
        };
    }, []);


    return (
        <div className='infotainmentContainer'>
            <p> Apa yang baru hari ini <i className="fa-solid fa-arrow-right"></i></p>
            <div 
                className='infotainment'
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}   
            >
                <img className='infoBox' src={Info} alt='gambar' draggable="false" />
                <img className='infoBox' src={Info} alt='gambar' draggable="false" />
                <img className='infoBox' src={Info} alt='gambar' draggable="false" />
                <img className='infoBox' src={Info} alt='gambar' draggable="false" />
            </div>
            <div className="scroll-dots">
                <span className={`dot ${activeIndex === 0 ? 'active' : ''}`}></span>
                <span className={`dot ${activeIndex === 1 ? 'active' : ''}`}></span>
                <span className={`dot ${activeIndex === 2 ? 'active' : ''}`}></span>
                <span className={`dot ${activeIndex === 3 ? 'active' : ''}`}></span>
            </div>
        </div>
    );
};

export default Infotainment
