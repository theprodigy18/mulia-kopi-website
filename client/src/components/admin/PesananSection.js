import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PesananSection() {
    const publicUrl = process.env.PUBLIC_URL + '/images/menu/';
    let navigate = useNavigate();
    const [listOfPesanan, setListOfPesanan] = useState([]);
    const [activePesanan, setActivePesanan] = useState(null);
    const [pesananItems, setPesananItems] = useState({});
    const [codePesanan, setCodePesanan] = useState("");
    const [idAdmin, setIdAdmin] = useState("");
    const [hargaTotal, setHargaTotal] = useState(0);
    const [idPesanan, setIdPesanan] = useState("");
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Qris");
    const apiUrl = process.env.REACT_APP_API_URL;

    // Mengambil daftar pesanan pada saat komponen dimuat
    useEffect(() => 
    {
        const token = localStorage.getItem('token');
        if (token) 
        {
            // Memverifikasi token di server
            axios.get(`${apiUrl}admin/verify-token`, 
            {
                headers: {
                    Authorization: token // Kirim token dalam header
                }
            }).then((response) => 
            {
                // Jika token valid, arahkan ke dashboard
                if (response.data.valid) 
                {
                    setIdAdmin(response.data.idAdmin);
                    // console.log(response.data.idAdmin); 
                }
            })
        }

        axios.get(`${apiUrl}daftarPesanan/uniqueCode`).then((response) => 
        {
            setListOfPesanan(response.data);
        }).catch((error) => {
            console.error("Error fetching daftarPesanan:", error);
        });
    }, [apiUrl]);

    const handleSearch = (() =>
    {
        if (codePesanan === "")
        {
            axios.get(`${apiUrl}daftarPesanan/uniqueCode`).then((response) =>
            {
                setListOfPesanan(response.data);
            });
        }
        else
        {
            axios.get(`${apiUrl}daftarPesanan/byUniqueCode/${codePesanan}`).then((response) =>
            {
                setListOfPesanan(response.data);
            });
        }
    });

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    // Fungsi untuk membuka/tutup detail pesanan dan mengambil item pesanan jika belum ada di state
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

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    const openMetodePembayaran = (idPesanan, totalHarga) => 
    {
        setIdPesanan(idPesanan);
        setHargaTotal(totalHarga);
        setSuccess(true);
    }
    const handleTransaction = async () => 
    {
        console.log("transaksi");
        try
        {
            await axios.post(`${apiUrl}daftarPesanan/updateStatus/${idPesanan}`);
         
            await axios.post(`${apiUrl}riwayatTransaksi`, 
            {
                idPesanan: idPesanan,
                idAdmin: idAdmin,
                totalHarga: hargaTotal,
                diskon: 0,
                pajak: 0,
                metodePembayaran: paymentMethod
            });

            const items = await axios.get(`${apiUrl}itemPesanan/byIdPesanan/${idPesanan}`);
            
            await Promise.all(items.data.map((item) =>
            {
                return axios.post(`${apiUrl}daftarMenu/minusStok/${item.idMenu}`, { jumlah: item.jumlah });
            }));

            await axios.get(`${apiUrl}riwayatTransaksi/byIdPesanan/${idPesanan}`).then((response) =>
            {
                if (!response.data.noData)
                    navigate(`/admin/struk/${response.data.id}`);
            });
        }
        catch (error)
        {
            console.error("Error", error);
        }

    };

    return (
        <div className='pesananSectionContainerWrapper'>
            {success && (
                <div className='successModal'>
                    <div className='successBox'>
                        <p> Pilih Metode Pembayaran </p>
                        <select 
                            name="paymentMethod"
                            onChange={(event) => setPaymentMethod(event.target.value)}
                        >
                            <option value="Qris">Qris</option>
                            <option value="Cash">Cash</option>
                        </select>
                        <button onClick={handleTransaction}> Enter </button>
                    </div>
                </div>
            )}
            {listOfPesanan.map((pesanan, key) => {
                const listOfItemPesanan = pesananItems[pesanan.idPesanan] || [];
                const totalHarga = listOfItemPesanan.reduce(
                    (acc, item) => acc + (item.menu.harga * item.jumlah), 0
                );

                return (
                    <div className='pesananSectionContainer' key={key}>
                        <div className='pesananOnlineBox'>
                            <div className='detail'>
                                <h1> {pesanan.uniqueCode} </h1>
                                <p onClick={() => togglePesanan(pesanan.idPesanan)}> Lihat selengkapnya </p>
                            </div>
                            <p onClick={() => togglePesanan(pesanan.idPesanan)}>
                                <i className={`fa-solid fa-caret-${activePesanan === pesanan.idPesanan ? 'down' : 'up'}`}></i>
                            </p>
                        </div>
                        {activePesanan === pesanan.idPesanan && (
                            <div className="pesananOnlineBoxMore">
                                <div className='tabelPesanan'>
                                    <div className='menuWrapper'>
                                        {listOfItemPesanan.map((item, index) => (
                                            <div className='pesananBox' key={index}>
                                                <img src={publicUrl + item.menu.gambar} alt='menu' />
                                                <div className='infoPesanan'>
                                                    <h1> {item.menu.namaMenu} </h1>
                                                    <p> Rp. {item.menu.harga} </p>
                                                </div>
                                                <p> {item.jumlah}x </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='detailPelanggan'>
                                        <h1> Pesanan </h1>
                                        <p> Nama pemesan: {pesanan.namaPelanggan} </p>
                                    </div>
                                </div>
                                <div className='detailHarga'>
                                    <h1> Total Harga </h1>
                                    <p> {formatRupiah(totalHarga)} </p>
                                    <button onClick={() => openMetodePembayaran(pesanan.idPesanan, totalHarga)}> Check Out </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <div className='searchBar'>
                <input 
                    type='text' 
                    placeholder='Search...' 
                    name='menu'
                    value={codePesanan}
                    onChange=
                    {
                        (event) => {setCodePesanan(event.target.value)}
                    } 
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
}

export default PesananSection;
