import React, { useState } from 'react';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import Label from '../Label/Label';
import styles from './Form.module.css';

type JoinRoomFormProps = {
	onSubmit: (formData: { username: string; roomId: string }) => void;
};

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({ onSubmit }) => {
	const [formData, setFormData] = useState({ username: '', roomId: '' });

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

			<Label htmlFor="roomId">Room ID</Label>
			<InputField
				type="text"
				value={formData.roomId}
				onChange={handleChange}
				placeholder="Enter room ID"
				name="roomId"
			/>

			<Button type="submit">Join A Room</Button>
		</form>
	);
};

export default JoinRoomForm;
