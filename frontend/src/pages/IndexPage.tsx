import React from 'react';
import Form from '../components/Form/Form';

const IndexPage: React.FC = () => {
	const handleFormSubmit = (formData: any) => {
		console.log('Form submitted with:', formData);
	};
	return (
		<div>
			<h1>Index Page</h1>
			<Form onSubmit={handleFormSubmit} />
		</div>
	);
};

export default IndexPage;
