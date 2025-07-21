'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import ToastNotifier from '@/app/components/ToastNotifier'; // Pastikan path sesuai struktur proyekmu

/**
 * @typedef {Object} User
 * @property {number} [id]
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} phone
 * @property {string} role
 */

const UserPage = () => {
    const toastRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dialogMode, setDialogMode] = useState(null); // 'add' | 'edit'
    const [selectedUser, setSelectedUser] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const fetchUser = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/users');
            const json = await res.json();

            setUsers(json.data.users);
        } catch (err) {
            console.error(`Failed to fetch: ${err}`);
            toastRef.current?.showToast('99', 'Gagal memuat data user');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

 const handleSubmit = async (data) => {
    let updated;

   if (dialogMode === 'add') {
    console.log('Data yang dikirim ke backend:', data);

    const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

        const json = await res.json();
        const body = json.data;

        if (body.status === '00') {
            toastRef.current?.showToast(body.status, body.message);
            updated = body.user;
            setUsers((prev) => [...prev, updated]);
        } else {
            toastRef.current?.showToast(body.status, body.message);
        }
    } else if (dialogMode === 'edit' && selectedUser) {
        const res = await fetch(`/api/users/${selectedUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (json.status === '00') {
            toastRef.current?.showToast(json.status, json.message);
            updated = json.data.user;
            setUsers((prev) =>
                prev.map((item) => (item.id === updated.id ? updated : item))
            );
        } else {
            toastRef.current?.showToast(json.status, json.message);
        }
    }
    setForm({ name: '', email: '', password: '', role: '' });
    setDialogMode(null);
    setSelectedUser(null);
};

const handleDelete = async (user) => {
    if (!confirm(`hapus user ${user.name}?`))return;

    try {
        const res = await fetch (`/api/users/${user.id}`,{
            method: 'DELETE',
        });
        const json = await res.json();

        if (json.status === '00') {
            toastRef.current?.showToast(json.status, json.message);
        } else {
            toastRef.current?.showToast(json.status, json.message);
        }
    } catch (err) {
        toastRef.current?.showToast('99', 'Gagal menghapus user');
    }
};

    useEffect(() => {
        fetchUser();
    }, []);

  return (
        <div className="card">
            <h3 className="text-xl font-semibold">Master User</h3>

            <div className="flex justify-end my-3">
                <Button
                    label="Tambah User"
                    icon="pi pi-plus"
                    className="text-sm"
                    onClick={() => {
                        setDialogMode('add');
                        setForm({ name: '', email: '', password: '', role: '' });
                    }}
                />
            </div>

            <DataTable
                size="small"
                className="text-sm"
                value={users}
                paginator
                rows={10}
                loading={isLoading}
                scrollable
            >
                <Column field="name" header="Nama" filter />
                <Column field="email" header="Email" />
                <Column field="role" header="Role" />
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
                                    setSelectedUser(row);
                                    setForm({
                                        name: row.name,
                                        email: row.email,
                                        password: '',
                                        role: row.role
                                    });
                                }}
                            />
                            <Button
                                icon="pi pi-trash text-sm"
                                size="small"
                                severity="danger"
                                onClick={() => console.log('delete')}
                            />
                        </div>
                    )}
                    style={{ width: '150px' }}
                />
            </DataTable>

            <Dialog
                header={dialogMode === 'add' ? 'Tambah User' : 'Edit User'}
                visible={dialogMode !== null}
                onHide={() => setDialogMode(null)}
                style={{ width: '30rem' }}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(form);
                    }}
                >
                    <div className="mb-3">
                        <label htmlFor="name">Nama User</label>
                        <InputText
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            type="text"
                            className="w-full mt-3"
                            placeholder="Nama"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            className="w-full mt-3"
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <InputText
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            type="password"
                            className="w-full mt-3"
                            placeholder="Password"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role">Role</label>
                        <Dropdown
                            id="role"
                            name="role"
                            value={form.role}
                            options={['admin', 'user']}
                            onChange={(e) => setForm((prev) => ({ ...prev, role: e.value }))}
                            className="w-full mt-3"
                            placeholder="Pilih Role"
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

export default UserPage;