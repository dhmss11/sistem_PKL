'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

export default function MutasiKirimData() {
  const [kirimData, setKirimData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [gudangOptions, setGudangOptions] = useState([]);
  const [selectedFromGudang, setSelectedFromGudang] = useState(null);
  const [selectedToGudang, setSelectedToGudang] = useState(null);
  const [satuanOptions, setSelectSatuan] = useState([]);
  const [satuanSelect, setSatuanSelect] = useState(null);
  
  const [formData, setFormData] = useState({
    tanggal: null,
    kode: '',
    faktur: '',
    qty: ''
  });

  const toast = useRef(null);

  const fetchGudang = useCallback(async () => {
    try {
      const res = await fetch("/api/gudang/nama");
      const json = await res.json();

      if (json.status === "00") {
        const options = json.namaGudang.map(nama => ({
          label: nama,
          value: nama,
        }));
        setGudangOptions(options);
      }
    } catch (error) {
      console.error("Form Gagal ambil nama gudang", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Gagal mengambil data gudang',
        life: 3000
      });
    }
  }, []);


const fetchSatuan = useCallback(async () => {
  try {
    const res = await fetch("/api/satuan");
    const json = await res.json();
    console.log("DATA SATUAN:", json);

    if (json.status === "00" && Array.isArray(json.data)) {
      const options = json.data.map((item) => ({
        label: item.KODE,
        value: item.KODE,
      }));
      setSelectSatuan(options);
    } else {
      console.warn("Data satuan tidak valid:", json);
      setSelectSatuan([]);
    }
  } catch (error) {
    console.error("Form Gagal ambil satuan", error);
  }
}, []);


  const fetchKirimData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching kirim data...");
      
      
      const res = await fetch('/api/kirimbarang', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Cek content-type
      const contentType = res.headers.get('content-type');
      console.log("Content-Type:", contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Response bukan JSON:', text);
        throw new Error('Response is not JSON');
      }

      const json = await res.json();
      console.log("Parsed JSON:", json);

      if (json.status === '00') {
        
        const rawData = Array.isArray(json.data) ? json.data : [];
        console.log("Raw data:", rawData);
        
       
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

        console.log("Formatted data:", formattedData);
        setKirimData(formattedData);
        
        if (formattedData.length === 0) {
          console.log("No data found");
        }
      } else {
        console.error('API returned error:', json.message);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: json.message || 'Gagal mengambil data',
          life: 3000
        });
        setKirimData([]);
      }
    } catch (error) {
      console.error('Error fetching kirim data:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: `Gagal mengambil data: ${error.message}`,
        life: 3000
      });
      setKirimData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedFromGudang || !selectedToGudang || !formData.tanggal || 
        !formData.kode || !formData.faktur || !formData.qty || !satuanSelect) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Semua field harus diisi!',
        life: 3000
      });
      return;
    }

    if (selectedFromGudang === selectedToGudang) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Gudang asal dan tujuan tidak boleh sama!',
        life: 3000
      });
      return;
    }
    if (isNaN(parseFloat(formData.qty)) || parseFloat(formData.qty) <= 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'QTY harus berupa angka yang valid dan lebih dari 0!',
        life: 3000
      });
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

      console.log('Submitting payload:', payload);

      const response = await fetch('/api/kirimbarang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Submit result:', result);

      if (result.status === "00") {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Data berhasil disimpan!',
          life: 3000
        });
        
        setSelectedFromGudang(null);
        setSelectedToGudang(null);
        setSatuanSelect(null);
        setFormData({
          tanggal: null,
          kode: '',
          faktur: '',
          qty: ''
        });
        
       
        fetchKirimData();
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: result.message || 'Gagal menyimpan data!',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Terjadi kesalahan saat menyimpan data!',
        life: 3000
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    fetchKirimData();
    fetchGudang();
    fetchSatuan();
  }, [fetchKirimData, fetchGudang, fetchSatuan]);

  return (
    <div className="card">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold mb-4">Kirim Barang</h2>
      
      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Dari Gudang</label>
            <Dropdown
              id='darigudang'
              name='darigudang'
              className="w-full"
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
              id='kegudang'
              name='kegudang'
              className="w-full"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <Calendar
              id="tanggal"
              name="tanggal"
              className="w-full"
              placeholder="Tanggal Kirim"
              value={formData.tanggal}
              onChange={(e) => handleInputChange('tanggal', e.value)}
              showIcon
              dateFormat="dd/mm/yy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kode</label>
            <InputText
              id="kode"
              name="kode"
              className="w-full"
              placeholder="Kode"
              value={formData.kode}
              onChange={(e) => handleInputChange('kode', e.target.value)}
            />
          </div>
        </div>


         <div className="mb-3 p-2 border rounded-lg bg-white-50"> 
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div>
      <label className='block text-sm font-medium mb-1'>Faktur</label>
      <InputText
        id='faktur'
        name='faktur'
        className='w-full'
        placeholder='Faktur'
      />
    </div>
    <div>
      <label className='block text-sm font-medium mb-1'>QTY</label>
      <InputText
        id='QTY'
        name='QTY'
        className='w-full'
        placeholder='QTY'
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Satuan</label>
      <Dropdown
        id='satuan'
        name='satuan'
        className="w-full"
        placeholder="Pilih satuan"
        options={satuanOptions}
        value={satuanSelect}
        onChange={(e) => setSatuanSelect(e.value)}
        optionLabel="label"
        optionValue="value"
        showClear
      />
    </div>
  </div>
</div>

      <DataTable
        size="small"
        className="text-sm"
        value={kirimData}
        paginator
        rows={10}
        loading={loading}
        scrollable
      >
        <Column field="FAKTUR" header="FAKTUR" />
        <Column field="TGL" header="TGL" />
        <Column field="GUDANG_KIRIM" header="GUDANG_KIRIM" />
        <Column field="GUDANG_TERIMA" header="GUDANG_TERIMA" />
        <Column field="KODE" header="KODE" />
        <Column field="QTY" header="QTY" />
        <Column field="SATUAN" header="SATUAN" />
        <Column field="USERNAME" header="USERNAME" />
        <Column field="DATETIME" header="DATETIME" />
        <Column field="STATUS" header="STATUS" />
      </DataTable>
    </div>
    </div>

  );
}