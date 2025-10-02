/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
          <span>
                Copyright © {new Date().getFullYear()} SIMAMANG. All rights reserved.
            </span>
           
        </div>
    );
};

export default AppFooter;
