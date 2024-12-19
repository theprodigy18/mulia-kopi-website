import axios from 'axios';
import React, { useEffect, useState } from 'react'

function LaporanSection() {
    const thisDay = new Date();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [totalTransaksiToday, setTotalTransaksiToday] = useState(0);
    const [pemasukanToday, setPemasukanToday] = useState(0);
    const [totalTransaksiYesterday, setTotalTransaksiYesterday] = useState(0);
    const [pemasukanYesterday, setPemasukanYesterday] = useState(0);

    useEffect(() => {
        async function fetchingData() {
            const yesterday = new Date(thisDay); // Membuat salinan objek Date
            yesterday.setDate(thisDay.getDate() - 1);

            const transaksiToday = await axios.get(`${apiUrl}riwayatTransaksi/byDate/${thisDay}`);

            setTotalTransaksiToday(transaksiToday.data.length);

            const sumTotalHarga = transaksiToday.data.reduce((total, transaksi) => total + transaksi.totalHarga, 0);
            setPemasukanToday(sumTotalHarga);

            const transaksiYesterday = await axios.get(`${apiUrl}riwayatTransaksi/byDate/${yesterday}`);

            setTotalTransaksiYesterday(transaksiYesterday.data.length);

            const sumTotalHargaYesterday = transaksiYesterday.data.reduce((total, transaksi) => total + transaksi.totalHarga, 0);
            setPemasukanYesterday(sumTotalHargaYesterday);
        }

        fetchingData();
    }, [apiUrl]);

    const formatTanggal = (date) => {
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

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    return (
        <div className='laporanSectionContainer'>
            <h1> Laporan Harian </h1>
            <h2> {formatTanggal(thisDay)} </h2>
            <div className='laporanList'>
                <div className='laporanItem'>
                    <i className="fa-solid fa-dollar-sign"></i>
                    <div className='laporanDescription'>
                        <h1> Pemasukan hari ini </h1>
                        <p> {formatRupiah(pemasukanToday)} </p>
                    </div>
                </div>
                <div className='laporanItem'>
                    <i className="fa-solid fa-book"></i>
                    <div className='laporanDescription'>
                        <h1> Jumlah transaksi </h1>
                        <p> {totalTransaksiToday} struk tercetak </p>
                    </div>
                </div>
            </div>

            {pemasukanYesterday > 0 ? (
                <div className='statistikContainer'>
                    <h1> Statistik </h1>
                    <div className='statistikItem'>
                        <h1> Pemasukan </h1>
                        <div className='statistikBox'>
                            <h1> Pemasukan hari kemarin </h1>
                            <p> {formatRupiah(pemasukanYesterday)} </p>
                            {pemasukanToday > pemasukanYesterday ? (
                                <span style={{ color: "#16ff16" }}> Pemasukan hari ini naik {parseInt(((pemasukanToday - pemasukanYesterday) / pemasukanYesterday) * 100)}% <br /> + {formatRupiah(pemasukanToday - pemasukanYesterday)} </span>
                            ) : (
                                <span style={pemasukanToday < pemasukanYesterday ? { color: "#9c0000" } : { color: "white" }}>
                                    {pemasukanToday < pemasukanYesterday ? (
                                        <>
                                            Pemasukan hari ini turun {parseInt(((pemasukanYesterday - pemasukanToday) / pemasukanYesterday) * 100)}%
                                            <br />
                                            - {formatRupiah(pemasukanYesterday - pemasukanToday)}
                                        </>
                                    ) : (
                                        <>Pemasukan hari ini tidak berubah</>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='statistikItem'>
                        <h1> Transaksi </h1>
                        <div className='statistikBox'>
                            <h1> Transaksi hari kemarin </h1>
                            <p> {totalTransaksiYesterday} struk tercetak </p>
                            {totalTransaksiToday > totalTransaksiYesterday ? (
                                <span style={{ color: "#16ff16" }}> Transaksi hari ini naik {parseInt(((totalTransaksiToday - totalTransaksiYesterday) / totalTransaksiYesterday) * 100)}% <br /> + {totalTransaksiToday - totalTransaksiYesterday} struk </span>
                            ) : (
                                <span style={totalTransaksiToday < totalTransaksiYesterday ? { color: "#9c0000" } : { color: "white" }}>
                                    {totalTransaksiToday < totalTransaksiYesterday ? (
                                        <>
                                            Transaksi hari ini turun {parseInt(((totalTransaksiYesterday - totalTransaksiToday) / totalTransaksiYesterday) * 100)}%
                                            <br />
                                            - {totalTransaksiYesterday - totalTransaksiToday} struk
                                        </>
                                    ) : (
                                        <> Transaksi hari ini tidak berubah </>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className='statistikContainer'>
                    <h1> Tidak Ada Transaksi Hari Kemarin </h1>
                </div>
            )}
        </div>
    )
}

export default LaporanSection
