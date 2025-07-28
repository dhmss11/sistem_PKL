'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import ToastNotifier from '@/app/components/ToastNotifier';

const StockPage = () => {
  const toastRef = useRef(null);
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [form, setForm] = useState({
    gudang: '',
    KODE: '',
    KODE_TOKO: '',
    NAMA: '',
    JENIS: '',
    GOLONGAN: '',
    RAK: '',
    DOS: '',
    SATUAN: '',
    ISI: '',
    DISCOUNT: '',
    HB: '',
    HJ: '',
    EXPIRED: '',
    TGL_MASUK: '',
    BERAT: ''
  });

  const fetchStock = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stock');
      const json = await res.json();
      if (json.status === '00') {
        setStock(json.data);
      } else {
        toastRef.current?.showToast(json.status, json.message);
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Gagal memuat data stock');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (data) => {
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();

      if (res.ok && json.status === '00') {
        toastRef.current?.showToast(json.status, json.message);
        setStock((prev) => [...prev, json.data]);
      } else {
        toastRef.current?.showToast(json.status || '99', json.message || 'Gagal menyimpan data');
      }
    } catch (err) {
      toastRef.current?.showToast('99', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setForm({
        gudang: '', KODE: '', KODE_TOKO: '', NAMA: '', JENIS: '', GOLONGAN: '',
        RAK: '', DOS: '', SATUAN: '', ISI: '', DISCOUNT: '', HB: '', HJ: '',
        EXPIRED: '', TGL_MASUK: '', BERAT: ''
      });
      setDialogMode(null);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Master Stock</h3>
      <Button
        label="Tambah Stock"
        icon="pi pi-plus"
        className="mb-3"
        onClick={() => setDialogMode('add')}
      />

      <DataTable
        value={stock}
        paginator
        rows={10}
        loading={isLoading}
        scrollable
        size="small"
      >
        <Column field="gudang" header="Gudang" />
        <Column field="KODE" header="Kode" />
        <Column field="KODE_TOKO" header="Kode Toko" />
        <Column field="NAMA" header="Nama" />
        <Column field="JENIS" header="Jenis" />
        <Column field="GOLONGAN" header="Golongan" />
        <Column field="RAK" header="Rak" />
        <Column field="DOS" header="Dos" />
        <Column field="SATUAN" header="Satuan" />
        <Column field="ISI" header="Isi" />
        <Column field="DISCOUNT" header="Diskon" />
        <Column field="HB" header="HB" />
        <Column field="HJ" header="HJ" />
        <Column field="EXPIRED" header="Expired" />
        <Column field="TGL_MASUK" header="Tgl Masuk" />
        <Column field="BERAT" header="Berat" />
      </DataTable>

     <Dialog
  header="Tambah Stock"
  visible={dialogMode === 'add'}
  onHide={() => setDialogMode(null)}
  style={{ width: '40rem' }}
>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(form);
    }}
  >
    <div className="mb-3">
      <label htmlFor="gudang">Gudang</label>
      <InputText
        id="gudang"
        name="gudang"
        value={form.gudang}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="KODE">Kode</label>
      <InputText
        id="KODE"
        name="KODE"
        value={form.KODE}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="KODE_TOKO">Kode Toko</label>
      <InputText
        id="KODE_TOKO"
        name="KODE_TOKO"
        value={form.KODE_TOKO}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="NAMA">Nama</label>
      <InputText
        id="NAMA"
        name="NAMA"
        value={form.NAMA}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="JENIS">Jenis</label>
      <InputText
        id="JENIS"
        name="JENIS"
        value={form.JENIS}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="GOLONGAN">Golongan</label>
      <InputText
        id="GOLONGAN"
        name="GOLONGAN"
        value={form.GOLONGAN}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="RAK">RAK</label>
      <InputText
        id="RAK"
        name="RAK"
        value={form.RAK}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="DOS">DOS</label>
      <InputText
        id="DOS"
        name="DOS"
        value={form.DOS}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="SATUAN">Satuan</label>
      <InputText
        id="SATUAN"
        name="SATUAN"
        value={form.SATUAN}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="ISI">Isi</label>
      <InputText
        id="ISI"
        name="ISI"
        value={form.ISI}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="DISCOUNT">Discount</label>
      <InputText
        id="DISCOUNT"
        name="DISCOUNT"
        value={form.DISCOUNT}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="HB">HB</label>
      <InputText
        id="HB"
        name="HB"
        value={form.HB}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="HJ">HJ</label>
      <InputText
        id="HJ"
        name="HJ"
        value={form.HJ}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="EXPIRED">Expired</label>
      <InputText
        id="EXPIRED"
        name="EXPIRED"
        value={form.EXPIRED}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="TGL_MASUK">Tanggal Masuk</label>
      <InputText
        id="TGL_MASUK"
        name="TGL_MASUK"
        value={form.TGL_MASUK}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="mb-3">
      <label htmlFor="BERAT">Berat</label>
      <InputText
        id="BERAT"
        name="BERAT"
        value={form.BERAT}
        onChange={handleChange}
        className="w-full mt-2"
      />
    </div>

    <div className="flex justify-end">
      <Button type="submit" label="Submit" severity="success" icon="pi pi-save" />
    </div>
  </form>
</Dialog>


<ToastNotifier ref={toastRef} />


    </div>
  );
};

export default StockPage;
