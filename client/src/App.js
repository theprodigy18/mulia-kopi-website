import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from './pages/Menu';
import MenuMobile from './pages/MenuMobile';
import DetailMenu from './pages/DetailMenu';
import MoodDetection from './pages/MoodDetection';
import Recommendation from './pages/Recommendation';
import Kasir from './pages/admin/Kasir';
import PesananOnline from './pages/admin/PesananOnline';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyAccount from './pages/VerifyAccount';
import LoginAdmin from './pages/admin/LoginAdmin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import WelcomeUser from './pages/WelcomeUser';
import { RefreshUseEffectProvider } from './components/RefreshUseEffect';
import Struk from './pages/admin/Struk';
import RiwayatTransaksi from './pages/admin/RiwayatTransaksi';
import StrukOnline from './pages/StrukOnline';
import KelolaMenu from './pages/admin/KelolaMenu';
import TambahMenu from './pages/admin/TambahMenu';
import EditMenu from './pages/admin/EditMenu';
import DetailMenuAdmin from './pages/admin/DetailMenuAdmin';
import LupaPassword from './pages/LupaPassword';
import GantiPassword from './pages/GantiPassword';
import LaporanHarian from './pages/admin/LaporanHarian';

function App() 
{
    return (
        <RefreshUseEffectProvider className="App">
            <Router>
                <Routes>
                    <Route path="/muliakopi/" element={<Home />} />
                    <Route path='/muliakopi/menu/:category' element={<Menu />} />
                    <Route path='/muliakopi/menu-mobile/:category' element={<MenuMobile />} />
                    <Route path='/muliakopi/detail-menu/:idMenu' element={<DetailMenu />} />
                    <Route path="/muliakopi/mood-detection" element={<MoodDetection />} />
                    <Route path='/muliakopi/recommendation/:idScan' element={<Recommendation />} />
                    <Route path='/muliakopi/register' element={<Register />} />
                    <Route path='/muliakopi/login' element={<Login />} />
                    <Route path='/muliakopi/verify/:email/:token' element={<VerifyAccount />} />
                    <Route path='/muliakopi/welcome' element={<WelcomeUser />} />
                    <Route path='/muliakopi/struk/:idPesanan' element={<StrukOnline />} />
                    <Route path='/muliakopi/lupa-password' element={<LupaPassword />} />
                    <Route path='/muliakopi/verify/lupa-password/:email/:token' element={<GantiPassword />} />

                    {/* Route Admin */}
                    <Route path='/muliakopi/admin/login' element={<LoginAdmin />} />
                    <Route path='/muliakopi/admin/kasir' element={<ProtectedRoute element={<Kasir />} />} />
                    <Route path="/muliakopi/admin/po" element={<ProtectedRoute element={<PesananOnline />} />} /> 
                    <Route path='/muliakopi/admin/riwayat' element={<ProtectedRoute element={<RiwayatTransaksi />} />} />
                    <Route path='/muliakopi/admin/struk/:idTransaksi' element={<ProtectedRoute element={<Struk />} />} />
                    <Route path='/muliakopi/admin/kelola-menu' element={<ProtectedRoute element={<KelolaMenu />} />} />
                    <Route path='/muliakopi/admin/tambah-menu' element={<ProtectedRoute element={<TambahMenu />} />} />
                    <Route path='/muliakopi/admin/edit-menu/:idMenu' element={<ProtectedRoute element={<EditMenu />} />} />
                    <Route path='/muliakopi/admin/detail-menu/:idMenu' element={<ProtectedRoute element={<DetailMenuAdmin />} />} />
                    <Route path='/muliakopi/admin/laporan-harian' element={<ProtectedRoute element={<LaporanHarian />} />} />
                </Routes>
            </Router>
        </RefreshUseEffectProvider>
    );
}

export default App;
