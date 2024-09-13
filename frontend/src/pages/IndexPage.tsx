import React from "react"
import LobbyForm from "../components/LobbyForm"

const IndexPage: React.FC = () => {
	return (
		<div className="page-container">
			<div className="content-container">
				<h1 className="heading-primary">Redraw</h1>
				<LobbyForm />
			</div>
		</div>
	)
}

export default IndexPage
