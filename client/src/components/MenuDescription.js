import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { RefreshUseEffectContext } from './RefreshUseEffect';

function MenuDescription() 
{
    const Gambar = process.env.PUBLIC_URL + '/images/menu/';
    let idMenu = useParams().idMenu;
    const [menu, setMenu] = useState({});
    const [email, setEmail] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const { setRefreshKey } = useContext(RefreshUseEffectContext);
    const [isBuying, setIsBuying] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() =>
    {
        axios.get(`${apiUrl}daftarMenu/byId/${idMenu}`).then((response) =>
        {
            setMenu(response.data);
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
            }).then(async (response) => 
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

    }, [idMenu, apiUrl]);

    const formatRupiah = (number) =>
    {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    const handleBeliSekarang = () =>
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
        <div className='menuDescriptionContainer'>
            {errMessage && (
                <div className='errors'>
                    <p>{errMessage}</p>
                    <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                </div>
            )}
            <h1> {menu.namaMenu} </h1>
            <img src={Gambar + menu.gambar} alt='menu' />
            <div className='descriptionContainer'>
                <p> {menu.detailMenu} </p>
                <p className='menuPrice'> {formatRupiah(menu.harga)} </p>
                <button onClick={handleBeliSekarang}> Tambah ke Keranjang </button>
            </div>
        </div>
    )
}

export default MenuDescription
