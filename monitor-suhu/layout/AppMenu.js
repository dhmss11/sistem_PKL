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
            label: 'Kode',
            icon: 'pi pi-fw pi-sitemap',
            items: [
                {
                    label: 'Rak',
                    icon: 'pi pi-fw pi-database',
                    to: '/kode/rak'
                },
                {   label: 'Satuan Stock', 
                    icon: 'pi pi-list', 
                    to: '/kode/satuanstock' 
                }
            ]
            
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
                    label: 'Stock',
                    icon: 'pi pi-fw pi-box',
                    to: '/master/stock'
                },
            ]
        },
        {
            label: 'Laporan',
            icon: 'pi pi-fw pi-chart-bar',
            items: [
                {
                    label: 'Kartu Stock',
                    icon: 'pi pi-fw pi-sync',
                    to: '/laporan/kartustock'
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
