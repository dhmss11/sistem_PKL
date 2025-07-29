'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import ToastNotifier from '@/app/components/ToastNotifier';

export default function GolonganStokPage() {
  const toastRef = useRef();
  const [golongan, setGolongan] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGolongan();
  }, []);

  const fetchGolongan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/golonganstock');
      const result = await res.json();

      console.log('API response:', result);

      if (result.status === '00' && Array.isArray(result.data)) {
        const normalized = result.data.map(item => ({
          kode: item.KODE,
          keterangan: item.KETERANGAN,
        }));
        setGolongan(normalized);
      } else {
        toastRef.current?.showToast(result.status || '99', result.message || 'Gagal memuat data');
      }
    } catch (error) {
      toastRef.current?.showToast('99', 'Gagal memuat data golongan');
    } finally {
      setLoading(false);
    }
  };

  const lihatGudangButton = (rowData) => (
    <Button
      label="Lihat Gudang"
      icon="pi pi-eye"
      className="p-button-sm"
      onClick={() => router.push(`/master/gudang?keterangan=${encodeURIComponent(rowData.keterangan)}`)}
    />
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Data Golongan Stok</h2>
      <DataTable
        value={golongan}
        rowKey="kode"
        loading={loading}
        paginator
        rows={10}
        stripedRows
        emptyMessage="Tidak ada data"
        scrollable
      >
        <Column field="kode" header="Kode" style={{ minWidth: '100px' }} />
        <Column field="keterangan" header="Nama Golongan" style={{ minWidth: '200px' }} />
        <Column
          header="Aksi"
          body={lihatGudangButton}
          style={{ minWidth: '150px', textAlign: 'center' }}
        />
      </DataTable>

      <ToastNotifier ref={toastRef} />
    </div>
  );
}
