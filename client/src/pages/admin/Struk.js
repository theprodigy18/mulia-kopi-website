import React, { useEffect } from 'react'
import AdminHeader from '../../components/admin/AdminHeader'
import Sidebar from '../../components/admin/Sidebar'
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Struk() 
{
    const publicUrl = process.env.PUBLIC_URL + '/images/';
    let idTransaksi = useParams().idTransaksi;
    let navigate = useNavigate();
    const [transaksi, setTransaksi] = useState({});
    const [pesanan, setPesanan] = useState({});
    const [admin, setAdmin] = useState({});
    const [itemPesanan, setItemPesanan] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => 
    {
        async function fetchingData()
        {
            const transaction = await axios.get(`${apiUrl}riwayatTransaksi/byIdTransaksi/${idTransaksi}`);
            
            if (transaction.data.noData)
                return navigate('/admin/kasir');


            const pesanan = await axios.get(`${apiUrl}daftarPesanan/getByIdPesanan/${transaction.data.idPesanan}`);

            if (pesanan.data.noData)
                return navigate('/admin/kasir');

            const admin = await axios.get(`${apiUrl}admin/byIdAdmin/${transaction.data.idAdmin}`);

            setTransaksi(transaction.data);   
            setPesanan(pesanan.data);
            setAdmin(admin.data);

            const items = await axios.get(`${apiUrl}itemPesanan/byIdPesanan/${pesanan.data.idPesanan}`);

            const promises = items.data.map(item =>
            {
                return axios.get(`${apiUrl}daftarMenu/byId/${item.idMenu}`);
            });

            const responses = await Promise.all(promises);
            const daftarMenu = responses.map(response => response.data);
                
                // Buat salinan dari item keranjang asli dan tambahkan properti `menu` yang berisi data menu
            const listItem = items.data.map((item, index) => {
                return {
                    ...item,
                    menu: daftarMenu[index]  // Tambahkan data menu pada properti `menu` untuk setiap item
                };
            });

            setItemPesanan(listItem);
        }

        fetchingData();
        
    }, [idTransaksi, navigate, apiUrl]);

    const formatTanggal = (date) =>
    {
        // console.log(date);
        const createdAt = new Date(date);

        if (isNaN(createdAt)) {
            return "Invalid Date"; // Atau tampilkan pesan kesalahan yang sesuai
        }

        const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
        }).format(createdAt);

        return formattedDate;
    };

    const formatRupiah = (number) =>
    {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    return (
        <div>
            <AdminHeader />
            <Sidebar />
            <div className='strukContainer'>
                {transaksi && (
                    <div className='strukBox'>
                        <div className='title'>
                            <p> Payment </p>
                        </div>

                        <div className='struk'>
                            <img src={publicUrl + 'Success Icon.png'} alt='ceklist' className='ceklist' />
                            <h1> Payment Detail </h1>
                            <p> {formatTanggal(transaksi.createdAt)} </p>
                            <div className='strukItem'>
                                <h1> Nama Pelanggan </h1>
                                <p> {pesanan.namaPelanggan} </p>
                            </div>
                            <div className='strukItem'>
                                <h1> Nama Kasir </h1>
                                <p> {admin.namaAdmin} </p>
                            </div>
                            <span></span> {/* line */}
                            {pesanan.uniqueCode && (
                                <div className='uniqueCode'> {pesanan.uniqueCode} </div>
                            )}
                            {itemPesanan.map((item, key) => {

                                return (
                                    <div className='strukItem' key={key}>
                                        <h1> {item.menu.namaMenu} x{item.jumlah} </h1>
                                        <p> {formatRupiah(item.menu.harga * item.jumlah)} </p>
                                    </div>
                                )
                            })}
                            <span></span> {/* line */}
                            <div className='strukItem'>
                                <h1> Total Harga </h1>
                                <p> {formatRupiah(transaksi.totalHarga)} </p>
                            </div>
                            <div className='strukItem'>
                                <h1> Pembayaran </h1>
                                <p> {transaksi.metodePembayaran} </p>
                            </div>
                            <img src={publicUrl + 'logo-struk.png'} alt='logo' className='logoMulia' />
                            <h2 className='alamat'> gg sawah, Jl. Bendungan Sutami, Sumbersari, <br /> Kec. Lowokwaru, Kota Malang </h2>
                            <img src={publicUrl + 'Group 69.png'} alt='round' className='rounderBottom' />
                        </div>
                        <button> Cetak Struk </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Struk
