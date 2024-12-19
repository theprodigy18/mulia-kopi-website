import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import axios from 'axios';

function StrukOnline() 
{
    const publicUrl = process.env.PUBLIC_URL + '/images/';
    let idPesanan = useParams().idPesanan;
    let navigate = useNavigate();
    const [itemPesanan, setItemPesanan] = useState([]);
    const [pesanan, setPesanan] = useState({});
    const [totalHarga, setTotalHarga] = useState(0);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => 
    {
        async function fetchingData()
        {
            // console.log(idPesanan);
            const token = localStorage.getItem('user');
            if (token) 
            {
                // Memverifikasi token di server
                const akun = await axios.get(`${apiUrl}auth/verify-token`, 
                {
                    headers: {
                        Authorization: token // Kirim token dalam header
                    }
                })
                
                if (akun.data.valid)
                {
                    const pesanan = await axios.get(`${apiUrl}daftarPesanan/getByIdAndEmail/${idPesanan}/${akun.data.email}`);

                    if (pesanan.data.noData)
                        navigate('/');

                    setPesanan(pesanan.data);

                    const items = await axios.get(`${apiUrl}itemPesanan/byIdPesanan/${pesanan.data.idPesanan}`);

                    const promises = items.data.map(item =>
                    {
                        return axios.get(`${apiUrl}daftarMenu/byId/${item.idMenu}`);
                    });

                    const responses = await Promise.all(promises);
                    const daftarMenu = responses.map(response => response.data);

                    const itemPesanan = items.data.map((item, index) => ({
                        ...item,
                        menu: daftarMenu[index]  // Tambahkan data menu pada properti `menu` untuk setiap item
                    }));

                    const totalHarga = itemPesanan.reduce((accumulator, item) => {
                        return accumulator + (item.menu.harga * item.jumlah);
                    }, 0);
                    
                    setItemPesanan(itemPesanan);
                    setTotalHarga(totalHarga);

                }
                else
                {
                    localStorage.removeItem("user");
                    navigate('/');
                }
    
            }
            else
            {
                navigate("/");   
            }
        }

        fetchingData();

    }, [navigate, idPesanan, apiUrl]);

    const formatTanggal = (date) =>
    {
        const createdAt = new Date(date); // Ganti dengan nilai `datetime` Anda
        const options = { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
        };

        const formattedDate = createdAt.toLocaleString('en-US', options).replace(',', '.');

        return formattedDate;
    }

    const formatRupiah = (number) =>
    {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    return (
        <div>
            <Header />
                <div className='strukOnlineContainer'>
                    <img src={publicUrl + "How to Make Coffee_ 17 Best Coffee Brewing Methods (Ultimate Recipe Guide) _ EnjoyJava 2.png"} alt='head images' />
                    <div className='mobileBg'> Receipt </div>
                    <div className='strukOnlineWrapper'>
                        <div className='strukOnlineBox'>
                            <h1> --MULIA KOPI-- </h1>
                            <div className='customerDetail'>
                                <p> Order by <b> {pesanan.namaPelanggan} </b> </p>
                                <p> {formatTanggal(pesanan.createdAt)} </p>
                            </div>
                            <span className='straightLine'></span>
                            <span className='straightLine'></span>
                            <div className='strukContent'>
                                <div className='strukOnlineItem'>
                                    <h1> Description </h1>
                                    <h1> Price </h1>
                                </div>
                                {itemPesanan.map((item, key) => 
                                {
                                    return (
                                        <div className='strukOnlineItem' key={key}>
                                            <p> {item.menu.namaMenu} {item.jumlah}x </p>
                                            <p> {formatRupiah(item.menu.harga * item.jumlah)} </p>
                                        </div>
                                    )
                                })}
                            </div>
                            <span className='straightLine'></span>
                            <span className='straightLine'></span>
                            <div className='strukTotal'>
                                <p> Total Harga: </p>
                                <p> {formatRupiah(totalHarga)} </p>
                            </div>
                            <div className='code'>
                                <p> Ini adalah kode pesanan anda: </p>
                                <h1> {pesanan.uniqueCode} </h1>
                                <p> Silahkan membawa kode ini ke kasir untuk melakukan pembayaran. </p>
                            </div>
                        </div>
                    </div>
                </div>
            <Footer />
        </div>
    )
}

export default StrukOnline
