import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	onClick,
	type = 'button',
	disabled = false,
	children,
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={styles.button}
		>
			{children}
		</button>
	);
};

export default Button;
