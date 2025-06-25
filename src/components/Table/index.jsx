import styles from './index.module.css';

const Table = ({ headers, data, isScroll = false, customRenderers = {} }) => {
    const renderCell = (header, value) => {
        if (customRenderers[header]) {
            return customRenderers[header](value);
        }
        return value;
    };

    return (
        <div className={`${styles.table_container} ${isScroll ? styles.scroll : ''}`}>
            <table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((header, cellIndex) => (
                                <td key={cellIndex}>
                                    {renderCell(header, row[header])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;