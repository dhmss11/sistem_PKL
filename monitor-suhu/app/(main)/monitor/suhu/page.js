'use client';

import SuhuDialogForm from '@/app/(main)/monitor/suhu/components/SuhuDialogForm';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { useEffect, useRef, useState } from 'react';
import { formatISODate } from '@/utils/format-iso-date';
import { FileUpload } from 'primereact/fileupload';
import ToastNotifier, { ToastNotifierHandle } from '@/app/components/ToastNotifier';

const SuhuPage = () => {
    const toastRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [monitorSuhu, setMonitorSuhu] = useState([]);
    const [mesin, setMesin] = useState([]);
    const [selectedMonitorSuhu, setSelectedMonitorSuhu] = useState(null);
    const [dialogMode, setDialogMode] = useState(null);
    const [fileUploadDialog, setFileUploadDialog] = useState(false);

    const fetchMasterMesin = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/mesin');
            const json = await res.json();
            setMesin(json.data.master_mesin);
        } catch (err) {
            console.error(`Failed to fetch: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMonitorSuhu = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/monitor-suhu');
            const json = await res.json();
            if (json.data.status !== '03') {
                setMonitorSuhu(json.data.monitor_suhu);
            }
        } catch (err) {
            console.error(`Failed to fetch: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        let updated;

        if (dialogMode === 'add') {
            const res = await fetch('/api/monitor-suhu', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            const json = await res.json();
            updated = json.data.monitor_suhu;
            setMonitorSuhu((prev) => [...prev, updated]);
        } else if (dialogMode === 'edit' && selectedMonitorSuhu) {
            const res = await fetch(`/api/monitor-suhu/${selectedMonitorSuhu.id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            const json = await res.json();
            updated = json.data.monitor_suhu;
            setMonitorSuhu((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        }

        setDialogMode(null);
        setSelectedMonitorSuhu(null);
    };

    useEffect(() => {
        fetchMonitorSuhu();
        fetchMasterMesin();
    }, []);

    return (
        <div className="card">
            <h3 className="text-xl font-semibold">Update Suhu Mesin</h3>
            <div className="flex justify-content-end gap-3 my-3">
                <Button label="Import excel" icon="pi pi-file" size="small" onClick={() => setFileUploadDialog(true)} />
                <Button label="Tambah Data" icon="pi pi-plus" size="small" onClick={() => {
                    setDialogMode('add');
                    setSelectedMonitorSuhu(null);
                }} />
            </div>
            <DataTable value={monitorSuhu} loading={isLoading} paginator rows={10} scrollable size="small" className="text-sm">
                <Column field="kode_mesin" header="Kode Mesin" filter />
                <Column
                    field="tanggal_input"
                    header="Tanggal Input"
                    sortable
                    body={(row) => formatISODate(row.tanggal_input)}
                />
                <Column field="keterangan_suhu" header="Keterangan Suhu" body={(row) => `${row.keterangan_suhu}°C`} />
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
                                    setSelectedMonitorSuhu(row);
                                    setDialogMode('edit');
                                }}
                            />
                            <Button
                                icon="pi pi-trash"
                                size="small"
                                severity="danger"
                                onClick={() => {
                                    confirmDialog({
                                        message: `Yakin ingin menghapus data ${row.id_mesin}`,
                                        header: 'Konfirmasi Hapus',
                                        acceptLabel: 'Hapus',
                                        rejectLabel: 'Batal',
                                        acceptClassName: 'p-button-danger',
                                        accept: async () => {
                                            try {
                                                const res = await fetch(`/api/monitor-suhu/${row.id}`, {
                                                    method: 'DELETE',
                                                });
                                                if (!res.ok) throw new Error('Gagal menghapus data monitor suhu');
                                                setMonitorSuhu((prev) => prev.filter((item) => item.id !== row.id));
                                            } catch (err) {
                                                console.error(err.message);
                                            }
                                        }
                                    });
                                }}
                            />
                        </div>
                    )}
                />
            </DataTable>

            <ConfirmDialog />

            <SuhuDialogForm
                visible={dialogMode !== null}
                mode={dialogMode}
                initialData={selectedMonitorSuhu}
                mesin={mesin}
                onHide={() => {
                    setDialogMode(null);
                    setSelectedMonitorSuhu(null);
                }}
                onSubmit={handleSubmit}
            />

            <Dialog style={{ minWidth: '70vw' }} header="Import Data" visible={fileUploadDialog} onHide={() => setFileUploadDialog(false)}>
                <FileUpload
                    name="file"
                    url="/api/monitor-suhu/import"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    chooseLabel="Upload Excel"
                    customUpload
                    uploadHandler={async (event) => {
                        const file = event.files[0];
                        const formData = new FormData();
                        formData.append('file', file);

                        try {
                            const res = await fetch('/api/monitor-suhu/import', {
                                method: 'POST',
                                body: formData,
                            });
                            const json = await res.json();
                            if (!res.ok) throw new Error(json.message || 'Import failed');

                            toastRef.current?.showToast(json.data.status, json.data.message);
                            if (json.data.status === '00') {
                                await fetchMonitorSuhu();
                                setFileUploadDialog(false);
                            }
                        } catch (err) {
                            console.error(`Import Error: ${err.message}`);
                        }
                    }}
                />
            </Dialog>

            <ToastNotifier ref={toastRef} />
        </div>
    );
};

export default SuhuPage;
