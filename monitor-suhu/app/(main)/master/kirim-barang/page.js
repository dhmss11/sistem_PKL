'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

export default function MutasiKirimData() {
  const [kirimData, setKirimData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [gudangOptions, setGudangOptions] = useState([]);
  const [selectedFromGudang, setSelectedFromGudang] = useState(null);
  const [selectedToGudang, setSelectedToGudang] = useState(null);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [satuanSelect, setSatuanSelect] = useState(null);

  const [formData, setFormData] = useState({
    tanggal: null,
    kode: '',
    faktur: '',
    qty: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  const toast = useRef(null);

  // Fetch Gudang
  const fetchGudang = useCallback(async () => {
    try {
      const res = await fetch("/api/gudang/nama");
      const json = await res.json();

      if (json.status === "00") {
        const options = json.namaGudang.map(nama => ({ label: nama, value: nama }));
        setGudangOptions(options);
      }
    } catch (error) {
      console.error("Gagal ambil nama gudang", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data gudang', life: 3000 });
    }
  }, []);

  // Fetch Satuan
  const fetchSatuan = useCallback(async () => {
    try {
      const res = await fetch("/api/satuan");
      const json = await res.json();
      if (json.status === "00" && Array.isArray(json.data)) {
        const options = json.data.map(item => ({ label: item.KODE, value: item.KODE }));
        setSatuanOptions(options);
      } else {
        setSatuanOptions([]);
      }
    } catch (error) {
      console.error("Gagal ambil satuan", error);
      setSatuanOptions([]);
    }
  }, []);

  // Fetch Data Kirim
  const fetchKirimData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kirimbarang');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      if (json.status === '00') {
        const rawData = Array.isArray(json.data) ? json.data : [];
        const formattedData = rawData.map((item, index) => ({
          id: item.id || index + 1,
          FAKTUR: item.FAKTUR || item.faktur || '-',
          TGL: item.TGL || item.tanggal || item.tgl || '-',
          GUDANG_KIRIM: item.GUDANG_KIRIM || item.gudang_kirim || item.DARI || item.dari || '-',
          GUDANG_TERIMA: item.GUDANG_TERIMA || item.gudang_terima || item.KE || item.ke || '-',
          KODE: item.KODE || item.kode || '-',
          QTY: item.QTY || item.qty || 0,
          SATUAN: item.SATUAN || item.satuan || '-',
          USERNAME: item.USERNAME || item.username || item.user || '-',
          DATETIME: item.DATETIME || item.datetime || item.created_at || '-',
          STATUS: item.STATUS || item.status || 'Pending'
        }));
        setKirimData(formattedData);
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: json.message || 'Gagal mengambil data', life: 3000 });
        setKirimData([]);
      }
    } catch (error) {
      console.error('Error fetching kirim data:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      setKirimData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGudang();
    fetchSatuan();
    fetchKirimData();
  }, [fetchGudang, fetchSatuan, fetchKirimData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedFromGudang || !selectedToGudang || !formData.tanggal ||
        !formData.kode || !formData.faktur || !formData.qty || !satuanSelect) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Semua field harus diisi!', life: 3000 });
      return;
    }

    if (selectedFromGudang === selectedToGudang) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gudang asal dan tujuan tidak boleh sama!', life: 3000 });
      return;
    }

    if (isNaN(parseFloat(formData.qty)) || parseFloat(formData.qty) <= 0) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'QTY harus valid dan lebih dari 0!', life: 3000 });
      return;
    }

    setSubmitLoading(true);

    try {
      const payload = {
        gudangKirim: selectedFromGudang,
        gudangTerima: selectedToGudang,
        tanggal: formData.tanggal instanceof Date ? formData.tanggal.toISOString() : formData.tanggal,
        kode: formData.kode,
        faktur: formData.faktur,
        qty: parseFloat(formData.qty),
        satuan: satuanSelect
      };

      const response = await fetch('/api/kirimbarang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();

      if (result.status === "00") {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Data berhasil disimpan!', life: 3000 });
        // Reset form
        setSelectedFromGudang(null);
        setSelectedToGudang(null);
        setSatuanSelect(null);
        setFormData({ tanggal: null, kode: '', faktur: '', qty: '' });
        fetchKirimData();
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: result.message || 'Gagal menyimpan data!', life: 3000 });
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSearch = () => {
    // Contoh search berdasarkan kode
    const filtered = kirimData.filter(item => item.KODE.includes(searchTerm));
    setKirimData(filtered);
  };

  return (
    <div className="card p-4">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold mb-4">Kirim Barang</h2>

      {/* Form Input */}
      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Dari Gudang</label>
            <Dropdown
              placeholder="Pilih Gudang"
              options={gudangOptions}
              value={selectedFromGudang}
              onChange={(e) => setSelectedFromGudang(e.value)}
              optionLabel="label"
              optionValue="value"
              showClear
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ke Gudang</label>
            <Dropdown
              placeholder="Pilih Gudang"
              options={gudangOptions}
              value={selectedToGudang}
              onChange={(e) => setSelectedToGudang(e.value)}
              optionLabel="label"
              optionValue="value"
              showClear
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <Calendar
              placeholder="Tanggal Kirim"
              value={formData.tanggal}
              onChange={(e) => handleInputChange('tanggal', e.value)}
              showIcon
              dateFormat="dd/mm/yy"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kode</label>
            <div className="p-inputgroup">
              <InputText
                placeholder="Kode"
                value={formData.kode}
                onChange={(e) => handleInputChange('kode', e.target.value)}
              />
              <Button icon="pi pi-search" onClick={handleSearch} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Faktur</label>
            <InputText
              placeholder="Faktur"
              value={formData.faktur}
              onChange={(e) => handleInputChange('faktur', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">QTY</label>
            <InputText
              placeholder="QTY"
              value={formData.qty}
              onChange={(e) => handleInputChange('qty', e.target.value)}
              keyfilter="pnum"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Satuan</label>
            <Dropdown
              placeholder="Pilih Satuan"
              options={satuanOptions}
              value={satuanSelect}
              onChange={(e) => setSatuanSelect(e.value)}
              optionLabel="label"
              optionValue="value"
              showClear
            />
          </div>
          <div className="flex items-end">
            <Button
              label="Simpan"
              icon="pi pi-check"
              onClick={handleSubmit}
              loading={submitLoading}
              className="p-button-success w-full"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        value={kirimData}
        paginator
        rows={10}
        loading={loading}
        scrollable
        className="text-sm"
        emptyMessage="Tidak ada data yang ditemukan"
      >
        <Column field="FAKTUR" header="FAKTUR" />
        <Column field="TGL" header="TGL" />
        <Column field="GUDANG_KIRIM" header="DARI GUDANG" />
        <Column field="GUDANG_TERIMA" header="KE GUDANG" />
        <Column field="KODE" header="KODE" />
        <Column field="QTY" header="QTY" />
        <Column field="SATUAN" header="SATUAN" />
        <Column field="USERNAME" header="USER" />
        <Column
          field="DATETIME"
          header="DATETIME"
          body={(rowData) => {
            const datetime = new Date(rowData.DATETIME);
            return datetime.toLocaleString('id-ID');
          }}
        />
        <Column field="STATUS" header="STATUS" />
      </DataTable>

      {/* Dialog contoh search */}
      <Dialog
        header="Form Search"
        visible={showSearchDialog}
        style={{ width: '30vw' }}
        onHide={() => setShowSearchDialog(false)}
      >
        {/* Isi form search bisa ditambahkan di sini */}
      </Dialog>
    </div>
  );
}
