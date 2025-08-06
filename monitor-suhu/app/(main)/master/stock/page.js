'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { format, parseISO } from 'date-fns';
import ToastNotifier from '@/app/components/ToastNotifier';
import { date } from 'yup';


const initialFormState = {
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
};

const StockPage = () => {
  const toastRef = useRef(null);
  const [filterSatuan, setFilterSatuan] = useState('');
  const [stock, setStock] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedRakFilter, setSelectedRakFilter] = useState('');
  const [rakOptions, setRakOptions] = useState([]); 
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [listGudang, setListGudang] = useState([]);
  const [golonganOptions, setGolonganOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [form, setForm] = useState(initialFormState);



  const formatDateToDB = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
  
    const jakartaDate = new Date(d.getTime() + (7 * 60 * 60 * 1000)); 
    
    const year = jakartaDate.getUTCFullYear();
    const month = String(jakartaDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(jakartaDate.getUTCDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };


  const fetchData = useCallback(async (endpoint, setData, labelField = 'KETERANGAN') => {
    try {
      const res = await fetch(`/api/${endpoint}`);
      const json = await res.json();
      
      if (json.status === '00') {
        const options = json.data.map(item => ({
          value: item.KODE, 
          label: item[labelField] || item.KETERANGAN || item.NAMA
        }));
        setData(options);
      } else {
        toastRef.current?.showToast(json.status, json.message || `Gagal memuat data ${endpoint}`);
      }
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      toastRef.current?.showToast('99', `Gagal memuat data ${endpoint}`);
    }
  }, []);

  // KHUSUS LIST GUDANG
  const fetchGudang = async () => {
    try {
        const res = await fetch("/api/gudang/nama");
        const json = await res.json();

        if (json.status === "00") {
            const options = json.namaGudang.map((nama)=>({
                label : nama,
                value :nama,
            }));
            setListGudang(options);
        }
    }catch (error){
        console.error("Form Gagal ambil nama gudang")
    }
  };

  const parseDateFromDB = (dateString) => {
    if (!dateString) return '';

const parseDateFromDB = (dateString) => {
  if (!dateString) return '';

  try {
    const parsedDate = parseISO(dateString); 
    return format(parsedDate, 'yyyy-MM-dd'); 
  } catch (error) {
    console.error('Invalid date string:', error);
    return '';
  }
};

    try {
      const parsedDate = parseISO(dateString); 
      return format(parsedDate, 'yyyy-MM-dd'); 
    } catch (error) {
      console.error('Invalid date string:', error);
      return '';
    }
  };


  // Fetch stock data
  const fetchStock = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stock');
      const json = await res.json();
      
      if (json.status === '00') {
        const processedData = json.data.map(item => ({
          ...item,
          TGL_MASUK: parseDateFromDB(item.TGL_MASUK),
          EXPIRED: parseDateFromDB(item.EXPIRED)
        }));
        setStock(processedData);
        setFilteredStocks(processedData); 
      } else {
        toastRef.current?.showToast(json.status, json.message);
      }
    } catch (err) {
      console.error('Error fetching stock:', err);
      toastRef.current?.showToast('99', 'Gagal memuat data stock');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStockBySatuan = useCallback(async (satuan) => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/stock/satuan/${satuan}`);
      const json = await res.json();

      if (json.status === '00') {
        const processedData =  json.data.map(item => ({
          ...item,
          TGL_MASUK: parseDateFromDB(item.TGL_MASUK),
          EXPIRED: parseDateFromDB(item.EXPIRED),
        }));
        setStock(processedData);
      } else {
        toastRef.current?.showToast(json.status, json.message || 'gagal mengggambil stock');
      }
    } catch (err) { 
      console.error('Error fetchStockBySatuan:', err);
      toastRef.current?.showToast('99', 'gagal menggambil stock berdasarkan satuan ');
    } finally {
      setIsLoading(false);
    }
  }, []);


  
  const handleRakFilterChange = useCallback((e) => {
    const kodeRak = e.value;
    setSelectedRakFilter(kodeRak);

    if (kodeRak) {
      const filtered = stock.filter(item => item.RAK === kodeRak);
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks(stock);
    }
  }, [stock]);

  
  const clearRakFilter = useCallback(() => {
    setSelectedRakFilter('');
    setFilteredStocks(stock);
  }, [stock]);

  
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchStock(),
        fetchData('rak', setRakOptions),
        fetchData('satuan', setSatuanOptions),
        fetchData('golonganstock', setGolonganOptions),
        fetchGudang(),
      ]);
    };
    loadInitialData();
  }, [fetchData, fetchStock]);

  

  useEffect(() => {
    if (selectedRakFilter) {
      const filtered = stock.filter(item => item.RAK === selectedRakFilter);
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks(stock);
    }
  }, [stock, selectedRakFilter]);
  

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);


  const handleCalendarChange = useCallback((name, value) => {
    if (!value) {
      setForm(prev => ({ ...prev, [name]: '' }));
      return;
    }
    
    const formattedDate = formatDateToDB(value);
    console.log(`Calendar ${name} changed:`, { original: value, formatted: formattedDate });
    setForm(prev => ({ ...prev, [name]: formattedDate }));
  }, []);

  
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const method = dialogMode === 'add' ? 'POST' : 'PUT';
      const url = dialogMode === 'add' ? '/api/stock' : `/api/stock/${selectedStock.KODE}`;
      
      console.log('Submitting form data:', form);
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const json = await res.json();

      if (res.ok && json.status === '00') {
        toastRef.current?.showToast(json.status, json.message);
        
        await fetchStock(); 
        
        setDialogMode(null); 
        setForm(initialFormState); 
        setSelectedStock(null); 
      } else {
        toastRef.current?.showToast(json.status || '99', json.message || 'Gagal menyimpan data');
      }
    } catch (err) {
      console.error('Submit error:', err);
      toastRef.current?.showToast('error', err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsLoading(false);
    }
  }, [dialogMode, form, selectedStock, fetchStock]);

  
  const handleDelete = useCallback(async (data) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/stock/${data.KODE}`, { method: 'DELETE' });
      const json = await res.json();

      if (res.ok && json.status === '00') {
        toastRef.current?.showToast(json.status, json.message);
        await fetchStock();
      } else {
        toastRef.current?.showToast(json.status || '99', json.message || 'Gagal menghapus data');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toastRef.current?.showToast('error', err.message || 'Terjadi kesalahan saat menghapus data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchStock]);


  const renderCalendarInput = (name, label) => {
    let dateValue = null;
    if (form[name]) {
      const dateString = form[name] + 'T12:00:00';
      dateValue = new Date(dateString);
      
      if (isNaN(dateValue.getTime())) {
        dateValue = null;
      }
    }

    return (
      <div className="mb-3">
        <label htmlFor={name}>{label}</label>
        <Calendar
          id={name}
          name={name}
          value={dateValue}
          onChange={(e) => handleCalendarChange(name, e.value)}
          dateFormat="yy-mm-dd"
          showIcon
          className="w-full mt-2"
          placeholder={`Pilih ${label}`}
        />
        <small className="text-gray-500">
          Current value: {form[name] || 'kosong'} | Display: {dateValue ? dateValue.toLocaleDateString('id-ID') : 'kosong'}
        </small>
      </div>
    );
  };

  const handleEdit = useCallback((row) => {    
    // Parse tanggal dengan benar (tanggal sudah dalam format YYYY-MM-DD dari fetchStock)

    console.log('Editing row:', row);
    setDialogMode('edit');
    setSelectedStock(row);
    
    const formData = { ...row };
    
    if (formData.TGL_MASUK) {
      formData.TGL_MASUK = parseDateFromDB(formData.TGL_MASUK);
    }
    if (formData.EXPIRED) {
      formData.EXPIRED = parseDateFromDB(formData.EXPIRED);
    }
    

    console.log('Form data for edit:', formData); // Debug log

    console.log('Form data for edit:', formData); 

    setForm(formData);
  }, []);

  // Render Dialog Form
  const renderDialogForm = () => (
    <Dialog
      header={dialogMode === 'add' ? 'Tambah Stock' : 'Edit Stock'}
      visible={!!dialogMode}
      onHide={() => {
        setDialogMode(null);
        setForm(initialFormState);
        setSelectedStock(null);
      }}
      style={{ width: '40rem' }}
    >
      {/* <div className="mb-4">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Cari berdasarkan satuan"
            value={searchSatuan}
            onChange={(e) => setSearchSatuan(e.target.value)}
          />
        </span>
      </div> */}


      <form onSubmit={handleSubmit}>
        {/* Field gudang */}
        <div className="mb-3">
          <label htmlFor="gudang">Gudang</label>
          <Dropdown
            id="gudang"
            name="gudang"
            value={form.gudang}
            options={listGudang}
            onChange={handleChange}
            placeholder="Pilih Gudang"
            className="w-full mt-2"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        {/* Field lainnya */}
        {['KODE', 'KODE_TOKO', 'NAMA', 'JENIS'].map((field) => (
          <div key={field} className="mb-3">
            <label htmlFor={field}>{field.replace(/_/g, ' ')}</label>
            <InputText
              id={field}
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              className="w-full mt-2"
            />
          </div>
        ))}

        {/* Dropdown fields */}
        <div className="mb-3">
          <label htmlFor="GOLONGAN">Golongan</label>
          <Dropdown
            id="GOLONGAN"
            name="GOLONGAN"
            value={form.GOLONGAN}
            options={golonganOptions}
            onChange={handleChange}
            className="w-full mt-2"
            placeholder="Pilih Golongan"
            optionLabel="label"
            optionValue="value"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="RAK">RAK</label>
          <Dropdown
            id="RAK"
            name="RAK"
            value={form.RAK}
            options={rakOptions}
            onChange={handleChange}
            className="w-full mt-2"
            placeholder="Pilih RAK"
            optionLabel="label"
            optionValue="value"
          />
        </div>
        
        {/* Field lainnya */}
        {['DOS'].map((field) => (
          <div key={field} className="mb-3">
            <label htmlFor={field}>{field.replace(/_/g, ' ')}</label>
            <InputText
              id={field}
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              className="w-full mt-2"
            />
          </div>
        ))}
        
        <div className="mb-3">
          <label htmlFor="SATUAN">Satuan</label>
          <Dropdown
            id="SATUAN"
            name="SATUAN"
            value={form.SATUAN}
            options={satuanOptions}
            onChange={handleChange}
            className="w-full mt-2"
            placeholder="Pilih Satuan"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        {['ISI', 'DISCOUNT', 'HB', 'HJ'].map((field) => (
          <div key={field} className="mb-3">
            <label htmlFor={field}>{field.replace(/_/g, ' ')}</label>
            <InputText
              id={field}
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              className="w-full mt-2"
            />
          </div>
        ))}

        {/* Calendar fields */}
        {renderCalendarInput('TGL_MASUK', 'Tanggal Masuk')}
        {renderCalendarInput('EXPIRED', 'Tanggal Expired')}

        {['BERAT'].map((field) => (
          <div key={field} className="mb-3">
            <label htmlFor={field}>{field.replace(/_/g, ' ')}</label>
            <InputText
              id={field}
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              className="w-full mt-2"
            />
          </div>
        ))}

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            label="Batal" 
            severity="secondary" 
            onClick={() => {
              setDialogMode(null);
              setForm(initialFormState);
              setSelectedStock(null);
            }}
          />
          <Button 
            type="submit" 
            label="Simpan" 
            severity="primary" 
            icon="pi pi-save" 
            loading={isLoading}
          />
        </div>
      </form>
    </Dialog>
  );
<div className="mb-3 flex gap-3 items-center">
  <Dropdown
    value={filterSatuan}
    options={satuanOptions}
    onChange={(e) => {
      const selected = e.value;
      setFilterSatuan(selected);
      if (selected) {
        fetchStockBySatuan(selected);
      } else {
        fetchStock(); 
      }
    }}
    placeholder="Filter berdasarkan Satuan"
    className="w-64"
    optionLabel="label"
    optionValue="value"
    showClear
  />
</div>

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Master Stock</h3>
      
      <Button
        label="Tambah Stock"
        icon="pi pi-plus"
        className="mb-3"
        onClick={() => {
          setDialogMode('add');
          setForm(initialFormState);
          setSelectedStock(null);
        }}
      />
      <Button
            label="Reset Filter"
            icon="pi pi-refresh"
            severity="secondary"
            onClick={clearRakFilter}
            className="mb-3 ml-3"
          />

      <div className="mb-3 flex gap-3 items-center">
  <Dropdown
    value={filterSatuan}
    options={satuanOptions}
    onChange={(e) => {
      const selected = e.value;
      setFilterSatuan(selected);
      if (selected) {
        fetchStockBySatuan(selected);
      } else {
        fetchStock(); 
      }
    }}
    placeholder="Filter berdasarkan Satuan"
    className="w-64"
    optionLabel="label"
    optionValue="value"
    showClear
  />
  </div>
      <div className="mb-4 p-3 border rounded-lg bg-gray-50">
       <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label htmlFor="rakFilter" className="block mb-1 text-sm font-medium">
              Filter by Rak
            </label>
            <Dropdown
              id="rakFilter"
              value={selectedRakFilter}
              options={rakOptions}
              onChange={handleRakFilterChange}
              className="w-full"
              placeholder="pilih rak"
              optionLabel="label"
              optionValue="value"
              showClear
            />
          </div>
        </div>
      </div>


      <DataTable
        value={filteredStocks}
        paginator
        rows={10}
        loading={isLoading}
        scrollable
        size="small"
        emptyMessage="Tidak ada data stock"
        header={
          <div className="flex justify-between items-center">
           
          </div>
        }
      >
        {Object.keys(initialFormState)

          .filter(key => key !== 'BERAT') // Sembunyikan beberapa field jika perlu

          .filter(key => key !== 'BERAT')

          .map(key => (
            <Column 
              key={key} 
              field={key} 
              header={key.replace(/_/g, ' ')}
              body={key === 'TGL_MASUK' || key === 'EXPIRED' ? 
                (rowData) => {
                  const dateValue = rowData[key];
                  if (!dateValue) return '-';
                  try {
                    const date = new Date(dateValue + 'T12:00:00');
                    return date.toLocaleDateString('id-ID');
                  } catch (e) {
                    return dateValue;
                  }
                } 
                : undefined
              }
            />
          ))}
          
        <Column
          header="Aksi"
          body={(row) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                size="small"
                severity="warning"
                onClick={() => handleEdit(row)}
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

      {renderDialogForm()}
      <ToastNotifier ref={toastRef} />
    </div>
  );
};

export default StockPage;