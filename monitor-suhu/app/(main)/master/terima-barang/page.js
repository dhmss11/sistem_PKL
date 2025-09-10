'use client';

import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { useAuth } from '@/app/(auth)/context/authContext';

export default function MutasiTerimaDataPage() {
  const toastRef = useRef(null);
  const [fakturInput, setFakturInput] = useState('');
  const [terimaData, setTerimaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pendingData, setPendingData] = useState([]);
  const [qtyAwal, setQtyAwal] = useState(null);
  const  { user }= useAuth();

  const generateFaktur = () => `FT${Date.now()}`;

  
  const handleFakturEnter = async (e) => {
    if (e.key !== 'Enter') return;

    const faktur = fakturInput.trim();
    if (!faktur) return;

    setLoading(true);

    try {
      // Ambil data utama mutasi
      const resTerima = await fetch(`/api/mutasi/receive/${faktur}`);
      const jsonTerima = await resTerima.json();
      if (jsonTerima.status === '00' && jsonTerima.data) {
        const qtyTerima = Number(jsonTerima.data.qty ?? 0);
        setTerimaData([{ ...jsonTerima.data, qty: qtyTerima }]);

        // Ambil data validasi qty
        const resValidasi = await fetch(`/api/mutasi/validasi/${faktur}`);
        const jsonValidasi = await resValidasi.json();
        if (jsonValidasi.status === '00' && jsonValidasi.data) {
          const qtyApi = Number(jsonValidasi.data.qty ?? qtyTerima);
          setQtyAwal(qtyApi);
          console.log('QtyAwal dari API validasi:', qtyApi);
        } else {
          setQtyAwal(qtyTerima); 
          console.log('QtyAwal dari API validasi: fallback ke qty dari fetchByFaktur', qtyTerima);
        }
      } else {
        setTerimaData([]);
        setQtyAwal(null);
        toastRef.current?.show({ severity: 'info', summary: 'Info', detail: jsonTerima.message || 'Data tidak ditemukan', life: 3000 });
      }
    } catch (err) {
      console.error(err);
      setQtyAwal(0);
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingFaktur = async () => {
    try {
      const res = await fetch(`/api/mutasi/pending`);
      const json = await res.json();
      console.log("DEBUG pending faktur:", json);
      
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

  const handleSelectFaktur = (row) => {
    setFakturInput(row.faktur);
    setTerimaData([{
      ...row,
      qty: Number(row.qty)
    }]);
    setVisible(false);
    toastRef.current?.show({ severity: 'success', summary: 'Faktur Dipilih', detail: `Faktur ${row.faktur} berhasil dimuat`, life: 3000 });
  };

  const handleTerimaRow = async (rowData) => {
    const fakturKirim = rowData.faktur;
    if (!fakturKirim) {
      return toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Faktur tidak tersedia', life: 3000 });
    }

    const fakturBaru = generateFaktur();

    const payload = {
      faktur: fakturBaru,
      faktur_kirim: fakturKirim,
      nama: rowData.nama,
      qty: rowData.qty,
      satuan: rowData.satuan,
      username: rowData.username,
      tgl: new Date().toISOString(),
      gudang_kirim: rowData.gudang_kirim,
      gudang_terima: rowData.gudang_terima,
      barcode: rowData.barcode,
      user_terima: user?.username

    };

    try {
      const res = await fetch(`/api/mutasi/receive/${fakturKirim}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.status === '00') {
        toastRef.current?.show({ severity: 'success', summary: 'Success', detail: json.message, life: 3000 });
        fetchPendingFaktur();
        setFakturInput('');
        setTerimaData([]);
        setQtyAwal(null);
      } else {
        toastRef.current?.show({ severity: 'error', summary: 'Error', detail: json.message || 'Gagal menerima mutasi', life: 3000 });
      }
    } catch (err) {
      console.error(err);
      toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal menerima mutasi', life: 3000 });
    }
  };

  const handleQtyChange = (faktur, newQty) => {
    if (newQty <= 0) {
      toastRef.current?.show({ 
        severity: 'warn', 
        summary: 'Invalid Quantity', 
        detail: 'Quantity harus lebih dari 0', 
        life: 3000 
      });
      return;
    }

    if (qtyAwal !== null && newQty > qtyAwal) {
      toastRef.current?.show({
        severity: 'warn',
        summary: 'Invalid Quantity',
        detail: 'Anda menerima qty lebih dari yang dikirim',
        life: 3000
      });
      return;
    }

    setTerimaData(prev =>
      prev.map(item => item.faktur === faktur ? { ...item, qty: newQty } : item)
    );
  };

  const qtyBodyTemplate = (rowData) => (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <InputNumber
        value={rowData.qty}
        onValueChange={(e) => handleQtyChange(rowData.faktur, e.value)}
        min={1}
        style={{ width: '100%' }}
        inputStyle={{
          width: '60px',              
          transition: 'all 0.2s ease',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          textAlign: 'left',
          padding: '4px',
          fontSize: '14px',
          lineHeight: '1.2',
          verticalAlign: 'middle'
        }}
        onFocus={(e) => {
          e.target.style.width = '100px'; 
          e.target.style.border = '2px solid #1761b6ff';
          e.target.style.borderRadius = '6px';
          e.target.style.background = 'white';
          e.target.style.boxShadow = '0 0 0 3px rgba(244, 244, 244, 0.2)';
        }}
        onBlur={(e) => {
          e.target.style.width = '60px'; 
          e.target.style.border = 'none';
          e.target.style.background = 'transparent';
          e.target.style.boxShadow = 'none';
        }}
        size="small"
      />
    </div>
  );

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <h2 className="text-xl font-bold mb-4">Terima Barang Berdasarkan Faktur Kirim</h2>

      <div className="flex flex-col gap-1 mb-4">
        <label className="font-medium">Cari Faktur</label>
        <div className="p-inputgroup">
          <InputText 
            placeholder="Ketik Faktur dan Enter" 
            value={fakturInput} 
            onChange={(e) => setFakturInput(e.target.value)} 
            onKeyDown={handleFakturEnter} 
            className="w-64" 
          />
          <Button icon="pi pi-search" onClick={fetchPendingFaktur} />
        </div>
      </div>

      <Dialog header="Pilih Faktur Pending" visible={visible} style={{ width: '80vw' }} onHide={() => setVisible(false)}>
        <DataTable value={pendingData} paginator rows={10} size="small" emptyMessage="Tidak ada faktur pending">
          <Column field="faktur" header="Faktur" />
          <Column field="tgl" header="Tanggal" />
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
        <Column field="qty" header="Qty" body={qtyBodyTemplate} />
        <Column field="satuan" header="Satuan" />
        <Column field="username" header="User Kirim" />
        <Column field="status" header="Status" />
        <Column 
          header="Action" 
          body={(row) => (
            <Button 
              label="Terima" 
              icon="pi pi-check" 
              className="p-button-success" 
              onClick={() => handleTerimaRow(row)} 
            />
          )}
        />
      </DataTable>
    </div>
  );
}
