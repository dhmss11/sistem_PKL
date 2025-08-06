'use client';

import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const StockSatuanPage = () => {
  const [satuan, setSatuan] = useState('');
  const [dataStock, setDataStock] = useState([]);
  const toast = useRef(null);

  const handleFetchStock = async () => {
    if (!satuan) {
      toast.current.show({ severity: 'warn', summary: 'Satuan kosong', detail: 'Masukkan satuan terlebih dahulu' });
      return;
    }

    try {
      const res = await fetch(`/api/stock/satuan/${satuan}`);
      const json = await res.json();

      if (json.status === '00') {
        setDataStock(json.data);
        toast.current.show({ severity: 'success', summary: 'Sukses', detail: 'Data stock berhasil dimuat' });
      } else {
        toast.current.show({ severity: 'error', summary: 'Gagal', detail: json.message });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat mengambil data' });
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="mb-4 flex gap-2 items-end">
        <div className="flex flex-col">
          <label htmlFor="satuan">Satuan</label>
          <InputText id="satuan" value={satuan} onChange={(e) => setSatuan(e.target.value)} placeholder="Contoh: Kg" />
        </div>
        <Button label="Cari" icon="pi pi-search" onClick={handleFetchStock} />
      </div>

      <DataTable value={dataStock} paginator rows={10} className="p-datatable-sm shadow-md">
        <Column field="id" header="ID" />
        <Column field="nama" header="Nama" />
        <Column field="jenis" header="Jenis" />
        <Column field="satuan" header="Satuan" />
        <Column field="stok" header="Stok" />
      </DataTable>
    </div>
  );
};

export default StockSatuanPage;
