'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import ToastNotifier from '@/app/components/ToastNotifier';



/**
 * @typedef {Object} Produk
 * @property {number} id
 * @property {string} kode
 * @property {string} nomor
 * @property {string} nama
 * @property {number} stock
 * @property {number} harga
 * @property {string} kategori
 * @property {string} satuan
 */

const ProdukPage = () => {
    const toastRef = useRef(null);
    const [produk, setProduk] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dialogMode, setDialogMode] = useState(null); // 'add' | 'edit'
    const [selectedProduk, setSelectedProduk] = useState(null);
    const [form, setForm] = useState({
        kode: '',
        nomor: '',
        nama: '',
        stock: 0,
        harga: 0,
        kategori: '',
        satuan: ''
    });

    const satuanOptions = [
    { label: 'Kg', value: 'Kg' },
    { label: 'Pcs', value: 'Pcs' },
    { label: 'Liter', value: 'Liter' },
    { label: 'Unit', value: 'Unit' }
];

const kategoriOptions = [
  { label: 'Makanan', value: 'Makanan' },
  { label: 'Minuman', value: 'Minuman' },
  { label: 'Elektronik', value: 'Elektronik' },
  { label: 'Alat Tulis', value: 'Alat Tulis' },
  { label: 'Sembako', value: 'Sembako' }
];

    const fetchProduk = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/produk');
            const json = await res.json();

            if (json.data.status === '00') {
                setProduk(json.data.produk);
            } else {
                toastRef.current?.showToast(json.data.status, json.data.message);
            }
        } catch (err) {
            console.error(`Failed to fetch: ${err}`);
            toastRef.current?.showToast('99', 'Gagal memuat data produk');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

const handleSubmit = async (data) => {
    try {
        let res, json;

        if (dialogMode === 'add') {
            res = await fetch('/api/produk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            json = await res.json();

            if (res.ok) {
                const updated = json.produk;

                toastRef.current?.showToast('00', json.message);
                if (updated) {
                    setProduk((prev) => [...prev, updated]);
                } else {
                    await fetchProduk();
                }
            } else {
                toastRef.current?.showToast('99', json.message || 'Gagal menyimpan data');
            }

        } else if (dialogMode === 'edit' && selectedProduk) {
            res = await fetch(`/api/produk/${selectedProduk.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            json = await res.json();

            if (res.ok && json.status === '00') {
                toastRef.current?.showToast(json.status, json.message);

                const updated = json.produk;
                if (updated) {
                    setProduk((prev) =>
                        prev.map((item) => (item.id === updated.id ? updated : item))
                    );
                } else {
                    await fetchProduk();
                }
            } else {
                toastRef.current?.showToast(json.status ?? '99', json.message ?? 'Gagal menyimpan');
            }
        }
    } catch (err) {
        console.error('Submit error:', err);
        toastRef.current?.showToast('99', 'Terjadi kesalahan saat menyimpan');
    } finally {
        setForm({
            kode: '',
            nomor: '',
            nama: '',
            stock: 0,
            harga: 0,
            kategori: '',
            satuan: ''
        });
        setDialogMode(null);
        setSelectedProduk(null);
    }
};

    const handleDelete = async (produkItem) => {
        if (!confirm(`Hapus produk ${produkItem.nama}?`)) return;

        try {
            const res = await fetch(`/api/produk/${produkItem.id}`, {
                method: 'DELETE',
            });
            const json = await res.json();

            if (json.status === '00') {
                toastRef.current?.showToast(json.status, json.message);
                setProduk((prev) => prev.filter((item) => item.id !== produkItem.id));
            } else {
                toastRef.current?.showToast(json.status, json.message);
            }
        } catch (err) {
            toastRef.current?.showToast('99', 'Gagal menghapus produk');
        }
    };

    useEffect(() => {
        fetchProduk();
    }, []);

    return (
        <div className="card">
            <h3 className="text-xl font-semibold">Master Produk</h3>

            <div className="flex justify-end my-3">
                <Button
                    label="Tambah Produk"
                    icon="pi pi-plus"
                    className="text-sm"
                    onClick={() => {
                        setDialogMode('add');
                        setForm({
                            kode: '',
                            nomor: '',
                            nama: '',
                            stock: 0,
                            harga: 0,
                            kategori: '',
                            satuan: ''
                        });
                    }}
                />
            </div>

            <DataTable
                size="small"
                className="text-sm"
                value={produk}
                paginator
                rows={10}
                loading={isLoading}
                scrollable
            >
                <Column field="kode" header="Kode" />
                <Column field="nomor" header="Nomor" />
                <Column field="nama" header="Nama" />
                <Column field="stock" header="Stok" />
                <Column field="harga" header="Harga" />
                <Column field="kategori" header="Kategori" />
                <Column field="satuan" header="Satuan" />
                <Column
                    header="Aksi"
                    body={(row) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-pencil text-sm"
                                size="small"
                                severity="warning"
                                onClick={() => {
                                    setDialogMode('edit');
                                    setSelectedProduk(row);
                                    setForm({ ...row });
                                }}
                            />
                            <Button
                                icon="pi pi-trash text-sm"
                                size="small"
                                severity="danger"
                                onClick={() => handleDelete(row)}
                            />
                        </div>
                    )}
                    style={{ width: '150px' }}
                />
            </DataTable>

            <Dialog
                header={dialogMode === 'add' ? 'Tambah Produk' : 'Edit Produk'}
                visible={dialogMode !== null}
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
                        <label htmlFor="kode">Kode</label>
                        <InputText
                            id="kode"
                            name="kode"
                            value={form.kode}
                            onChange={handleChange}
                            className="w-full mt-2"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nomor">Nomor</label>
                        <InputText
                            id="nomor"
                            name="nomor"
                            value={form.nomor}
                            onChange={handleChange}
                            className="w-full mt-2"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nama">Nama</label>
                        <InputText
                            id="nama"
                            name="nama"
                            value={form.nama}
                            onChange={handleChange}
                            className="w-full mt-2"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="stock">Stok</label>
                        <InputNumber
                            id="stock"
                            name="stock"
                            value={form.stock}
                            onValueChange={(e) => setForm((prev) => ({ ...prev, stock: e.value ?? 0 }))}
                            useGrouping={false}
                            className="w-full mt-2"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="harga">Harga</label>
                        <InputNumber
                            id="harga"
                            name="harga"
                            value={form.harga}
                            onValueChange={(e) => setForm((prev) => ({ ...prev, harga: e.value ?? 0 }))}
                            useGrouping={false}
                            className="w-full mt-2"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="kategori">Kategori</label>
                        <Dropdown
                            id="kategori"
                            name="kategori"
                            value={form.kategori}
                            options={kategoriOptions}
                            onChange={(e) => setForm((prev) => ({ ...prev, kategori: e.value }))}
                            placeholder="Pilih Kategori"
                            className="w-full mt-2"
                        />
                    </div>
                                    <div className="mb-3">
                        <label htmlFor="satuan">Satuan</label>
                        <Dropdown
                            id="satuan"
                            name="satuan"
                            value={form.satuan}
                            options={satuanOptions}
                            onChange={(e) => setForm((prev) => ({ ...prev, satuan: e.value }))}
                            placeholder="Pilih satuan"
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

export default ProdukPage;
