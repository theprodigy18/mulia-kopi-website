import React, { useState } from 'react';
import Logo from "../assets/images/logo_mulia_kopi.png";
import Cart from "../assets/images/shopping-cart.svg";
import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RefreshUseEffectContext } from './RefreshUseEffect';

function Header() {
    const location = useLocation();
    let navigate = useNavigate();
    const [login, setLogin] = useState(false);
    const [namaPelanggan, setNamaPelanggan] = useState("");
    const publicUrl = process.env.PUBLIC_URL + '/images/';
    const [cartOpen, setCartOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [keranjangItem, setKeranjangItem] = useState([]);
    const [totalHarga, setTotalharga] = useState(0);
    const [email, setEmail] = useState("");
    const { refreshKey, setRefreshKey } = useContext(RefreshUseEffectContext);
    const [errMessage, setErrMessage] = useState("");
    const [isBuying, setIsBuying] = useState(false);
    const [idPesanan, setIdPesanan] = useState("");
    const [loading, setLoading] = useState(false);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const apiUrl = process.env.REACT_APP_API_URL;
    const [jumlahItem, setJumlahItem] = useState(0);

    useEffect(() => {
        // async function fetchingData() {

        //     const token = localStorage.getItem('user');
        //     if (token) {
        //         // Memverifikasi token di server
        //         const akun = await axios.get(`${apiUrl}auth/verify-token`,
        //             {
        //                 headers: {
        //                     Authorization: token // Kirim token dalam header
        //                 }
        //             })

        //         if (akun.data.valid) {
        //             setLogin(true);
        //             setEmail(akun.data.email);
        //             setNamaPelanggan(akun.data.namaPelanggan);

        //             const pesanan = await axios.get(`${apiUrl}daftarPesanan/byEmail/${akun.data.email}`);

        //             if (pesanan.data.buying) {
        //                 setIsBuying(true);
        //                 setIdPesanan(pesanan.data.idPesanan);
        //             }
        //             else {
        //                 setIsBuying(false);
        //             }

        //             const itemKeranjang = await axios.get(`${apiUrl}keranjang/byEmail/${akun.data.email}`);

        //             setJumlahItem(itemKeranjang.data.length);

        //             const promises = await itemKeranjang.data.map(items => {
        //                 return axios.get(`${apiUrl}daftarMenu/byId/${items.idMenu}`);
        //             });

        //             const responses = await Promise.all(promises);
        //             const menus = responses.map(response => response.data);

        //             // Buat salinan dari item keranjang asli dan tambahkan properti `menu` yang berisi data menu
        //             const keranjangWithMenu = itemKeranjang.data.map((item, index) => {
        //                 return {
        //                     ...item,
        //                     menu: menus[index]  // Tambahkan data menu pada properti `menu` untuk setiap item
        //                 };
        //             });

        //             const totalHarga = keranjangWithMenu.reduce((accumulator, item) => {
        //                 return accumulator + (item.menu.harga * item.jumlah);
        //             }, 0);
        //             // Set `keranjangItem` dengan data yang telah ditambahkan properti `menu`
        //             setKeranjangItem(keranjangWithMenu);

        //             setTotalharga(totalHarga);
        //         }
        //         else {
        //             localStorage.removeItem("user");
        //             setLogin(false);
        //             setNamaPelanggan("");
        //         }

        //     }
        //     else {
        //         setLogin(false);
        //         setNamaPelanggan("");
        //     }
        // }

        // fetchingData();
        if (window.innerWidth > 431) {
            const handleScroll = () => {
                const header = document.querySelector(".header");

                if (window.scrollY > 0) {
                    header.classList.add("scroll");
                } else {
                    header.classList.remove("scroll");
                }
            };

            // Tambahkan event listener scroll
            window.addEventListener("scroll", handleScroll);

            // Bersihkan event listener saat komponen di-unmount
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
        else {
            return;
        }

    }, [navigate, refreshKey, apiUrl]);

    const goHome = () => {
        navigate("/");
    };

    const handleCartOpen = () => {
        if (cartOpen)
            return setCartOpen(false);

        return setCartOpen(true);
    }
    const handleProfileOpen = () => {
        if (profileOpen)
            return setProfileOpen(false);

        return setProfileOpen(true);
    }
    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    }

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    const changeKeranjangJumlah = (email, idMenu, jumlah) => {
        if (jumlah === 1) {
            axios.post(`${apiUrl}keranjang`, { email: email, idMenu: idMenu, jumlah: jumlah }).then((response) => {
                console.log(response.data);
                setRefreshKey(prevKey => prevKey + 1);
            });
        }
        else {
            axios.post(`${apiUrl}keranjang/minus`, { email: email, idMenu: idMenu, jumlah: jumlah }).then((response) => {
                console.log(response.data);
                setRefreshKey(prevKey => prevKey + 1);
            });
        }
    }

    const handleCheckout = async () => {
        if (totalHarga === 0)
            return setErrMessage("Keranjang belanja masih kosong, silahkan pilih menu terlebih dahulu.");

        setLoading(true);
        await delay(1000);

        getUniqueCode().then(async (id) => {
            try {
                const uniqueCode = await getUniqueCodePesanan();

                await axios.post(`${apiUrl}daftarPesanan`,
                    {
                        idPesanan: id,
                        uniqueCode: uniqueCode,
                        email: email,
                        namaPelanggan: namaPelanggan
                    });

                const promises = keranjangItem.map(item => {
                    return axios.post(`${apiUrl}itemPesanan`,
                        {
                            idPesanan: id,
                            idMenu: item.menu.idMenu,
                            jumlah: item.jumlah
                        });
                });

                await Promise.all(promises);

                await axios.post(`${apiUrl}keranjang/deleteByEmail/${email}`);

                setCartOpen(false);
                setRefreshKey(prevKey => prevKey + 1);

                navigate(`/struk/${id}`);
            }
            catch (error) {
                setLoading(false);
                console.error("Error:", error);
            }
        });
    }

    async function generateUniqueCode(x) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < x; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    async function generateUniqueCodePesanan(x) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < x; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    async function getUniqueCode() {
        let id;
        let isUnique = false;

        while (!isUnique) {
            id = await generateUniqueCode(3);

            try {
                const response = await axios.get(`${apiUrl}daftarPesanan/byId/${id}`);
                // Jika respons tidak berisi error, maka kodenya unik
                if (response.data.valid) {
                    isUnique = true;
                }
            } catch (error) {
                // Jika terjadi error saat memeriksa ID, anggap kode ini belum ada dan unik
                isUnique = true;
            }
        }

        return id;
    }
    async function getUniqueCodePesanan() {
        let id;
        let isUnique = false;

        while (!isUnique) {
            id = await generateUniqueCodePesanan(7);

            try {
                const response = await axios.get(`${apiUrl}daftarPesanan/cekUniqueCode/${id}`);
                // Jika respons tidak berisi error, maka kodenya unik
                if (response.data.valid) {
                    isUnique = true;
                }
            } catch (error) {
                // Jika terjadi error saat memeriksa ID, anggap kode ini belum ada dan unik
                isUnique = true;
            }
        }

        return id;
    }

    return (
        <div className='header'>
            {loading && (
                <div className='successModal'>
                    <div className='loading'></div>
                </div>
            )}
            {errMessage && (
                <div className='errors'>
                    <p>{errMessage}</p>
                    <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                </div>
            )}
            <div className='logo' onClick={() => goHome()}>
                {location.pathname === "/menu-mobile/kopi" ||
                    location.pathname === "/menu-mobile/non-kopi" ||
                    location.pathname === "/menu-mobile/makanan" ? (
                    <i className="fa-solid fa-arrow-right fa-rotate-180 backHome"></i>
                ) : (
                    <img src={Logo} alt='logo' />
                )}
            </div>
            <div className='rightSide'>
                <ul className='navLink'>
                    <li>
                        <a href='/'> home </a>
                    </li>
                    <li>
                        <a href='/#aboutUs'> about us </a>
                    </li>
                    <li>
                        <a href='/menu/all'> menu </a>
                    </li>
                    <li>
                        <a href={`${location.pathname}#footer`} > contact </a>
                    </li>

                </ul>
                {login && (
                    <div className='cart'>
                        <div className='cartSub'>
                            <img src={Cart} alt='cart' onClick={handleCartOpen} />
                            {jumlahItem > 0 && (
                                <span> {jumlahItem} </span>
                            )}
                        </div>
                        <span>|</span>
                        <p onClick={handleProfileOpen}> <i className="fa-solid fa-user"></i> {namaPelanggan} </p>
                        {profileOpen && (
                            <div className='logout'>
                                <button onClick={handleLogout}> Logout </button>
                            </div>
                        )}
                    </div>
                )}
                {!login && (
                    <div className='cart'>
                        <button onClick={() => navigate("/login")}> Login </button>
                    </div>
                )}
            </div>
            {cartOpen && (
                <div className='cartOpen'>
                    <img src={publicUrl + "Group 195.jpg"} alt='gambar' className='imgKeranjang' />
                    <img src={publicUrl + "Group 194.png"} alt='back' className='imgBack' onClick={handleCartOpen} />
                    {!isBuying && (
                        <div className='cartMenuWrapper'>
                            <div className='cartMenu'>
                                {totalHarga === 0 && (
                                    <p> keranjang anda kosong </p>
                                )}
                                {keranjangItem?.map((item, key) => {
                                    return (
                                        <div className='cartMenuBox' key={key}>
                                            <img src={publicUrl + "menu/" + item.menu.gambar} alt='menu' />
                                            <div className='cartMenuDetail'>
                                                <h1> {item.menu.namaMenu} </h1>
                                                <p> {formatRupiah(item.menu.harga)} </p>
                                            </div>
                                            <p>
                                                <i className="fa-solid fa-minus" onClick={() => changeKeranjangJumlah(email, item.menu.idMenu, -1)}></i>
                                                {item.jumlah}
                                                <i className="fa-solid fa-plus" onClick={() => changeKeranjangJumlah(email, item.menu.idMenu, 1)}></i>
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className='cartMenuTotal'>
                                <div className='totalBox'>
                                    <h1> Total </h1>
                                    <p> {formatRupiah(totalHarga)} </p>
                                </div>
                                <button onClick={handleCheckout}> Check Out </button>
                            </div>
                        </div>
                    )}
                    {isBuying && (
                        <div className='cartMenuWrapper'>
                            <p> Anda sudah melakukan pemesanan, silahkan lakukan pembayaran di kasir. </p>
                            <button onClick={() => navigate(`/struk/${idPesanan}`)}> Cek Kode Pesanan </button>
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}

export default Header
