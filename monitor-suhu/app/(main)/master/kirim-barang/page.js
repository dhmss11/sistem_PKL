'use client'

import { useEffect, useState, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { useAuth } from '@/app/(auth)/context/authContext';

export default function MutasiKirimData() {
  const [kirimData, setKirimData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [gudangOptions, setGudangOptions] = useState([]);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [produkList, setProdukList] = useState([]);
  const { user } = useAuth();
  const toast = useRef(null);

  const [formData, setFormData] = useState({
    TGL: null,
    KODE: '',
    NAMA: '',
    FAKTUR: '',
    QTY: '',
    BARCODE: '',
    harga: '',
    GUDANG_KIRIM: null,
    GUDANG_TERIMA: null,
    SATUAN: null,
  });

  const formatDateForDatabase = (date) => {
    if (!date) return '-';
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return date;
  };

  const fetchGudang = useCallback(async () => {
    try {
      const res = await fetch("/api/gudang/nama");
      const json = await res.json();
      if (json.status === "00") {
        setGudangOptions(json.namaGudang.map(nama => ({ label: nama, value: nama })));
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data gudang', life: 3000 });
    }
  }, []);

  const fetchSatuan = useCallback(async () => {
    try {
      const res = await fetch("/api/satuan");
      const json = await res.json();
      if (json.status === "00" && Array.isArray(json.data)) {
        setSatuanOptions(json.data.map(item => ({ label: item.KODE, value: item.KODE })));
      }
    } catch (error) {
      console.error(error);
      setSatuanOptions([]);
    }
  }, []);

  const fetchProduk = useCallback(async () => {
    try {
      const res = await fetch("/api/stock");
      const json = await res.json();
      if (json.status === "00") {
        setProdukList(json.data.map(item => ({
          ID: item.ID,
          KODE: item.KODE,
          BARCODE: item.BARCODE,
          NAMA: item.NAMA,
          HJ: item.HJ,
          SATUAN: item.SATUAN,
          QTY: item.QTY,
        })));
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data produk', life: 3000 });
    }
  }, []);

  const fetchKirimData = useCallback(async () => {
    try {
      const res = await fetch('/api/kirimbarang');
      const json = await res.json();
      if (json.status === '00') {
        const formattedData = json.data.map((item, index) => ({
          id: item.id || index + 1,
          NAMA: item.NAMA || '-',
          FAKTUR: item.FAKTUR || '-',
          TGL: item.TGL || '-',
          GUDANG_KIRIM: item.GUDANG_KIRIM || '-',
          GUDANG_TERIMA: item.GUDANG_TERIMA || '-',
          KODE: item.KODE || '-',
          QTY: item.QTY || 0,
          BARCODE: item.BARCODE || '-',
          SATUAN: item.SATUAN || '-',
          USERNAME: item.USERNAME || '-',
          STATUS: item.STATUS || 'Pending'
        }));
        setKirimData(formattedData);
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: json.message || 'Gagal mengambil data', life: 3000 });
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGudang();
    fetchSatuan();
    fetchProduk();
    fetchKirimData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateFaktur = () => {
  const timestamp = Date.now();
  return `FA${timestamp}`;
};

const handleSelect = (selectedProduct) => {
  setKirimData(prev => {
    const existing = prev.find(item => item.BARCODE === selectedProduct.BARCODE);

    let faktur = formData.FAKTUR;
    if (!faktur) {
      faktur = generateFaktur();
      setFormData(prevForm => ({ ...prevForm, FAKTUR: faktur }));
    }

    if (existing) {
      return prev.map(item =>
        item.BARCODE === selectedProduct.BARCODE
          ? { ...item, QTY: Number(item.QTY) + 1 }
          : item
      );
    } else {
      
      const newItem = {
        id: prev.length + 1,
        KODE: selectedProduct.KODE,
        BARCODE: selectedProduct.BARCODE,
        NAMA: selectedProduct.NAMA,
        QTY: 1,
        HARGA: selectedProduct.HJ,
        SATUAN: selectedProduct.SATUAN,
        FAKTUR: faktur,
        TGL: formData.TGL ? formatDateForDatabase(formData.TGL) : '-',
        GUDANG_KIRIM: formData.GUDANG_KIRIM || '-',
        GUDANG_TERIMA: formData.GUDANG_TERIMA || '-',
        USERNAME: user?.username || '-',
        STATUS: 'Pending'
      };
      return [...prev, newItem];
    }
  });

    setVisible(false);
    toast.current?.show({
      severity: 'success',
      summary: 'Produk Ditambahkan',
      detail: `${selectedProduct.NAMA} berhasil ditambahkan`,
      life: 3000
    });
  };


  const handleSubmit = async () => {
    if (!formData.GUDANG_KIRIM || !formData.GUDANG_TERIMA || !formData.TGL) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Field Gudang dan Tanggal wajib diisi', life: 3000 });
      return;
    }
    setSubmitLoading(true);
    try {
      const payload = {
        ...formData,
        TGL: formatDateForDatabase(formData.TGL),
        USERNAME: user?.username,
        STATUS: '1'
      };
      const res = await fetch('/api/kirimbarang', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === '00') {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Data berhasil disimpan!', life: 3000 });
        setFormData({ TGL: null, KODE: '', NAMA: '', FAKTUR: '', QTY: '', BARCODE: '', harga: '', GUDANG_KIRIM: null, GUDANG_TERIMA: null, SATUAN: null });
        fetchKirimData();
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: result.message || 'Gagal menyimpan data', life: 3000 });
      }
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteRow = (id) => {
  setKirimData(prev => prev.filter(item => item.id !== id));

  toast.current?.show({
    severity: 'success',
    summary: 'Berhasil',
    detail: 'Data berhasil dihapus',
    life: 3000
  });
};

  return (
    <div className="card p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold mb-4">Kirim Barang</h2>


      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        {/* Form Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Dari Gudang</label>
            <Dropdown placeholder="Pilih Gudang" options={gudangOptions} value={formData.GUDANG_KIRIM} onChange={(e) => handleInputChange('GUDANG_KIRIM', e.value)} showClear />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ke Gudang</label>
            <Dropdown placeholder="Pilih Gudang" options={gudangOptions} value={formData.GUDANG_TERIMA} onChange={(e) => handleInputChange('GUDANG_TERIMA', e.value)} showClear />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <Calendar placeholder="Tanggal Kirim" value={formData.TGL} onChange={(e) => handleInputChange('TGL', e.value)} showIcon dateFormat="dd/mm/yy" className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Faktur</label>
            <InputText placeholder="Faktur" value={formData.FAKTUR} onChange={(e) => handleInputChange('FAKTUR', e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">BARCODE</label>
            <div className="p-inputgroup">
              <InputText placeholder="BARCODE" value={formData.BARCODE} onChange={(e) => handleInputChange('BARCODE', e.target.value)} />
              <Button icon="pi pi-search" onClick={() => setVisible(true)} />
            </div>
          </div>
        </div>

      {/* Dialog Pilih Produk */}
      <Dialog header="Pilih Produk" visible={visible} style={{ width: '70vw' }} onHide={() => setVisible(false)} position="center">
        <DataTable value={produkList} paginator rows={10} size="small">
          <Column field="KODE" header="KODE" sortable/>
          <Column field="BARCODE" header="BARCODE"/>
          <Column field="NAMA" header="NAMA"/>
          <Column field="QTY" header="QTY"/>
          <Column field="SATUAN" header="SATUAN"/>
          <Column field="HJ" header="HARGA" body={(rowData) => `Rp ${(rowData.HJ ?? 0).toLocaleString('id-ID')}`} />
          <Column header="AKSI" body={(rowData) => <Button label="Pilih" icon="pi pi-check" size="small" onClick={() => handleSelect(rowData)} />} />
        </DataTable>
      </Dialog>

      {/* Tabel Kirim Data */}
      <div className='mt-3'>
        <DataTable value={kirimData} paginator rows={10} size="small" loading={loading} scrollable emptyMessage="Tidak ada data yang ditemukan">
          <Column field='NAMA' header="NAMA"/>
          <Column field="FAKTUR" header="FAKTUR" />
          <Column field="TGL" header="TANGGAL" />
          <Column field="GUDANG_KIRIM" header="DARI GUDANG" />
          <Column field="GUDANG_TERIMA" header="KE GUDANG" />
          <Column field="KODE" header="KODE" />
          <Column field="QTY" header="QTY" />
          <Column field="BARCODE" header="BARCODE"/>
          <Column field="SATUAN" header="SATUAN" />
          <Column field="USERNAME" header="USER" />
          <Column field="STATUS" header="STATUS" />
          <Column
            header="AKSI"
            body={(rowData) => (
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-sm"
                onClick={() => handleDeleteRow(rowData.id)}
              />
            )}
          />
        </DataTable>
        <div className="w-full flex mt-3 justify-end gap-2">
          <Button
            label="Simpan"
            icon="pi pi-check"
            onClick={handleSubmit}
            loading={submitLoading}
            className="p-button-success ml-auto"
          />
        </div>
      </div>
    </div>
   </div>

  );
}

import { Suspense } from "react"
import MutasiKirimDataContent from "./kirimBarangContent"

export default function kirimBarangPage () {
  return (
    <Suspense fallback= {<div>loading ...</div>}>
      <MutasiKirimDataContent/>
       </Suspense>
  )
}

