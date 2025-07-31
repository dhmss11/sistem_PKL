'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import ToastNotifier from '@/app/components/ToastNotifier';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';


export default function GolonganStokPage() {
  const toastRef = useRef();
  const [golongan, setGolongan] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({ KODE: '', KETERANGAN: '' });
  const [dialogMode, setDialogMode] = useState('add'); // 'add' | 'edit'


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

    const handleSubmit = async () => {
    try {
      const res = await fetch('/api/golonganstock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        KODE: form.KODE,               // gunakan huruf besar (sesuai schema!)
        KETERANGAN: form.KETERANGAN,

      }),
    });


      const json = await res.json();
      toastRef.current?.showToast(json.status, json.message);

      if (json.status === '00') {
        fetchGolongan();
        setDialogVisible(false);
      }
    } catch (error) {
      toastRef.current?.showToast('99', 'Gagal menyimpan data');
    }
  };

    const handleDelete = async (kode) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;

    try {
      const res = await fetch(`/api/golonganstock?id=${kode}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      toastRef.current?.showToast(json.status, json.message);

      if (json.status === '00') {
        fetchGolongan();
      }
    } catch (error) {
      toastRef.current?.showToast('99', 'Gagal menghapus data');
    }
  };

  
const actionButtons = (rowData) => (
  <div className="flex gap-2 justify-center">
    <Button
      icon="pi pi-eye"
      className="p-button-sm p-button-info"
      tooltip="Lihat Gudang"
      onClick={() => router.push(`/master/gudang?keterangan=${encodeURIComponent(rowData.keterangan)}`)}
    />
    <Button
      icon="pi pi-pencil"
      className="p-button-sm p-button-warning"
      tooltip="Edit"
      onClick={() => {
        setForm(rowData);
        setDialogMode('edit');
        setDialogVisible(true);
      }}
    />
    <Button
      icon="pi pi-trash"
      className="p-button-sm p-button-danger"
      tooltip="Hapus"
      onClick={() => handleDelete(rowData.kode)}
    />
  </div>
);


  return (
    
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Data Golongan Stok</h2>
      <Button
          label="Tambah Golongan"
          icon="pi pi-plus"
          className="mb-3"
          onClick={() => {
            setForm({ KODE : '', KETERANGAN: '' });
            setDialogMode('add');
            setDialogVisible(true);
          }}
        />

      <DataTable
        value={golongan}
        rowKey="KODE"
        loading={loading}
        paginator
        rows={10}
        stripedRows
        emptyMessage="Tidak ada data"
        scrollable
      >
        <Column field="KODE" header="Kode" style={{ minWidth: '100px' }} />
        <Column field="KETERANGAN" header="Nama Golongan" style={{ minWidth: '200px' }} />
        <Column
          header="Aksi"
          body={actionButtons}
          style={{ minWidth: '200px', textAlign: 'center' }}
        />
      </DataTable>

      <ToastNotifier ref={toastRef} />

<Dialog
  header={dialogMode === 'edit' ? 'Edit Golongan Stok' : 'Tambah Golongan Stok'}
  visible={dialogVisible}
  onHide={() => setDialogVisible(false)}
  style={{ width: '40rem' }}
  modal
>
 <div className="w-full">
  <div className="flex flex-col gap-y-4 w-full">
    <div className="w-full">
      <label htmlFor="kode" className="block mb-1 font-medium">Kode</label>
      <InputText
        id="kode"
        value={form.kode}
        onChange={(e) => setForm({ ...form, kode: e.target.value })}
        className="w-full"
      />
    </div>
    <div className="w-full gap-y-4">
      <label htmlFor="keterangan" className="block mb-1 font-medium">Keterangan</label>
      <InputText
        id="keterangan"
        value={form.keterangan}
        onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
        className="w-full"
      />
    </div>
  </div>
</div>



          <div className="flex justify-end gap-2 mt-4">
            <Button label="Batal" onClick={() => setDialogVisible(false)} />
            <Button label="Simpan" onClick={handleSubmit} />
          </div>
        </Dialog>

    </div>
  );
}
