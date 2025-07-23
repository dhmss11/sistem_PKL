'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ToastNotifier from '@/app/components/ToastNotifier';

const JenisGudangPage = () => {
  const toastRef = useRef(null);
  const [jenisGudang, setJenisGudang] = useState([]);
  const [jumlahMap, setJumlahMap] = useState({});
  const [loading, setLoading] = useState(false);

  const staticData = [
    { nama: 'baku', keterangan: 'Bahan baku awal' },
    { nama: 'mentah', keterangan: 'Belum siap edar' },
    { nama: 'transit', keterangan: 'Gudang perantara' },
  ];

const fetchJumlah = async () => {
  setLoading(true);
  try {
    const promises = staticData.map(async ({ nama }) => {
      const res = await fetch(`/api/jenis-gudang/jumlah/${nama}`);
      const json = await res.json();
      if (json.status === '00') {
        return { jenis: nama, jumlah: json.jumlah || 0 };
      } else {
        toastRef.current?.showToast(json.status, json.message);
        return { jenis: nama, jumlah: 0 };
      }
    });

    const results = await Promise.all(promises);
    const map = {};
    results.forEach(({ jenis, jumlah }) => {
      map[jenis] = jumlah;
    });
    setJumlahMap(map);
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
        <Column field="nama" header="Jenis Gudang" />
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
