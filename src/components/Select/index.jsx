import React from 'react';
import styles from './index.module.css';

const Select = ({ 
    label, 
    value = [], 
    onChange, 
    options = [],
    placeholder,
    multiple = false,
    error = false
}) => {
    const handleChange = (e) => {
        if (multiple) {
            const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
            onChange(selectedOptions);
        } else {
            onChange(e.target.value);
        }
    };

    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}
            <select
                className={`${styles.select} ${error ? styles.error : ''}`}
                value={value}
                onChange={handleChange}
                multiple={multiple}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select; 