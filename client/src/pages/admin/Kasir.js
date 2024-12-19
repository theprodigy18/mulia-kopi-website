import React from 'react'
import AdminHeader from '../../components/admin/AdminHeader'
import Sidebar from '../../components/admin/Sidebar'
import KasirSection from '../../components/admin/KasirSection'

function Kasir() {
    return (
        <div>
            <AdminHeader />
            <Sidebar />
            <KasirSection />
        </div>
    )
}

export default Kasir
