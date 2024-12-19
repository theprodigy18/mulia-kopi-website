import React, { useState } from 'react'
import AdminHeader from '../../components/admin/AdminHeader'
import Sidebar from '../../components/admin/Sidebar'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from "yup";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TambahMenu() 
{
    let navigate = useNavigate();
    const [gambar, setGambar] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const newFileName = Date.now() + "_" + file.name; // Nama baru yang ingin Anda gunakan

        // Anda bisa menyimpan file dengan nama baru dalam state
        const renamedFile = new File([file], newFileName, { type: file.type });

        return renamedFile;
    };

    const initialValues =
    {
        kategori: "",
        namaMenu: "",
        gambar: null,
        detailMenu: "",
        harga: 0,
        stok: 0
    }

    const validationSchema = Yup.object().shape(
        {
            kategori: Yup.string().required("*Required"),
            namaMenu: Yup.string().required("*Required"),
            gambar: Yup.mixed()
                .required('*Required')
                .test(
                    'fileType',
                    '*File yang diunggah harus berupa gambar',
                    (value) => value && value.type.startsWith('image/')
                ),
            detailMenu: Yup.string().required("*Required"),
            harga: Yup.number().min(1000, "*Harga minimal 1000").required("*Required"),
            stok: Yup.number().min(1, "*Stok minimal 1").required("*Required")
        });

    const onSubmit = async (data) => 
    {
        setLoading(true);

        await delay(1000);
        const menu = await axios.post(`${apiUrl}daftarMenu`, 
        {
            kategori: data.kategori,
            namaMenu: data.namaMenu,
            gambar: data.gambar.name,
            detailMenu: data.detailMenu,
            harga: data.harga,
            stok: data.stok
        });

        if (menu.data.alreadyExist)
        {
            console.log("Menu already exists");
        }
        else
        {
            const formData = new FormData();
            formData.append("gambar", data.gambar);

            const upload = await axios.post(`${apiUrl}uploadGambar/menu`, formData,
            {
                headers:
                {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (!upload.data.error)
            {
                setSuccess(true);
            }
        }

        setLoading(false);
    }


    return (
        <div>
            <AdminHeader />
            <Sidebar />
            {loading && (
                <div className='successModal'>
                    <div className='loading'></div>
                </div>
            )}
            {success && (
                <div className='successModal'>
                    <div className='successBox'>
                        <p> Berhasil Menambahkan Menu </p>
                        <button onClick={() => navigate("/admin/kelola-menu")}> Kembali </button>
                    </div>
                </div>
            )}
            <div className='actionOnMenuContainer'>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form className='formMenu'>
                            <h1> Tambah Menu </h1>
                            <ErrorMessage name='kategori' component="span" className='errMessage' />
                            <div className='formInputContainer'>
                                <label> Kategori </label>
                                <Field as="select" name="kategori" className="formInput">
                                    <option value=""> Pilih Kategori </option>
                                    <option value="kopi"> Kopi </option>
                                    <option value="non-kopi"> Non Kopi </option>
                                    <option value="makanan"> Makanan </option>
                                </Field>
                            </div>
                            <ErrorMessage name='namaMenu' component="span" className='errMessage' />
                            <div className='formInputContainer'>
                                <label> Nama Menu </label>
                                <Field type="text" name="namaMenu" className="formInput" />
                            </div>
                            <ErrorMessage name='gambar' component="span" className='errMessage' />
                            {gambar && (
                                <img src={URL.createObjectURL(gambar)} alt="Gambar" className="gambarPreview" />
                            )}
                            <div className='formInputContainer'>
                                <label> Gambar </label>
                                <input
                                    type="file"
                                    name="gambar"
                                    accept="image/*"
                                    className="formInput"
                                    onChange={(e) => {
                                        setGambar(e.target.files[0]);
                                        const newFile = handleFileChange(e);
                                        setFieldValue("gambar", newFile);
                                    }}
                                />
                            </div>
                            <ErrorMessage name='detailMenu' component="span" className='errMessage' />
                            <div className='formInputContainer'>
                                <label> Detail Menu </label>
                                <Field type="text" name="detailMenu" className="formInput" />
                            </div>
                            <ErrorMessage name='harga' component="span" className='errMessage' />
                            <div className='formInputContainer'>
                                <label> Harga </label>
                                <Field type="number" name="harga" className="formInput" />
                            </div>
                            <ErrorMessage name='stok' component="span" className='errMessage' />
                            <div className='formInputContainer'>
                                <label> Stok </label>
                                <Field type="number" name="stok" className="formInput" />
                            </div>

                            <div className='submitContainer'>
                                <button type='submit'> Simpan Menu </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default TambahMenu
