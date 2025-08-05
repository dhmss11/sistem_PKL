'use client';

import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

export default function MasterExportPage() {
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExportData = async () => {
    try {
      const res = await fetch('/api/export');
      const json = await res.json();
      setExportData(json.data || []);
    } catch (err) {
      console.error('Gagal ambil data export:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExportData();
  }, []);

  return (
    <div className="p-4">
      <Toast />
      <h2 className="text-xl font-bold mb-4">Export Gudang</h2>

      <DataTable
        size="small"
        className="text-sm"
        value={exportData}
        paginator
        rows={10}
        loading={loading}
        scrollable
      >
        <Column field="FAKTUR" header="FAKTUR" />
        <Column field="TGL" header="TGL" />
        <Column field="GUDANG_KIRIM" header="GUDANG_KIRIM" />
        <Column field="GUDANG_TERIMA" header="GUDANG_TERIMA" />
        <Column field="KODE" header="KODE" />
        <Column field="QTY" header="QTY" />
        <Column field="SATUAN" header="SATUAN" />
        <Column field="USERNAME" header="USERNAME" />
        <Column field="DATETIME" header="DATETIME" />
        <Column field="STATUS" header="STATUS" />
      </DataTable>
    </div>
  );
}
