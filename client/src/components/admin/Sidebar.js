import React from 'react'
import { useNavigate } from 'react-router-dom'

function Sidebar() 
{
    let navigate = useNavigate();

    const handleLogout = () =>
    {
        localStorage.removeItem("token");
        window.location.reload();
    }

    return (
        <div className='sidebar'>
            <div className='adminMenu'>
                <p onClick={() => navigate("/admin/kasir")}> Kasir </p>
                <p onClick={() => navigate("/admin/po")}> Pesanan Online</p>
                <p onClick={() => navigate("/admin/riwayat")}> Riwayat Transaksi </p>
                <p onClick={() => navigate("/admin/laporan-harian")}> Laporan Harian </p>
                <p onClick={() => navigate("/admin/kelola-menu")}> Kelola Menu </p>
                <p onClick={handleLogout} className='logout'> Logout {'>>'} </p>
            </div>
            <p className='adminCopyright'> &copy; 2024 Mulia Kopi, Inc. <br /> All Right Reserved. </p>
        </div>
    )
}

export default Sidebar
