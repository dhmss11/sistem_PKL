'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ToastNotifier from '@/app/components/ToastNotifier';

/**
 * Komponen tampilan daftar jenis gudang tanpa aksi tambah/edit/hapus.
 * Data hardcoded dari frontend.
 */
const JenisGudangPage = () => {
  const toastRef = useRef(null);
  const [jenisGudang, setJenisGudang] = useState([]);
  const [jumlahMap, setJumlahMap] = useState({});
  const [loading, setLoading] = useState(false);

  // Data tetap dari frontend
  const staticData = [
    { nama: 'Baku', keterangan: 'Bahan baku awal' },
    { nama: 'Mentah', keterangan: 'Belum siap edar' },
    { nama: 'Transit', keterangan: 'Gudang perantara' },
  ];

  const fetchJumlah = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/nama-gudang/jumlah-per-jenis'); // Endpoint harus kamu siapkan
      const json = await res.json();
      if (json.status === '00') {
        setJumlahMap(json.data); // misal: { Baku: 20, Mentah: 15, Transit: 8 }
      } else {
        toastRef.current?.showToast(json.status, json.message);
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Gagal mengambil jumlah gudang');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setJenisGudang(staticData);
    fetchJumlah();
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Master Jenis Gudang</h3>

      <DataTable
        value={jenisGudang}
        loading={loading}
        size="small"
        scrollable
        className="text-sm"
      >
        <Column field="nama" header="Jenis" />
        <Column field="keterangan" header="Keterangan" />
        <Column
          header="Jumlah Gudang"
          body={(row) => jumlahMap[row.nama] ?? 0}
        />
        <Column
          header="Aksi"
          body={(row) => (
            <Button
              label="Lihat Gudang"
              icon="pi pi-search"
              size="small"
              onClick={() => {
                // Navigasi ke halaman nama gudang by jenis
                window.location.href = `/master/nama-gudang?jenis=${row.nama}`;
              }}
            />
          )}
        />
      </DataTable>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default JenisGudangPage;
