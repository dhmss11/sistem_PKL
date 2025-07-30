'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import ToastNotifier from '@/app/components/ToastNotifier';

const SatuanStockPage = () => {
  const toastRef = useRef(null);
  const [satuanList, setSatuanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState(null); // 'add' atau 'edit'
  const [selectedSatuan, setSelectedSatuan] = useState(null);
  const [form, setForm] = useState({ KODE: '', KETERANGAN: '' });

  useEffect(() => {
    fetchSatuan();
  }, []);

  const fetchSatuan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/satuanstock');
      const json = await res.json();
      if (Array.isArray(json)) {
        setSatuanList(json);
      } else {
        toastRef.current?.showToast('99', 'Format data tidak sesuai');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toastRef.current?.showToast('99', 'Terjadi kesalahan saat mengambil data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const isEdit = dialogMode === 'edit';
      const url = isEdit
        ? `/api/satuanstock/${selectedSatuan?.KODE}`
        : '/api/satuanstock';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      const status = json.status ?? '99';
      const message = json.message;

      toastRef.current?.showToast(status, message);

      if (status === '00') {
        fetchSatuan(); // reload
        resetForm();   // tutup dialog + reset
      }
    } catch (err) {
      console.error('Submit error:', err);
      toastRef.current?.showToast('99', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Hapus satuan dengan kode "${item.KODE}"?`)) return;
    try {
      const res = await fetch(`/api/satuanstock/${item.KODE}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (json.status === '00') {
        toastRef.current?.showToast('00', json.message);
        setSatuanList((prev) =>
          prev.filter((i) => i.KODE !== item.KODE)
        );
      } else {
        toastRef.current?.showToast(json.status ?? '99', json.message);
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Gagal menghapus satuan');
    }
  };

  const resetForm = () => {
    setForm({ KODE: '', KETERANGAN: '' });
    setDialogMode(null);
    setSelectedSatuan(null);
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Satuan Stock</h3>

      <div className="flex justify-end mb-4">
        <Button
          label="Tambah Satuan"
          icon="pi pi-plus"
          onClick={() => {
            setDialogMode('add');
            setForm({ KODE: '', KETERANGAN: '' });
            setSelectedSatuan(null);
          }}
        />
      </div>

      <DataTable
        value={satuanList}
        paginator
        rows={10}
        loading={isLoading}
        size="small"
        scrollable
      >
        <Column field="KODE" header="Kode" />
        <Column field="KETERANGAN" header="Keterangan" />
        <Column
          header="Aksi"
          style={{ width: '150px' }}
          body={(row) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                size="small"
                severity="warning"
                onClick={() => {
                  setDialogMode('edit');
                  setSelectedSatuan(row);
                  setForm({ ...row });
                }}
              />
              <Button
                icon="pi pi-trash"
                size="small"
                severity="danger"
                onClick={() => handleDelete(row)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={dialogMode === 'add' ? 'Tambah Satuan' : 'Edit Satuan'}
        visible={dialogMode !== null}
        onHide={resetForm}
        style={{ width: '30rem' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(form);
          }}
        >
          <div className="mb-3">
            <label htmlFor="KODE">Kode</label>
            <InputText
              id="KODE"
              name="KODE"
              value={form.KODE || ''}
              onChange={handleChange}
              className="w-full mt-2"
              required
              disabled={dialogMode === 'edit'} // disable input KODE saat edit
            />
          </div>

          <div className="mb-3">
            <label htmlFor="KETERANGAN">Keterangan</label>
            <InputText
              id="KETERANGAN"
              name="KETERANGAN"
              value={form.KETERANGAN || ''}
              onChange={handleChange}
              className="w-full mt-2"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              label="Simpan"
              icon="pi pi-save"
              severity="success"
              loading={isLoading}
            />
          </div>
        </form>
      </Dialog>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default SatuanStockPage;
