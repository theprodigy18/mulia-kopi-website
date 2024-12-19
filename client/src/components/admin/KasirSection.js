import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { RefreshUseEffectContext } from '../RefreshUseEffect';
import { useNavigate } from 'react-router-dom';

function KasirSection() 
{
    let navigate = useNavigate();
    const publicUrl = process.env.PUBLIC_URL + '/images/menu/';
    const [listOfMenu, setListOfMenu] = useState([]);
    const [menuName, setMenuName] = useState("");
    const [choosenMenu, setChoosenMenu] = useState({});
    const [jumlahComp, setJumlahComp] = useState(0);
    const { refreshKey, setRefreshKey } = useContext(RefreshUseEffectContext);
    const [itemPesanan, setItemPesanan] = useState([]);
    const [totalHarga, setTotalharga] = useState(0);
    const [success, setSuccess] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [namaPelanggan, setNamaPelanggan] = useState("");
    const [idAdmin, setIdAdmin] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Qris");
    const apiUrl = process.env.REACT_APP_API_URL;

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

        async function fetchingData()
        {
            const menus = await axios.get(`${apiUrl}daftarMenu`);
            setListOfMenu(menus.data);

            const items = await axios.get(`${apiUrl}keranjangAdmin`);

            const promises = await items.data.map(items =>
            {
                return axios.get(`${apiUrl}daftarMenu/byId/${items.idMenu}`);
            });

            const responses = await Promise.all(promises);
            const daftarMenu = responses.map(response => response.data);
                
                // Buat salinan dari item keranjang asli dan tambahkan properti `menu` yang berisi data menu
            const keranjangWithMenu = items.data.map((item, index) => {
                return {
                    ...item,
                    menu: daftarMenu[index]  // Tambahkan data menu pada properti `menu` untuk setiap item
                };
            });

            const totalHarga = keranjangWithMenu.reduce((accumulator, item) => {
                return accumulator + (item.menu.harga * item.jumlah);
            }, 0);

            setItemPesanan(keranjangWithMenu);
            setTotalharga(totalHarga);
        }

        fetchingData();

    }, [refreshKey, apiUrl]);

    const handleSearch = (() =>
    {
        if (menuName === "")
        {
            axios.get(`${apiUrl}daftarMenu`).then((response) =>
            {
                setListOfMenu(response.data);
            });
        }
        else
        {
            axios.get(`${apiUrl}daftarMenu/byName/${menuName}`).then((response) =>
            {
                setListOfMenu(response.data);
            });
        }
    });

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    
    
    const formatRupiah = (number) =>
    {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    const listByCategory = (category) =>
    {
        setMenuName("");

        axios.get(`${apiUrl}daftarMenu/${category}`).then((response) =>
        {
            setListOfMenu(response.data);
        });
    };

    const handleChoosenMenu = (menu) =>
    {
        if (choosenMenu.idMenu !== menu.idMenu)
        {
            axios.get(`${apiUrl}keranjangAdmin/byIdMenu/${menu.idMenu}`).then((response) =>
            {
                if (response.data.noData)
                {
                    setJumlahComp(0);
                }
                else
                {
                    setJumlahComp(response.data.jumlah);
                }

                return setChoosenMenu(menu);
            })
        }

        setChoosenMenu({});
        return setJumlahComp(0);
    }

    const changeKeranjangJumlah = (idMenu, jumlah) =>
    {
        if (idMenu)
        {
            if (jumlah === 1)
            {
                axios.post(`${apiUrl}keranjangAdmin`, { idMenu: idMenu, jumlah: jumlah }).then((response) =>
                {
                    setJumlahComp(prevKey => prevKey + 1);
                    setRefreshKey(prevKey => prevKey + 1);
                    console.log(response.data);
                });
            }
            else
            {
                axios.post(`${apiUrl}keranjangAdmin/minus`, { idMenu: idMenu, jumlah: jumlah }).then((response) =>
                {
                    if (!response.data.noData)
                        setJumlahComp(prevKey => prevKey - 1);
                    
                    setRefreshKey(prevKey => prevKey + 1);
                    console.log(response.data);
                });
            }
        }

    }

    async function generateUniqueCode () 
    {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 3; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    async function getUniqueCode ()  
    {
        let id;
        let isUnique = false;
    
        while (!isUnique) 
        {
            id = await generateUniqueCode();
    
            try {
                const response = await axios.get(`${apiUrl}daftarPesanan/byId/${id}`);
                // Jika respons tidak berisi error, maka kodenya unik
                if (response.data.valid) 
                {
                    isUnique = true;
                }
            } catch (error) 
            {
                // Jika terjadi error saat memeriksa ID, anggap kode ini belum ada dan unik
                isUnique = true;
            }
        }
        
        return id;
    }

    const handleTransaction = () => 
    {
        if (namaPelanggan) 
        {
            getUniqueCode().then(async (id) => 
            {
                try
                {
                    await axios.post(`${apiUrl}daftarPesanan`,
                    {
                        idPesanan: id,
                        namaPelanggan: namaPelanggan,
                        statusPembayaran: true
                    });
    
                    const promises =  itemPesanan.map(item => 
                    {
                        return axios.post(`${apiUrl}itemPesanan`,
                        {
                            idPesanan: id,
                            idMenu: item.menu.idMenu,
                            jumlah: item.jumlah
                        });
                    });
    
                    await Promise.all(promises);
    
                    await axios.post(`${apiUrl}riwayatTransaksi`,
                    {
                        idPesanan: id,
                        idAdmin: idAdmin,
                        totalHarga: totalHarga,
                        diskon: 0,
                        pajak: 0,
                        metodePembayaran: paymentMethod
                    });
                    
                    await axios.post(`${apiUrl}keranjangAdmin/delete`);

                    console.log("done");
                    
                    setSuccess(false);
                    setRefreshKey(prevKey => prevKey + 1);

                    await Promise.all(itemPesanan.map(item => 
                    {
                        return axios.post(`${apiUrl}daftarMenu/minusStok/${item.menu.idMenu}`, { jumlah: item.jumlah });
                    }));

                    await axios.get(`${apiUrl}riwayatTransaksi/byIdPesanan/${id}`).then((response) =>
                    {
                        if (!response.data.noData)
                            navigate(`/admin/struk/${response.data.id}`);
                    });

                }
                catch (error)
                {
                    console.error(error);
                }
            });
        }
        else
        {
            console.log("isi nama pelanggan");
        }
    }

    const cekKeranjang = () =>
    {
        if (totalHarga === 0)
            return setErrMessage("Keranjang masih kosong");

        setSuccess(true);
    }

    return (
        <div className='kasirContainer'>
            {success && (
                <div className='successModal'>
                    <div className='successBox'>
                        <p> Masukkan Nama Pelanggan </p>
                        <input 
                            type='text' 
                            name='nama' 
                            placeholder='nama' 
                            onChange=
                            {
                                (event) => {setNamaPelanggan(event.target.value)}
                            } 
                        />
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
            {errMessage && (
                <div className='errors'>
                    <p>{errMessage}</p>
                    <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                </div>
            )}
            <div className='categoryMenuKasir'>
                <button onClick={() => listByCategory("kopi")}> Kopi </button>
                <button onClick={() => listByCategory("non-kopi")}> Non Kopi </button>
                <button onClick={() => listByCategory("makanan")}> Makanan </button>
            </div>
            <div className='menuContainerkasir'>
                {listOfMenu.map((menu, key) =>
                {
                    return (
                        <div className='menuBoxKasir' key={key}>
                            <img src={publicUrl + menu.gambar} alt='menu' onClick={() => handleChoosenMenu(menu)}/>
                            <p className='menuName'> {menu.namaMenu} </p>
                            <p className='menuPrice'> {formatRupiah(menu.harga)} </p>
                        </div>
                    )
                })}
            </div>

            <div className='kasirBar'>
                <div className='left'>
                    <p> Total Harga </p>
                    <h1> {formatRupiah(totalHarga)} </h1>
                </div>
                <div className='right'>
                    {choosenMenu && (
                        <p> {choosenMenu.namaMenu} </p>
                    )}
                    <div className='amount'>
                        <p className='increment' onClick={() => changeKeranjangJumlah(choosenMenu.idMenu, -1)}><i className="fa-solid fa-minus"></i></p>
                        <p className='number'> {jumlahComp} </p>
                        <p className='increment' onClick={() => changeKeranjangJumlah(choosenMenu.idMenu, 1)}><i className="fa-solid fa-plus"></i></p>
                    </div>
                    <button onClick={cekKeranjang}> Check Out </button>
                </div>
            </div>

            <div className='searchBar'>
                <input 
                    type='text' 
                    placeholder='Search...' 
                    name='menu'
                    value={menuName}
                    onChange=
                    {
                        (event) => {setMenuName(event.target.value)}
                    } 
                    onKeyDown={handleKeyDown}
                />
            </div>

            <div className='rightSidebar'>
                <p> Total Pesanan </p>
                <div className='pesananContainer'>
                    {itemPesanan?.map((pesanan, key) =>
                    {
                        return (
                            <div className='pesananBox' key={key} >
                                <img src={publicUrl + pesanan.menu.gambar} alt='menu' onClick={() => handleChoosenMenu(pesanan.menu)} />
                                <div className='infoPesanan'>
                                    <h1> {pesanan.menu.namaMenu} </h1>
                                    <p> {formatRupiah(pesanan.menu.harga)} </p>
                                </div>
                                <p> {pesanan.jumlah}x </p>
                            </div>
                        )
                    })};
                </div>
            </div>
        </div>
    )
}

export default KasirSection
