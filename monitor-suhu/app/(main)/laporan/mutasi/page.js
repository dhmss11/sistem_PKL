'use client';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ToastNotifier from '@/app/components/ToastNotifier';

const LaporanMutasiGudang = () => {
  const toastRef = useRef(null);
  const [dataLaporan, setDataLaporan] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLaporanMutasi = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mutasi');
      const json = await res.json();
      if (json.status === '00') {
        const grouped = {};
        json.data.forEach(item => {
          const key = `${item.POSTING}-${item.FAKTUR}`;
          if (!grouped[key]) {
            grouped[key] = {
              POSTING: item.POSTING,
              FAKTUR: item.FAKTUR, 
              BARCODE:item.BARCODE,
              GUDANG_KE: item.KE,
              GUDANG_DARI: item.DARI,
              TGL: item.TGL,
              QTY: item.QTY
            };
          }
        });

        setDataLaporan(Object.values(grouped));
      } else {
        toastRef.current?.showToast('99', json.message || 'Gagal memuat laporan stok');
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Terjadi kesalahan mengambil laporan stok');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporanMutasi();
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Laporan Sisa Stok</h3>
      <Button label="Refresh" icon="pi pi-refresh" className="mb-3" onClick={fetchLaporanMutasi} />

      <DataTable value={dataLaporan} paginator rows={10} loading={loading} stripedRows>
        <Column field="POSTING" header="POSTING" />
        <Column field="FAKTUR" header="FAKTUR" />
        <Column field="GUDANG_DARI" header="DARI GUDANG" />
        <Column field="GUDANG_KE" header="KE GUDANG" />
        <Column field='BARCODE' header='BARCODE'/>
        <Column field="QTY" header="QTY" />

      </DataTable>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default LaporanMutasiGudang;
