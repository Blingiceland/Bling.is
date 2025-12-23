import React from 'react';
import { Toaster } from 'sonner';

export function ToastProvider({ children }) {
    return (
        <>
            {children}
            <Toaster
                position="top-center"
                theme="dark"
                toastOptions={{
                    style: {
                        background: '#111',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                    },
                    className: 'font-sans'
                }}
            />
        </>
    );
}
