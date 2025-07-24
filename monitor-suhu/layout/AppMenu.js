/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Master',
            icon: 'pi pi-fw pi-sitemap',
            items: [
                {
                    label: 'Jenis Gudang',
                    icon: 'pi pi-fw pi-th-large',
                    to: '/master/jenis-gudang'
                },
                {
                    label: 'Gudang',
                    icon: 'pi pi-fw pi-building',
                    to: '/master/gudang'
                },
                {
                    label: 'Produk',
                    icon: 'pi pi-fw pi-box',
                    to: '/master/produk'
                },
            ]
        },
        {
            label: 'Monitor',
            icon: 'pi pi-fw pi-chart-bar',
            items: [
                {
                    label: 'Update Suhu Mesin',
                    icon: 'pi pi-fw pi-sync',
                    to: '/monitor/suhu'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator" key={`separator-${i}`}></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
