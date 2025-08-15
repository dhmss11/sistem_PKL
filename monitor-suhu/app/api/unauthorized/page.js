// app/unauthorized/page.js
'use client';
import React from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '../(auth)/context/authContext';

const UnauthorizedPage = () => {
    const router = useRouter();
    const { user } = useAuth();

    const handleGoBack = () => {
        router.back();
    };

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="flex align-items-center justify-content-center min-h-screen">
            <div className="text-center">
                <i className="pi pi-ban text-red-500" style={{ fontSize: '5rem' }}></i>
                
                <h1 className="text-6xl font-bold text-900 mb-3">403</h1>
                
                <h2 className="text-2xl font-semibold text-700 mb-3">
                    Access Denied
                </h2>
                
                <p className="text-500 mb-4 max-w-md">
                    Kamu tidak punya ijin untuk masuk ke Halaman ini. 
                    {user && (
                        <span> Your role: <strong>{user.role}</strong></span>
                    )}
                </p>
                
                <div className="flex gap-2 justify-content-center">
                    <Button
                        label="Go Back"
                        icon="pi pi-arrow-left"
                        className="p-button-outlined"
                        onClick={handleGoBack}
                    />
                    
                    <Button
                        label="Go Home"
                        icon="pi pi-home"
                        onClick={handleGoHome}
                    />
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;