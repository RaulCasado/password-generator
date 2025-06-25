import { useEffect } from 'react';
import './toast.css';

export function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    return (
        <div className={`toast-item ${type}`} onClick={onClose}>
            {message}
        </div>
    );
}