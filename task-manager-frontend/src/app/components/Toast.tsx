"use client";
import React, { useEffect } from "react";
import Image from "next/image";

type ToastProps = {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
    // Controle para auto-dismiss (fechamento automático)
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    // Estilo de fundo diferente dependendo do tipo
    const backgroundColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    };

    return (
        <div
            className={`flex items-center justify-between w-full max-w-sm shadow-md rounded-lg px-4 py-3 font-medium text-white transform transition-all duration-500 ease-in-out ${backgroundColors[type]} z-50`}
        >
            <div className="flex items-center">
                <span className="text-base leading-6 mr-4">{message}</span>
            </div>
            <button
                className="ml-4 p-1 rounded-full hover:bg-white/10"
                onClick={onClose}
                aria-label="Close"
            >
                <Image
                    src="/close.svg"
                    alt="Fechar toast"
                    width={20}
                    height={20}
                    className="opacity-80 hover:opacity-100"
                />
            </button>
        </div>
    );
};

export default Toast;
