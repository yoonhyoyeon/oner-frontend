import styles from './index.module.css';

const Input = ({ 
    label, 
    placeholder, 
    value, 
    onChange, 
    type = 'text',
    required = false,
    disabled = false,
    ...others
}) => {
    return (
        <div className={styles.input_container}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                type={type}
                className={styles.input}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                {...others}
            />
        </div>
    );
};

export default Input; 