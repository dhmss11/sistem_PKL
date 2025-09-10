'use client';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ToastNotifier from '@/app/components/ToastNotifier';

const LaporanMutasiGudang = () => {
  const toastRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
          try {
            const response = await fetch("/api/mutasi/export", {
              method: 'GET',
            })
            if (!response.ok) {
              throw new Error("Gagal Download Laporan")
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'laporan_mutasi_gudang.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          } catch (error) {
            toastRef.current?.showToast('99', 'Terjadi Kesalahan pada saat Download')
          };
        };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/laporanmutasi');
      const json = await res.json();

      if (json.status === '00') {
        const rows = Array.isArray(json.data) ? json.data
        : Array.isArray(json.data?.rows) ? json.data.rows
        : [];
        setData(rows);
      } else {
        toastRef.current?.showToast(json.status, json.message);
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Gagal mengambil data Laporan');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Laporan Mutasi Gudang</h3>
      <Button label="Refresh" icon="pi pi-refresh" className="mb-3" onClick={fetchData} />
      <h3 className="text-xl font-semibold mb-4">Laporan Mutasi Barang</h3>
      <Button label="Refresh" icon="pi pi-refresh" className="mb-3" onClick={fetchLaporanMutasi} />
      <Button label="Download Laporan" icon="pi pi-download" className='mb-3 ml-3' onClick={handleDownload}/>

      <DataTable value={data} paginator rows={10} loading={loading} stripedRows>
        <Column field="POSTING" header="POSTING" />
        <Column field="FAKTUR" header="FAKTUR" />
        <Column field="DARI" header="DARI GUDANG" />
        <Column field="KE" header="KE GUDANG" />
        <Column field='BARCODE' header='BARCODE'/>
        <Column field="QTY" header="QTY" />
      </DataTable>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default LaporanMutasiGudang;
