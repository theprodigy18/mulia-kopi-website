import React, { useEffect, useState } from 'react'
import AdminHeader from '../../components/admin/AdminHeader'
import Sidebar from '../../components/admin/Sidebar'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";

function EditMenu() 
{
    const publicUrl = process.env.PUBLIC_URL + "/images/menu/";
    let idMenu = useParams().idMenu;
    let navigate = useNavigate();
    const [menu, setMenu] = useState({});
    const [prevGambar, setPrevGambar] = useState(null);
    const [gambar, setGambar] = useState(null);
    const [doneRender, setDoneRender] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() =>
    {
        async function fetchingData()
        {
            const response = await axios.get(`${apiUrl}daftarMenu/byId/${idMenu}`);
            if (response.data) 
            {
                setMenu(response.data);

                const image = await fetch(publicUrl + response.data.gambar);
                const blob = await image.blob();
                const file = new File([blob], response.data.gambar, { type: blob.type });

                setPrevGambar(file);
                setGambar(file);
                
                setDoneRender(true);
            }
            else 
            {
                navigate("/admin/kelola-menu");
            }
        }

        fetchingData();

    }, [idMenu, navigate, publicUrl, apiUrl]);

    const initialValues =
    {
        kategori: menu.kategori,
        namaMenu: menu.namaMenu,
        gambar: gambar,
        detailMenu: menu.detailMenu,
        harga: menu.harga,
        stok: menu.stok
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

        const update = await axios.post(`${apiUrl}daftarMenu/update/${idMenu}`, 
        {
            namaMenu: data.namaMenu,
            gambar: data.gambar.name,
            detailMenu: data.detailMenu,
            harga: data.harga,
            stok: data.stok
        });

        if (!update.data.error)
        {
            if (prevGambar !== gambar)
            {
                const deleteGambar = await axios.post(`${apiUrl}uploadGambar/menu/delete`,
                {
                    fileUrl: "menu/" + prevGambar.name
                })

                if (!deleteGambar.data.error)
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
                    else
                    {
                        console.log(upload.data.error);
                    }
                }
                else
                {
                    console.log(deleteGambar.data.error);
                }
            }
            else
            {
                setSuccess(true);
            }
        }
        else
        {
            console.log(update.data.error);
        }

        setLoading(false);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const newFileName = Date.now() + "_" + file.name; // Nama baru yang ingin Anda gunakan

        // Anda bisa menyimpan file dengan nama baru dalam state
        const renamedFile = new File([file], newFileName, { type: file.type });

        return renamedFile;
    };

    return (
        <div>
            <AdminHeader />
            <Sidebar />
            {loading && (
                <div className='successModal'>
                    <div className='loading'></div>
                </div>
            )}
            <div className='actionOnMenuContainer'>
                {success && (
                    <div className='successModal'>
                        <div className='successBox'>
                            <p> Berhasil Edit Menu </p>
                            <button onClick={() => navigate("/admin/kelola-menu")}> Kembali </button>
                        </div>
                    </div>
                )}
                {doneRender && (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ setFieldValue }) => (
                            <Form className='formMenu'>
                                <h1> {menu.namaMenu} </h1>
                                <ErrorMessage name='kategori' component="span" className='errMessage' />
                                <div className='formInputContainer'>
                                    <label> Kategori </label>
                                    <Field as="select" name="kategori" className="formInput" onChange={(e) => setFieldValue("kategori", e.target.value)} disabled>
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
                )}
            </div>
        </div>
    )
}

export default EditMenu
