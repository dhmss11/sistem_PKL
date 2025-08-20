'use client';

export const dynamic = "force-dynamic";
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import ToastNotifier from '@/app/components/ToastNotifier';

const jenisGudangList = [
  { label: 'Gudang Bahan Baku', value: 'Gudang Bahan Baku' },
  { label: 'Gudang Barang Jadi', value: 'Gudang Barang Jadi' },
  { label: 'Gudang Pendingin', value: 'Gudang Pendingin' },
];

const defaultForm = { KODE: '', nama: '', alamat: '', KETERANGAN: '' };

export default function GudangPage() {
  const toastRef = useRef(null);
  const [gudangList, setGudangList] = useState([]);
  const [dialogMode, setDialogMode] = useState(null); // "add" | "edit" | null
  const [form, setForm] = useState(defaultForm);
  const [selectedGudang, setSelectedGudang] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // === FETCH DATA ===
  const fetchGudang = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gudang');
      const json = await res.json();

      if (res.ok && json.status === '00') {
        setGudangList(Array.isArray(json.data || json.gudang) ? (json.data || json.gudang) : []);
      } else {
        toastRef.current?.showToast('99', json.message || 'Gagal memuat data gudang');
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGudang();
  }, []);

  // === FORM HANDLING ===
  const handleChange = (e) => {
    const { name, value } = e.target ?? e; // support Dropdown (e.value) & InputText (e.target.value)
    setForm((prev) => ({
      ...prev,
      [name || 'KETERANGAN']: value || e.value,
    }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setDialogMode(null);
    setSelectedGudang(null);
  };

  // === SUBMIT FORM ===
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (!form.KODE || !form.nama || !form.alamat || !form.KETERANGAN) {
      toastRef.current?.showToast('99', 'Semua field wajib diisi');
      setSubmitting(false);
      return;
    }

    try {
      let res;
      if (dialogMode === 'add') {
        res = await fetch('/api/gudang', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else if (dialogMode === 'edit' && selectedGudang?.id) {
        res = await fetch(`/api/gudang/${selectedGudang.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        toastRef.current?.showToast('99', json.message || 'Gagal menyimpan data');
      } else {
        toastRef.current?.showToast('00', json.message || 'Berhasil disimpan');
        resetForm();
        fetchGudang();
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Terjadi kesalahan server');
    } finally {
      setSubmitting(false);
    }
  };

  // === DELETE ===
  const handleDelete = async (row) => {
    if (!confirm(`Hapus gudang "${row.nama}"?`)) return;
    try {
      const res = await fetch(`/api/gudang/${row.id}`, { method: 'DELETE' });
      const json = await res.json();

      if (!res.ok) {
        toastRef.current?.showToast(json.status || '99', json.message || 'Gagal menghapus');
      } else {
        toastRef.current?.showToast('00', json.message || 'Data berhasil dihapus');
        fetchGudang();
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Gagal koneksi ke server');
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Master Gudang</h3>

      <div className="flex justify-end my-3">
        <Button
          label="Tambah Gudang"
          icon="pi pi-plus"
          onClick={() => {
            setDialogMode('add');
            setForm(defaultForm);
            setSelectedGudang(null);
          }}
        />
      </div>

      <DataTable
        value={gudangList}
        paginator
        rows={10}
        loading={loading}
        size="small"
        stripedRows
        emptyMessage="Tidak ada data gudang"
      >
        <Column field="KODE" header="Kode" />
        <Column field="nama" header="Nama" />
        <Column field="alamat" header="Alamat" />
        <Column field="KETERANGAN" header="Jenis Gudang" />
        <Column
          header="Aksi"
          body={(row) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                severity="warning"
                size="small"
                onClick={() => {
                  setDialogMode('edit');
                  setSelectedGudang(row);
                  setForm({
                    KODE: row.KODE,
                    nama: row.nama,
                    alamat: row.alamat,
                    KETERANGAN: row.KETERANGAN,
                  });
                }}
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                size="small"
                onClick={() => handleDelete(row)}
              />
            </div>
          )}
          style={{ width: '150px' }}
        />
      </DataTable>

      {/* Dialog Form */}
      <Dialog
        header={dialogMode === 'edit' ? 'Edit Gudang' : 'Tambah Gudang'}
        visible={!!dialogMode}
        onHide={resetForm}
        style={{ width: '30rem' }}
        modal
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label htmlFor="KODE">Kode</label>
            <InputText
              id="KODE"
              name="KODE"
              value={form.KODE}
              onChange={handleChange}
              className="w-full mt-1"
              placeholder="Kode Gudang"
            />
          </div>

          <div>
            <label htmlFor="nama">Nama</label>
            <InputText
              id="nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full mt-1"
              placeholder="Nama Gudang"
            />
          </div>

          <div>
            <label htmlFor="alamat">Alamat</label>
            <InputText
              id="alamat"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              className="w-full mt-1"
              placeholder="Alamat Gudang"
            />
          </div>

          <div>
            <label htmlFor="KETERANGAN">Jenis Gudang</label>
            <Dropdown
              id="KETERANGAN"
              name="KETERANGAN"
              value={form.KETERANGAN}
              options={jenisGudangList}
              onChange={handleChange}
              className="w-full mt-1"
              optionLabel="label"
              optionValue="value"
              placeholder="Pilih Jenis Gudang"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button label="Batal" type="button" onClick={resetForm} />
            <Button
              type="submit"
              label="Simpan"
              icon="pi pi-save"
              severity="success"
              disabled={submitting}
            />
          </div>
        </form>
      </Dialog>

      <ToastNotifier ref={toastRef} />
    </div>
  );
}
