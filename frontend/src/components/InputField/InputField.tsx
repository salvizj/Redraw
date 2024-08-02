import React from 'react';
import styles from './InputField.module.css';

interface InputFieldProps {
	type?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	name: string;
}

const InputField: React.FC<InputFieldProps> = ({
	type = 'text',
	value,
	onChange,
	placeholder,
	name,
}) => {
	return (
		<input
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			name={name}
			className={styles.input}
		/>
	);
};

export default InputField;
