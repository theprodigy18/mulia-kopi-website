import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { RefreshUseEffectContext } from '../RefreshUseEffect';

function KelolaMenuSection() {
    const publicUrl = process.env.PUBLIC_URL + "/images/menu/";
    let navigate = useNavigate();
    const [listOfMenu, setListOfMenu] = useState([]);
    const [choosenMenu, setChoosenMenu] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [alertDelete, setAlertDelete] = useState(false);
    const { refreshKey, setRefreshKey } = useContext(RefreshUseEffectContext);
    const [loading, setLoading] = useState(false);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const [deleteMessage, setDeleteMessage] = useState("");

    useEffect(() => {
        axios.get(`${apiUrl}daftarMenu`).then((response) => {
            setListOfMenu(response.data);
        });
    }, [apiUrl, refreshKey]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    const handleChoosenIdMenu = (menu) => {
        if (choosenMenu === menu)
            return setChoosenMenu(null);

        return setChoosenMenu(menu);
    }

    const deleteMenu = async () => 
    {
        setLoading(true);
        setAlertDelete(false);
        await delay(1000);

        axios.post(`${apiUrl}daftarMenu/delete/${choosenMenu.idMenu}`).then((response) => 
        {
            if (response.data.success) 
            {
                setLoading(false);
                setDeleteMessage("Menu berhasil dihapus");
                setRefreshKey(prevKey => prevKey + 1);
            }
            else
            {
                setLoading(false);
                setDeleteMessage("Menu gagal dihapus");
                setRefreshKey(prevKey => prevKey + 1);
            }
        })
    }

    return (
        <div className='kelolaMenuContainer'>
            {loading && (
                <div className='successModal'>
                    <div className='loading'></div>
                </div>
            )}
            <div className='sortingCategory'>
                <h1> Kelola Menu </h1>
                <div className='categoryList'>
                    <button> Kopi </button>
                    <button> Non Kopi </button>
                    <button> Makanan </button>
                </div>
            </div>
            <div className='kelolaMenuWrapper'>
                {listOfMenu.map((menu, key) => {
                    return (
                        <div className='kelolaMenuBox' key={key}>
                            <img src={publicUrl + menu.gambar} alt='menu' onClick={() => handleChoosenIdMenu(menu)} />
                            <p className='menuName'> {menu.namaMenu} </p>
                            <p className='menuPrice'> {formatRupiah(menu.harga)} </p>
                        </div>
                    )
                })}
            </div>
            <div className='kelolaMenuBar'>
                <div className='left'>
                    <button onClick={() => navigate("/admin/tambah-menu")}> Tambah Menu </button>
                </div>
                <span className='line'></span>
                {choosenMenu && (
                    <div className='right'>
                        <h1> {choosenMenu.namaMenu} </h1>
                        <div className='action'>
                            <button onClick={() => navigate(`/admin/detail-menu/${choosenMenu.idMenu}`)}> Detail Menu </button>
                            <button onClick={() => navigate(`/admin/edit-menu/${choosenMenu.idMenu}`)}> Edit Menu </button>
                            <button onClick={() => setAlertDelete(true)}> Hapus Menu </button>
                        </div>
                    </div>
                )}
                {!choosenMenu && (
                    <div className='right'></div>
                )}
            </div>
            {alertDelete && (
                <div className='successModal'>
                    <div className='successBox'>
                        <p> Apakah anda yakin ingin menghapus menu {choosenMenu.namaMenu}? </p>
                        <button onClick={deleteMenu}> Yes </button>
                        <button onClick={() => setAlertDelete(false)}> No </button>
                    </div>
                </div>
            )}
            {deleteMessage && (
                <div className='successModal'>
                    <div className='successBox'>
                        <p> {deleteMessage} </p>
                        <button onClick={() => setDeleteMessage("")}> Oke </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default KelolaMenuSection
