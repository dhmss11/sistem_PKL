import React, { useContext, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const [openMenu, setOpenMenu] = useState({
        kode: true, 
        master: true,
        laporan : true,
        users : true
    });

    const toggleMenu = (key) => {
        setOpenMenu((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const arrowButton = (key, isOpen) => (
        <i
            className={`pi ${isOpen ? 'pi-chevron-down' : 'pi-chevron-right'} ml-auto cursor-pointer`}
            onClick={(e) => {
                e.stopPropagation(); // supaya gak trigger klik label
                toggleMenu(key);
            }}
        ></i>
    );

    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: (
                <div className="flex align-items-center w-full">
                    <span>Kode</span>
                    {arrowButton('kode', openMenu.kode)}
                </div>
            ),
            items: openMenu.kode
                ? [
                    { label: 'Rak', icon: 'pi pi-fw pi-database', to: '/kode/rak' },
                    { label: 'Satuan Stock', icon: 'pi pi-list', to: '/kode/satuanstock' },
                    { label: 'Golongan Stock', icon: 'pi pi-fw pi-th-large', to: '/kode/golonganstock' }

                ]
                : []
        },
                {
        label: (
            <div className="flex align-items-center w-full">
            <span>Master</span>
            {arrowButton('master', openMenu.master)}
            </div>
        ),
        items: openMenu.master
            ? [
                { label: 'Gudang', icon: 'pi pi-fw pi-building', to: '/master/gudang' },
                { label: 'Produk', icon: 'pi pi-fw pi-box', to: '/master/stock' },
                { label: 'Kirim Barang', icon: 'pi pi-send', to: '/master/kirim-barang' },
                { label: 'Terima Barang', icon: 'pi pi-inbox', to: '/master/terima-barang' },
                {
                label: (
                    <div className="flex align-items-center w-full">
                    <span>Users</span>
                    </div>
                ),
                items: openMenu.users
                    ? [
                        { label: 'Users', icon: 'pi pi-users', to: '/master/user' },
                        { label: 'Role', icon : 'pi pi-shield' , to : '/master/jenis-role'}
                    ]
                    : []
                }
            ]
            : []
        },
        {
            label: (
                <div className="flex align-items-center w-full">
                    <span>Laporan</span>
                    {arrowButton('laporan', openMenu.laporan)}
                </div>
            ),
            items: openMenu.laporan 
            ?[
                { label: 'Kartu Stock', icon: 'pi pi-folder', to: '/laporan/kartustock' }
            ]
            :[]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={i} />
                    ) : (
                        <li className="menu-separator" key={`separator-${i}`}></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
