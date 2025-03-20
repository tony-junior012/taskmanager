"use client";
import React from 'react';
import { useToastStore } from '@/app/store/useToastStore';
import Toast from '@/app/components/Toast';

const GlobalToast = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div
            className="fixed bottom-4 right-4 space-y-4 z-50 animate-toast-container"
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default GlobalToast;