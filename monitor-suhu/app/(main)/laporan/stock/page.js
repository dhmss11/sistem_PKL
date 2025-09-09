'use client';
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import ToastNotifier from '@/app/components/ToastNotifier';

const LaporanStock = () => {
  const toastRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

   const handleDownload = async () => {
          try {
            const response = await fetch("/api/stock/export", {
              method: 'GET',
            })
            if (!response.ok) {
              throw new Error("Gagal Download Laporan")
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'laporan_stock.xlsx');
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
      const res = await fetch('/api/laporanstock');
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
      <h3 className="text-xl font-semibold mb-4">Laporan Sisa Stok</h3>
      <Button label="Refresh" icon="pi pi-refresh" className="mb-3" onClick={fetchData} />
      <Button label="Download Laporan"  icon="pi pi-download" className='mb-3 ml-3' onClick={handleDownload}/>

      <DataTable value={data} paginator rows={10} loading={loading}>
        <Column field="KODE" header="KODE" />
        <Column field="NAMA" header="NAMA" />
        <Column field="GUDANG" header="GUDANG" />
        <Column field='BARCODE' header='BARCODE'/>
        <Column field="QTY" header="QTY" />
        <Column field='SATUAN' header='SATUAN'/>       

      </DataTable>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default LaporanStock;
