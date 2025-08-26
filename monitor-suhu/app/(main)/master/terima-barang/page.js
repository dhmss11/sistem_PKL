'use client';

import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

export default function MutasiTerimaDataPage() {
  const toastRef = useRef(null);
  const [fakturInput, setFakturInput] = useState('');
  const [terimaData, setTerimaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pendingData, setPendingData] = useState([]);

  const fetchPendingFaktur = async () => {
    try {
      const res = await fetch(`/api/mutasi/create/pending`);
      const json = await res.json();
      if (json.status === "00" && Array.isArray(json.data)) {
        setPendingData(json.data);
        setVisible(true);
        if (json.data.length === 0) {
          toastRef.current?.show({ severity: 'info', summary: 'Info', detail: 'Tidak ada faktur pending', life: 3000 });
        }
      } else {
        toastRef.current?.show({ severity: 'warn', summary: 'Warning', detail: json.message || 'Data tidak ditemukan', life: 3000 });
      }
    } catch (err) {
      console.error(err);
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal ambil faktur pending', life: 3000 });
    }
  };

  const fetchByFaktur = async (faktur) => {
    if (!faktur) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/mutasi/receive/${faktur}`);
      const json = await res.json();
      if (json.status === '00') setTerimaData([json.data]); // hanya faktur yang dipilih
      else {
        setTerimaData([]);
        toastRef.current?.show({ severity: 'info', summary: 'Info', detail: json.message || 'Data tidak ditemukan', life: 3000 });
      }
    } catch (err) {
      console.error(err);
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleFakturEnter = (e) => {
    if (e.key !== 'Enter') return;
    fetchByFaktur(fakturInput.trim());
  };

  const handleSelectFaktur = (row) => {
    setFakturInput(row.faktur);
    setTerimaData([row]); // hanya faktur yang dipilih tampil
    setVisible(false);
    toastRef.current?.show({ severity: 'success', summary: 'Faktur Dipilih', detail: `Faktur ${row.faktur} berhasil dimuat`, life: 3000 });
  };

  const handleTerimaRow = async (rowData) => {
    const faktur = rowData.faktur;
    if (!faktur) return toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Faktur tidak tersedia', life: 3000 });

    try {
      const res = await fetch(`/api/mutasi/receive/${faktur}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData)
      });
      const json = await res.json();
      if (json.status === '00') {
        toastRef.current?.show({ severity: 'success', summary: 'Success', detail: json.message, life: 3000 });
        fetchPendingFaktur();
        setFakturInput('');
        setTerimaData([]);
      } else {
        toastRef.current?.show({ severity: 'error', summary: 'Error', detail: json.message || 'Gagal menerima mutasi', life: 3000 });
      }
    } catch (err) {
      console.error(err);
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menerima mutasi', life: 3000 });
    }
  };

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <h2 className="text-xl font-bold mb-4">Terima Barang Berdasarkan Faktur Kirim</h2>

      <div className="flex flex-col gap-1 mb-4">
        <label className="font-medium">Cari Faktur</label>
        <div className="p-inputgroup">
          <InputText placeholder="Ketik Faktur dan Enter" value={fakturInput} onChange={(e) => setFakturInput(e.target.value)} onKeyDown={handleFakturEnter} className="w-64" />
          <Button icon="pi pi-search" onClick={fetchPendingFaktur} />
        </div>
      </div>

      <Dialog header="Pilih Faktur Pending" visible={visible} style={{ width: '80vw' }} onHide={() => setVisible(false)}>
        <DataTable value={pendingData} paginator rows={10} size="small" emptyMessage="Tidak ada faktur pending">
          <Column field="faktur" header="Faktur" />
          <Column field="tgl" header="Tanggal" body={(row) => new Date(row.tgl).toLocaleDateString('id-ID')} />
          <Column header="Action" body={(row) => <Button label="Pilih" icon="pi pi-check" size="small" onClick={() => handleSelectFaktur(row)} />} />
        </DataTable>
      </Dialog>

      <DataTable value={terimaData} loading={loading} paginator rows={10} size="small" emptyMessage="Tidak ada data">
        <Column field="faktur" header="Faktur" />
        <Column field="nama" header="Nama" />
        <Column field="tgl" header="Tanggal" />
        <Column field="gudang_kirim" header="Gudang Kirim" />
        <Column field="gudang_terima" header="Gudang Terima" />
        <Column field="barcode" header="Barcode" />
        <Column field="qty" header="Qty" />
        <Column field="satuan" header="Satuan" />
        <Column field="username" header="User Kirim" />
        <Column field="status" header="Status" />
        <Column header="Action" body={(row) => <Button label="Terima" icon="pi pi-check" className="p-button-success" onClick={() => handleTerimaRow(row)} />} />
      </DataTable>
    </div>
  );
}
