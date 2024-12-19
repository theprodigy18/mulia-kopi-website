import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { RefreshUseEffectContext } from './RefreshUseEffect';

function MenuSection() {
    let navigate = useNavigate();
    let category = useParams().category;
    const Gambar = process.env.PUBLIC_URL + '/images/menu/';
    const [listOfMenu, setListOfMenu] = useState([]);
    const [email, setEmail] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const { setRefreshKey } = useContext(RefreshUseEffectContext);
    const [isBuying, setIsBuying] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [notif, setNotif] = useState(false);

    useEffect(() => {
        if (category === "all") {
            axios.get(`${apiUrl}daftarMenu`).then((response) => {
                setListOfMenu(response.data);
            });
        }
        else {
            axios.get(`${apiUrl}daftarMenu/${category}`).then((response) => {
                setListOfMenu(response.data);
            });
        }

        const token = localStorage.getItem('user');
        if (token) {
            // Memverifikasi token di server
            axios.get(`${apiUrl}auth/verify-token`,
                {
                    headers: {
                        Authorization: token // Kirim token dalam header
                    }
                }).then(async (response) => {
                    if (response.data.valid) {
                        setEmail(response.data.email);

                        const pesanan = await axios.get(`${apiUrl}daftarPesanan/byEmail/${response.data.email}`);

                        if (pesanan.data.buying) {
                            setIsBuying(true);
                        }
                        else {
                            setIsBuying(false);
                        }
                    }
                    else {
                        setEmail("");
                    }
                })
        }
        else {
            setEmail("");
        }

    }, [category, apiUrl]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }
    const capitalizeWords = (str) => {
        if (!str) return "";
        return str
            .split(" ") // Memisahkan string menjadi array kata-kata
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Mengubah huruf pertama tiap kata menjadi besar
            .join(" "); // Menggabungkan kembali menjadi string
    };

    const byCategory = (str) => {
        navigate("/menu/" + str);
    };

    const handleBeliSekarang = (idMenu) => {
        if (!email)
            return setErrMessage("Login terlebih dahulu untuk membeli lewat sistem");

        if (isBuying)
            return setErrMessage("Anda sedang membeli, silahkan selesaikan transaksi terlebih dahulu.");

        axios.post(`${apiUrl}keranjang`, { email: email, idMenu: idMenu, jumlah: 1 }).then((response) => {
            console.log(response.data);
            setNotif(true);
            setRefreshKey(prevKey => prevKey + 1);
        });
    };

    return (
        <div className='menuSectionContainer'>
            {errMessage && (
                <div className='errors'>
                    <p>{errMessage}</p>
                    <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                </div>
            )}
            {notif && (
                <div className='errors'>
                    <p>pesanan ditambahkan ke keranjang </p>
                    {/* <i className="fa-solid fa-x" onClick={() => setNotif("")}></i> */}
                </div>
            )}{setTimeout(() => setNotif(false), 1000)}
            <h1> Menu </h1>
            <div className='menuCategory'>
                <button className='categoryButton' onClick={() => byCategory("kopi")}> Kopi </button>
                <button className='categoryButton' onClick={() => byCategory("non-kopi")}> Non Kopi </button>
                <button className='categoryButton' onClick={() => byCategory("makanan")}> Makanan </button>
            </div>
            <div className='menuContainer'>
                {listOfMenu.map((menu, key) => {
                    const category = menu.kategori;
                    const textCategory = category.replace("-", " ");
                    return (
                        <div className='menuBox' key={key}>
                            <img src={Gambar + menu.gambar} alt='menu' onClick={() => { navigate("/detail-menu/" + menu.idMenu) }} />
                            <button onClick={() => handleBeliSekarang(menu.idMenu)}> Beli Sekarang </button>
                            <p className='menuName'> {menu.namaMenu} </p>
                            <p className='category'> {capitalizeWords(textCategory)} </p>
                            <p className='price'> {formatRupiah(menu.harga)} </p>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default MenuSection
