'use client';
import { useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export default function Modal({ isOpen, onClose, title, message }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

    return (

        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="fixed inset-0 m-auto backdrop:bg-black/50 p-6 rounded-lg shadow-xl border border-gray-200 max-w-sm w-full animate-in fade-in zoom-in duration-200"
        >
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <p className="text-gray-600">{message}</p>

                <button
                    onClick={onClose}
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                    Понятно
                </button>
            </div>
        </dialog>


    );
}
