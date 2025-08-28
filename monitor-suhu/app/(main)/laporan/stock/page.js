'use client';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ToastNotifier from '@/app/components/ToastNotifier';

const LaporanStock = () => {
  const toastRef = useRef(null);
  const [dataLaporan, setDataLaporan] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stock');
      const json = await res.json();
      if (json.status === '00') {
        const grouped = {};
        json.data.forEach(item => {
          const key = `${item.KODE}-${item.GUDANG}`;
          if (!grouped[key]) {
            grouped[key] = {
              KODE: item.KODE,
              NAMA: item.NAMA || item.KODE, 
              GUDANG: item.GUDANG,
              BARCODE:item.BARCODE,
              SATUAN: item.SATUAN,
              SISA: 0
            };
          }
          let qty = Number(item.QTY) || 0;
          if (item.STATUS === 'MASUK') grouped[key].SISA += qty;
          if (item.STATUS === 'KELUAR') grouped[key].SISA -= qty;
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
    fetchLaporan();
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Laporan Sisa Stok</h3>
      <Button label="Refresh" icon="pi pi-refresh" className="mb-3" onClick={fetchLaporan} />

      <DataTable value={dataLaporan} paginator rows={10} loading={loading} stripedRows>
        <Column field="KODE" header="Kode Produk" />
        <Column field="NAMA" header="Nama Produk" />
        <Column field="GUDANG" header="Gudang" />
        <Column field='BARCODE' header='Barcode'/>
        <Column field="SISA" header="Sisa Stock" />
        <Column field='SATUAN' header='Satuan'/>       

      </DataTable>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default LaporanStock;
