import styles from "./index.module.css";

const PageBox = ({ children }) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    );
};

export default PageBox;