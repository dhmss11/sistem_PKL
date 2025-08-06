'use client';

import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

export default function MasterImportPage() {
    const [Import, setImport] = useState([]); 
  const [dataImport, setDataImport] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImportData = async () => {
    try {
      const res = await fetch('/api/import');
      const json = await res.json();
      setDataImport(json.data || []);
    } catch (err) {
      console.error('Gagal ambil data import:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImportData();
  }, []);

  return (
    <div className="p-4">
      <Toast />
      <h2 className="text-xl font-bold mb-4">Terima Barang</h2>

      <DataTable
        size='small'
        className='text-sm'
        value={Import}
        paginator
        rows={10}
        // loading={isLoading}
        scrollable
    >
        <Column field="faktur" header="FAKTUR" />
        <Column field="faktur_kirim" header="FAKTUR_KIRIM" />
        <Column field="tgl" header="TGL" />
        <Column field="gudang_terima" header="GUDANG_TERIMA" />
        <Column field="gudang_kirim" header="GUDANG_KIRIM" />
        <Column field="kode" header="KODE" />
        <Column field="qty" header="QTY" />
        <Column field="satuan" header="SATUAN" />
        <Column field="username" header="USERNAME" />
      </DataTable>
    </div>
  );
}
