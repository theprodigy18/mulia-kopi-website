import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function RiwayatSection() 
{
    const publicUrl = process.env.PUBLIC_URL + '/images/menu/';
    let navigate = useNavigate();
    const [listOfTransaksi, setListOfTransaksi] = useState([]);
    const [activePesanan, setActivePesanan] = useState(null);
    const [pesananItems, setPesananItems] = useState({});
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => 
    {
        async function fetchingData() 
        {
            const transaksi = await axios.get(`${apiUrl}riwayatTransaksi`);

            const promises = transaksi.data.map(item => 
            {
                return axios.get(`${apiUrl}daftarPesanan/getByIdPesanan/${item.idPesanan}`);
            });
            const responses = await Promise.all(promises);
            const daftarPesanan = responses.map(response => response.data);

            const promises2 = transaksi.data.map(item =>
            {
                return axios.get(`${apiUrl}admin/byIdAdmin/${item.idAdmin}`);
            });
            const responses2 = await Promise.all(promises2);
            const daftarAdmin = responses2.map(response => response.data);

            const riwayatTransaksi = transaksi.data.map((item, index) => (
            {
                ...item,
                pesanan: daftarPesanan[index],
                admin: daftarAdmin[index]
            }));

            setListOfTransaksi(riwayatTransaksi);
        }

        fetchingData();
    }, [apiUrl]);

    const togglePesanan = (idPesanan) => {
        if (activePesanan === idPesanan) {
            setActivePesanan(null);
        } else {
            setActivePesanan(idPesanan);
            if (!pesananItems[idPesanan]) {
                axios.get(`${apiUrl}itemPesanan/byIdPesanan/${idPesanan}`)
                    .then((response) => {
                        const items = response.data;

                        // Ambil detail menu untuk setiap item pesanan
                        const itemPromises = items.map((item) => {
                            return axios.get(`${apiUrl}daftarMenu/byId/${item.idMenu}`)
                                .then((menuResponse) => ({
                                    ...item,
                                    menu: menuResponse.data,
                                }));
                        });

                        // Tunggu semua data item pesanan selesai diambil
                        Promise.all(itemPromises).then((itemsWithMenu) => {
                            setPesananItems((prevItems) => ({
                                ...prevItems,
                                [idPesanan]: itemsWithMenu,
                            }));
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching itemPesanan:", error);
                    });
            }
        }
    };

    const formatTanggal = (date) =>
    {
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
    }

    const formatRupiah = (number) =>
    {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    return (
        <div className='pesananSectionContainerWrapper'>
            {listOfTransaksi.map((transaksi, key) => {
                const listOfItemPesanan = pesananItems[transaksi.idPesanan] || [];

                return (
                    <div className='pesananSectionContainer' key={key}>
                        <div className='pesananOnlineBox'>
                            <div className='detail'>
                                <h1> Nama Pelanggan: {transaksi.pesanan.namaPelanggan} </h1>
                                <p> {formatTanggal(transaksi.createdAt)} </p>
                            </div>
                            <p onClick={() => togglePesanan(transaksi.idPesanan)}>
                                <i className={`fa-solid fa-caret-${activePesanan === transaksi.idPesanan ? 'down' : 'up'}`}></i>
                            </p>
                        </div>
                        {activePesanan === transaksi.idPesanan && (
                            <div className="pesananOnlineBoxMore">
                                <div className='tabelPesanan'>
                                    <div className='menuWrapper'>
                                        {listOfItemPesanan.map((item, key) => (
                                            <div className='pesananBox' key={key}>
                                                <img src={publicUrl + item.menu.gambar} alt='menu' />
                                                <div className='infoPesanan'>            
                                                    <h1> {item.menu.namaMenu} </h1>
                                                    <p> {formatRupiah(item.menu.harga)} </p>
                                                </div>
                                                <p> {item.jumlah}x </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='detailPelanggan'>
                                        <h1> Pesanan </h1>
                                        {transaksi.pesanan.uniqueCode && (
                                            <p> Asal Pesanan: Sistem </p>
                                        )}
                                        {!transaksi.pesanan.uniqueCode && (
                                            <p> Asal Pesanan: Kasir </p>
                                        )}
                                        <p> Metode Pembayaran: {transaksi.metodePembayaran} </p>
                                        <p> Nama Kasir: {transaksi.admin.namaAdmin} </p>
                                    </div>
                                </div>
                                <div className='detailHarga'>
                                    <h1> Total Harga </h1>
                                    <p> {formatRupiah(transaksi.totalHarga)} </p>
                                    <button onClick={() => navigate(`/admin/struk/${transaksi.id}`)}> Lihat Struk </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default RiwayatSection
