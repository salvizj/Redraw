import React, { useState } from 'react';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import Label from '../Label/Label';
import styles from './Form.module.css';

type JoinRoomFormProps = {
	onSubmit: (formData: { username: string; roomUserId: string }) => void;
};

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({ onSubmit }) => {
	const [formData, setFormData] = useState({ username: '', roomUserId: '' });

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

			<Label htmlFor="roomUserId">Room ID</Label>
			<InputField
				type="text"
				value={formData.roomUserId}
				onChange={handleChange}
				placeholder="Enter room ID"
				name="roomUserId"
			/>

			<Button type="submit">Join A Room</Button>
		</form>
	);
};

export default JoinRoomForm;
