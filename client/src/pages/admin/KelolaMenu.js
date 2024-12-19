import React from 'react'
import AdminHeader from '../../components/admin/AdminHeader';
import Sidebar from '../../components/admin/Sidebar';
import KelolaMenuSection from '../../components/admin/KelolaMenuSection';

function KelolaMenu() 
{
    return (
        <div>
            <AdminHeader />
            <KelolaMenuSection />
            <Sidebar />
        </div>
    )
}

export default KelolaMenu
