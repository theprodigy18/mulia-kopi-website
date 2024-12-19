import React, { useEffect, useState } from 'react'
import AdminHeader from '../../components/admin/AdminHeader'
import Sidebar from '../../components/admin/Sidebar'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function DetailMenuAdmin() {
    const publicUrl = process.env.PUBLIC_URL + '/images/menu/';
    let idMenu = useParams().idMenu;
    const apiUrl = process.env.REACT_APP_API_URL;
    const [menu, setMenu] = useState({});

    useEffect(() => {
        axios.get(`${apiUrl}daftarMenu/byId/${idMenu}`).then((response) => {
            setMenu(response.data);
        });
    }, [idMenu, apiUrl])

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    return (
        <div>
            <AdminHeader />
            <Sidebar />
            <div className='detailMenuAdminContainer'>
                <h1> Detail Menu </h1>
                <img src={publicUrl + menu.gambar} alt='menu' />
                <div className='detailMenuDescription'>
                    <h1> {menu.namaMenu} </h1>
                    <p> {menu.detailMenu} </p>
                </div>
                <p> {formatRupiah(menu.harga)} </p>
                <div className='stok'>
                    <h1> Stok </h1>
                    <p> {menu.stok} </p>
                </div>
            </div>
        </div>
    )
}

export default DetailMenuAdmin
