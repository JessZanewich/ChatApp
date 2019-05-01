import 'typeface-roboto';
import React, { Component } from 'react';
import './App.css';
import { WebSocketChatBox } from './Components/WebSocketChatBox';
import Button from '@material/react-button';
import '@material/react-button/dist/button.css';
import '@material/react-text-field/dist/text-field.css';

interface MyAppState {
	isChatBoxVisisble: boolean;
}

const INITIAL_APP_STATE: MyAppState = {
	isChatBoxVisisble: true
}

// TODO have a check similar to the one in /src/simple-frontend/index.html that prevents the WebSocketChatBox component from rendering if the user's browser doesn't support WebSockets
// TODO create a "you don't have websockets" error message Component to display instead of the WebSocketChatBox in that case.
class App extends Component<{}, MyAppState> {
	state: MyAppState;
	private websocketUrl: string = "ws://localhost:8999";

	constructor() {
		super({});

		this.state = {...INITIAL_APP_STATE};
	}

	onDisconnect = () => {
		console.log("The disconnect button doesn't do anything yet");
		alert("I don't do anything yet")
		this.setState({isChatBoxVisisble: false}) // TODO use conditional rendering in React to hide the WebSocketChatBox (but importantly, also destruct/disconnect the WebSocket it holds) when you press the DISCONNECT button.
	}

	render() {
		return (
			<div className="App">
			{/* TODO make clientName dynamic. Eventually it'll be set automatically by the user auth process, but for now just make it be a textbox with a default */}
				<WebSocketChatBox websocketServerUrl={this.websocketUrl} clientName="John Wick"/> 
				<br />
				<Button
					raised
					color="primary"
					className='button-alternate'
					onClick={this.onDisconnect}>
					Disconnect
				</Button>
			</div>
		);
	}
}

export default App;
