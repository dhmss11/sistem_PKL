'use client';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

/**
 * @typedef {Object} Gudang
 * @property {number} id
 * @property {string} nama
 * @property {string} alamat
 * @property {string} keterangan
 */

/**
 * @param {{
 *   data: Gudang[],
 *   loading: boolean,
 *   onEdit: (gudang: Gudang) => void,
 *   onDelete: (gudang: Gudang) => void
 * }} props
 */
const GudangTable = ({ data = [], loading = false, onEdit, onDelete }) => {
    return (
        <DataTable
            size="small"
            className="text-sm"
            value={data}
            paginator
            rows={10}
            loading={loading}
            scrollable
            emptyMessage="Tidak ada data gudang"
        >
            <Column field="nama" header="Nama Gudang" filter />
            <Column field="alamat" header="Alamat" filter />
            <Column field="keterangan" header="Keterangan" />
            <Column
                header="Aksi"
                body={(row) => (
                    <div className="flex gap-2">
                        <Button
                            icon="pi pi-pencil"
                            className="text-sm"
                            size="small"
                            severity="warning"
                            onClick={() => onEdit?.(row)}
                        />
                        <Button
                            icon="pi pi-trash"
                            className="text-sm"
                            size="small"
                            severity="danger"
                            onClick={() => onDelete?.(row)}
                        />
                    </div>
                )}
                style={{ width: '150px' }}
            />
        </DataTable>
    );
};

export default GudangTable;
