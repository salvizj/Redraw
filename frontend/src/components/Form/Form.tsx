import React, { useState } from 'react';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import Label from '../Label/Label';
import styles from './Form.module.css';

interface FormProps {
	onSubmit: (formData: { username: string }) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
	const [formData, setFormData] = useState({
		username: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<Label htmlFor="username">Username</Label>
			<InputField
				type="text"
				value={formData.username}
				onChange={handleChange}
				placeholder="Enter your username"
				name="username"
			/>

			<Button type="submit">Submit</Button>
		</form>
	);
};

export default Form;
