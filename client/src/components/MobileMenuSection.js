import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cart from "../assets/images/shopping-cart.svg";
import { useContext } from 'react';
import { RefreshUseEffectContext } from './RefreshUseEffect';

function MobileMenuSection() 
{
    let category = useParams().category;
    let navigate = useNavigate();
    const publicLink = process.env.PUBLIC_URL;
    const [listOfMenu, setListOfMenu] = useState([]);
    const textCategory = category.replace("-", " ");
    const [email, setEmail] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const { setRefreshKey } = useContext(RefreshUseEffectContext);
    const [isBuying, setIsBuying] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() =>
    {
        axios.get(`${apiUrl}daftarMenu/${category}`).then((response) =>
        {

            setListOfMenu(response.data);
        });

        const token = localStorage.getItem('user');
        if (token) 
        {
            // Memverifikasi token di server
            axios.get(`${apiUrl}auth/verify-token`, 
            {
                headers: {
                    Authorization: token // Kirim token dalam header
                }
            }).then(async(response) => 
            {
                if (response.data.valid) 
                {
                    setEmail(response.data.email);

                    const pesanan = await axios.get(`${apiUrl}daftarPesanan/byEmail/${response.data.email}`);

                    if (pesanan.data.buying)
                    {
                        setIsBuying(true);
                    }
                    else
                    {
                        setIsBuying(false);
                    }
                }
                else
                {
                    setEmail("");
                }
            })
        }
        else
        {
            setEmail("");
        }
    }, [category, apiUrl]);

    const capitalizeWords = (str) => 
    {
        if (!str) return "";
        return str
            .split(" ") // Memisahkan string menjadi array kata-kata
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Mengubah huruf pertama tiap kata menjadi besar
            .join(" "); // Menggabungkan kembali menjadi string
    };

    function formatNumber(num) {
        if (num >= 1_000_000) {
            // Jika angkanya lebih besar atau sama dengan 1 juta, tambahkan 'M' (misalnya, 1.5M)
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (num >= 1_000) {
            // Jika angkanya lebih besar atau sama dengan 1 ribu, tambahkan 'k' (misalnya, 6.5k)
            return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
        } else {
            // Jika kurang dari 1 ribu, kembalikan angka asli
            return num.toString();
        }
    }
    
    const handleBeliSekarang = (idMenu) =>
    {
        if (!email)
            return setErrMessage("Login terlebih dahulu untuk membeli lewat sistem");

        if (isBuying)
            return setErrMessage("Anda sedang membeli, silahkan selesaikan transaksi terlebih dahulu.");
        
        axios.post(`${apiUrl}keranjang`, { email: email, idMenu: idMenu, jumlah: 1 }).then((response) =>
        {
            console.log(response.data);
            setRefreshKey(prevKey => prevKey + 1);
        });
    };

    return (
        <div className='mobileMenuContainer'>
            {errMessage && (
                <div className='errors'>
                    <p>{errMessage}</p>
                    <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                </div>
            )}
            <img src={publicLink + "/images/" + category + "-header.jpg"} alt='header' />
            <div className='secondBodyMenu'>
                <p> {capitalizeWords(textCategory)} </p>
                <div className='menuBoard'>
                    {listOfMenu.map((menu, key) =>
                    {
                        return (
                            <div className='mobileMenuBox' key={key}>
                                <img src={publicLink + "/images/menu/" + menu.gambar} alt='menu' onClick={() => navigate(`/detail-menu/${menu.idMenu}`)} />
                                <p> {menu.namaMenu} </p>
                                <div className='mobileMenuPricing'>
                                    <p> {formatNumber(menu.harga)} </p>
                                    <img src={Cart} alt='cart' onClick={() => handleBeliSekarang(menu.idMenu)} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default MobileMenuSection
