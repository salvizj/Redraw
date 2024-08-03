import React, { useState } from 'react';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import Label from '../Label/Label';
import styles from './Form.module.css';

interface CreateRoomFormProps {
	onSubmit: (formData: { username: string }) => void;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ onSubmit }) => {
	const [username, setUsername] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit({ username });
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<Label htmlFor="username">Username</Label>
			<InputField
				type="text"
				value={username}
				onChange={handleChange}
				placeholder="Enter your username"
				name="username"
			/>
			<Button type="submit">Create A Room</Button>
		</form>
	);
};

export default CreateRoomForm;
