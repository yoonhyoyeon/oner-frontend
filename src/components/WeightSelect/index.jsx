import { useState, useEffect } from 'react';
import styles from './index.module.css';

const WeightSelect = ({ 
    label, 
    value = 0.5, 
    onChange,
    min = 0,
    max = 1,
    step = 0.1,
    disabled = false,
    error = false
}) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setLocalValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.labelContainer}>
                <span className={styles.label}>{label}</span>
                <span className={`${styles.value} ${error ? styles.error : ''}`}>
                    {localValue.toFixed(1)}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={localValue}
                onChange={handleChange}
                className={`${styles.slider} ${error ? styles.error : ''}`}
                disabled={disabled}
            />
            <div className={styles.progressBar}>
                <div 
                    className={`${styles.progress} ${error ? styles.error : ''}`}
                    style={{ width: `${(localValue / max) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default WeightSelect; 