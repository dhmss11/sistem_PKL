'use client';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { useAuth } from '../(auth)/context/authContext';
import { Toast } from 'primereact/toast';

const DashboardDudiAdmin = () => {
    const toast = useRef(null);
    const { layoutConfig } = useContext(LayoutContext);
    const { user, loading, initialized } = useAuth();

    const [stats, setStats] = useState({
        totalSiswa: 0,
        dudiPartner: 0,
        siswaMagang: 0,
        logbookHariIni: 0
    });
    const [magangTerbaru, setMagangTerbaru] = useState([]);
    const [dudiAktif, setDudiAktif] = useState([]);
    const [logbookTerbaru, setLogbookTerbaru] = useState([]);
    const [loadingDashboard, setLoadingDashboard] = useState(false);
    const [summary, setSummary] = useState({
    total: 0,
    aktif: 0,
    tidak: 0,
    siswa: 0
});

const fetchDashboardSummary = async () => {
    try {
        const res = await fetch('/api/dudi/admin/dashboard-summary');
        const json = await res.json();

        if (res.ok) {
            setSummary(json.data);
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: json.message || 'Gagal memuat summary DUDI',
                life: 3000
            });
        }
    } catch (err) {
        console.error(err);
        toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal memuat summary DUDI',
            life: 3000
        });
    }
};


    // Fetch dashboard data
    const fetchDashboard = async () => {
        try {
            setLoadingDashboard(true);
            const res = await fetch('/api/dudi/admin/dashboard');
            const json = await res.json();

            if (res.ok) {
                setStats(json.data.stats || {});
                setMagangTerbaru(json.data.magangTerbaru || []);
                setDudiAktif(json.data.dudiAktif || []);
                setLogbookTerbaru(json.data.logbookTerbaru || []);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: json.message || 'Gagal memuat dashboard', life: 3000 });
            }
        } catch (error) {
            console.error('Fetch dashboard DUDI error:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat dashboard', life: 3000 });
        } finally {
            setLoadingDashboard(false);
        }
    };

    useEffect(() => {
        fetchDashboardSummary();
        fetchDashboard();
    }, []);

    if (!initialized || loading) {
        return (
            <div className="flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                    <p className="mt-3">Loading Dashboard...</p>
                    <small className="text-500">
                        Initialized: {initialized ? 'Yes' : 'No'} | 
                        Loading: {loading ? 'Yes' : 'No'} | 
                        Name: {user?.name || 'None'}
                    </small>
                </div>
            </div>
        );
    }

    if (initialized && !loading && !user) {
        return (
            <div className="flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <p className="text-500">Redirecting to login</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Toast ref={toast} />

            <h1 className="text-2xl font-bold mb-6">Dashboard DUDI Admin</h1>

            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px] p-4 rounded-2xl shadow bg-white">
                    <p className="text-gray-500">Total DUDI</p>
                    <h3 className="text-2xl font-bold">{summary.total}</h3>
                </div>
                <div className="flex-1 min-w-[200px] p-4 rounded-2xl shadow bg-white">
                    <p className="text-gray-500">DUDI Aktif</p>
                    <h3 className="text-2xl font-bold text-green-600">{summary.aktif}</h3>
                </div>
                <div className="flex-1 min-w-[200px] p-4 rounded-2xl shadow bg-white">
                    <p className="text-gray-500">DUDI Tidak Aktif</p>
                    <h3 className="text-2xl font-bold text-red-500">{summary.tidak}</h3>
                </div>
                <div className="flex-1 min-w-[200px] p-4 rounded-2xl shadow bg-white">
                    <p className="text-gray-500">Total Siswa Magang</p>
                    <h3 className="text-2xl font-bold text-blue-600">{summary.siswa}</h3>
                </div>
            </div>

            {/* Magang Terbaru */}
            <div className="bg-white p-4 rounded-2xl shadow mb-4">
                <h3 className="font-semibold mb-3">Magang Terbaru</h3>
                {Array.isArray(magangTerbaru) && magangTerbaru.length > 0 ? (
                    magangTerbaru.map((item, idx) => (
                        <div key={idx} className="border-b last:border-b-0 py-2 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{item.siswa}</p>
                                <p className="text-gray-500 text-sm">{item.perusahaan}</p>
                                <p className="text-gray-400 text-xs">{item.tanggalMulai} - {item.tanggalSelesai}</p>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {item.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm">Belum ada data magang terbaru</p>
                )}
            </div>

            {/* DUDI Aktif */}
            <div className="bg-white p-4 rounded-2xl shadow mb-4">
                <h3 className="font-semibold mb-3">DUDI Aktif</h3>
                {Array.isArray(dudiAktif) && dudiAktif.length > 0 ? (
                    dudiAktif.map((item, idx) => (
                        <div key={idx} className="border-b last:border-b-0 py-2">
                            <p className="font-semibold">{item.nama}</p>
                            <p className="text-gray-500 text-sm">{item.alamat}</p>
                            <p className="text-gray-400 text-xs">{item.tlpn}</p>
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">{item.jumlah_siswa} siswa</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm">Belum ada DUDI aktif</p>
                )}
            </div>

            {/* Logbook Terbaru */}
            <div className="bg-white p-4 rounded-2xl shadow">
                <h3 className="font-semibold mb-3">Logbook Terbaru</h3>
                {Array.isArray(logbookTerbaru) && logbookTerbaru.length > 0 ? (
                    logbookTerbaru.map((item, idx) => (
                        <div key={idx} className="border-b last:border-b-0 py-2">
                            <p className="font-semibold">{item.judul}</p>
                            <p className="text-gray-500 text-sm">{item.tanggal}</p>
                            <p className="text-gray-400 text-xs">{item.kendala}</p>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full 
                                ${item.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 
                                  item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {item.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm">Belum ada logbook terbaru</p>
                )}
            </div>

            {loadingDashboard && (
                <div className="mt-4 text-center text-gray-500">Memuat data dashboard...</div>
            )}
        </div>
    );
};

export default DashboardDudiAdmin;
