import React, { useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import Cart from "../assets/images/shopping-cart.svg";
import { RefreshUseEffectContext } from '../components/RefreshUseEffect';

function Recommendation() 
{
    let id = useParams().idScan;
    let navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [mood, setMood] = useState("");
    const publicUrl = process.env.PUBLIC_URL + '/images/';
    const [email, setEmail] = useState("");
    const { setRefreshKey } = useContext(RefreshUseEffectContext);
    const [errMessage, setErrMessage] = useState("");
    const [isBuying, setIsBuying] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    
    useEffect(() =>
    {
        async function fetchingData()
        {
            const token = localStorage.getItem('user');
            if (token) 
            {
                const validateToken = await axios.get(`${apiUrl}auth/verify-token`, 
                {
                    headers: {
                        Authorization: token // Kirim token dalam header
                    }
                });

                if (validateToken.data.valid)
                {
                    setEmail(validateToken.data.email);

                    const pesanan = await axios.get(`${apiUrl}daftarPesanan/byEmail/${validateToken.data.email}`);

                    if (pesanan.data.buying)
                    {
                        setIsBuying(true);
                    }
                    else
                    {
                        setIsBuying(false);
                    }

                    const scanMood = await axios.get(`${apiUrl}scanMood/byIdAndEmail/${id}/${validateToken.data.email}`);

                    if (scanMood.data.error)
                    {
                        navigate("/");
                    }
                    else
                    {
                        setMood(scanMood.data.mood);
                        const rekomendasi = await axios.get(`${apiUrl}rekomendasiMenu/byId/${id}`);

                        if (!rekomendasi.data.error)
                        {
                            const promises = rekomendasi.data.map(item =>
                                axios.get(`${apiUrl}daftarMenu/byId/${item.idMenu}`)
                            );
            
                            const responses = await Promise.all(promises);
                            const menus = responses.map(response => response.data); // Ambil data dari setiap respons
                            setMenuItems(menus);
                        }
                    }
                }
                else
                {
                    localStorage.removeItem("user");
                    navigate("/");
                }
            }
            else
            {
                navigate("/");
            }
        }

        fetchingData();

    }, [navigate, id, apiUrl]);

    const formatRupiah = (number) =>
    {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }
    const capitalizeWords = (str) => 
    {
        if (!str) return "";
        return str
            .split(" ") // Memisahkan string menjadi array kata-kata
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Mengubah huruf pertama tiap kata menjadi besar
            .join(" "); // Menggabungkan kembali menjadi string
    };

    function formatNumber(num) {
        if (num >= 1_000_000) {
            // Jika angkanya lebih besar atau sama dengan 1 juta, tambahkan 'M' (misalnya, 1.5M)
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (num >= 1_000) {
            // Jika angkanya lebih besar atau sama dengan 1 ribu, tambahkan 'k' (misalnya, 6.5k)
            return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
        } else {
            // Jika kurang dari 1 ribu, kembalikan angka asli
            return num.toString();
        }
    }

    const handleBeliSekarang = (idMenu) =>
    {
        if (!email)
            return setErrMessage("Login terlebih dahulu untuk membeli lewat sistem");

        if (isBuying)
            return setErrMessage("Anda sedang membeli, silahkan selesaikan transaksi terlebih dahulu.");
        
        axios.post(`${apiUrl}keranjang`, { email: email, idMenu: idMenu, jumlah: 1 }).then((response) =>
        {
            console.log(response.data);
            setRefreshKey(prevKey => prevKey + 1);
        });
    };

    return (
        <div>
            <Header />
            <div className='recommendation'>
                {errMessage && (
                    <div className='errors'>
                        <p>{errMessage}</p>
                        <i className="fa-solid fa-x" onClick={() => setErrMessage("")}></i>
                    </div>
                )}
                <img src={publicUrl + "Group 92.jpg"} alt='gambar' />
                <div className='recommendationContainer'>
                    <h1> Mood mu sedang {mood} </h1>
                    <h2> Rekomendasi menu menyesuaikan mood mu </h2>
                    <div className='recommendationMenuWrapper'>
                        {menuItems.map((menu, key) =>
                        {
                            const category = menu.kategori;
                            const textCategory = category.replace("-", " ");
                            return (
                                <div className='recommendationMenuBox' key={key}>
                                    <img src={publicUrl + "menu/" + menu.gambar} alt='menu' onClick={() => {navigate("/detail-menu/" + menu.idMenu)}} />
                                    <button onClick={() => handleBeliSekarang(menu.idMenu)}> Beli Sekarang </button>
                                    <p className='menuName'> {menu.namaMenu} </p>
                                    <p className='category'> {capitalizeWords(textCategory)} </p>
                                    <p className='price'> {formatRupiah(menu.harga)} </p>
                                    <div className='mobileMenuPricing'>
                                        <p> {formatNumber(menu.harga)} </p>
                                    <img src={Cart} alt='cart' onClick={() => handleBeliSekarang(menu.idMenu)} />
                                </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Recommendation
