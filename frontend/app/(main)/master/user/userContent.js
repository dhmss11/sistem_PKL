'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import ToastNotifier from '@/app/components/ToastNotifier';
export const dynamic = "force-dynamic";

const defaultForm = {
  name: '',
  password: '',
  email: '',
  role: '',
};

const UserContent = () => {
  const toastRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [roleOptions, setRoleOptions] = useState([]);

const fetchRoles = async () => {
  try {
    const res = await fetch('/api/jenis-role');
    const json = await res.json();

    if (res.ok && Array.isArray(json.data)) {
      // mapping data backend ke format primereact dropdown
      const mapped = json.data.map((r) => ({
        label: r.role, // label yang tampil
        value: r.role, // value yang dikirim ke form
      }));
      setRoleOptions(mapped);
    } else {
      toastRef.current?.showToast('99', 'Gagal memuat role');
    }
  } catch (err) {
    console.error('Fetch role error:', err);
    toastRef.current?.showToast('99', 'Gagal memuat role');
  }
};


const fetchUser = async () => {
  try {
    const res = await fetch('/api/users');
    const json = await res.json();

    if (json.users && Array.isArray(json.users)) {
      setUsers(json.users);
    } else {
      console.error('Format data API tidak sesuai:', json);
    }
  } catch (err) {
    console.error('Error fetch user:', err);
  }
};

  const resetFormAndCloseDialog = () => {
    setForm(defaultForm);
    setDialogMode(null);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (dialogMode === 'add') {
      if (!form.name || !form.email || !form.password || !form.role) {
        toastRef.current?.showToast('99', 'Semua field wajib diisi');
        setIsSubmitting(false);
        return;
      }
    } else if (dialogMode === 'edit') {
      if (!form.name || !form.email || !form.role) {
        toastRef.current?.showToast('99', 'Name, email, dan role wajib diisi');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      let res, json;

      if (dialogMode === 'add') {
        res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else if (dialogMode === 'edit' && selectedUser) {
        const payload = {
          name: form.name,
          email: form.email,
          role: form.role,
        };

        if (form.password !== '') payload.password = form.password;

        res = await fetch(`/api/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      json = await res.json();

      if (!res.ok) {
        if (json?.errors) {
          json.errors.forEach((err) => {
            toastRef.current?.showToast('99', `${err.field}: ${err.message}`);
          });
        } else {
          toastRef.current?.showToast('99', json.message || 'Gagal menyimpan data');
        }
        setIsSubmitting(false);
        return;
      }

      toastRef.current?.showToast(json.status, json.message);
      resetFormAndCloseDialog();
      await fetchUser();
    } catch (error) {
      toastRef.current?.showToast('99', 'Gagal menyimpan data');
      console.error('Submit error:', error);
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (user) => {
    if (!confirm(`Hapus user "${user.name}"?`)) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      const json = await res.json();

      if (json.status === '00') {
        toastRef.current?.showToast('00', json.message);
        await fetchUser();
      } else {
        toastRef.current?.showToast(json.status ?? '99', json.message);
      }
    } catch (err) {
      console.error('Delete error:', err);
      toastRef.current?.showToast('99', 'Gagal menghapus user');
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRoles();
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
            setForm(defaultForm);
            setSelectedUser(null);
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
          <Column field="name" header="name" filter />
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
                    role: row.role,
                  });
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
      key={dialogMode}
      header={dialogMode === 'add' ? 'Tambah User' : 'Edit User'}
      visible={dialogMode !== null}
      style={{ width: '400px' }}
      modal
      onHide={() => setDialogMode(null)}
    >

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mb-3">
            <label htmlFor="name">name</label>
            <InputText
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              className="w-full mt-3"
              placeholder="Username"
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
              placeholder='Password'
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role">Role</label>
            <Dropdown
              id="role"
              name="role"
              value={form.role}
              options={roleOptions}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.value }))}
              className="w-full mt-3"
              placeholder="Pilih Role"
            />
          </div>
            <div className="flex justify-end">
            <Button
              type="submit"
              label="Submit"
              severity="success"
              icon="pi pi-save"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Dialog>

      <ToastNotifier ref={toastRef} />
    </div>
  );
};


export default UserContent;