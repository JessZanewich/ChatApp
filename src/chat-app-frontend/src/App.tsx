import React, { Component } from 'react';
import './App.css';
import { WebSocketChatBox } from './Components/WebSocketChatBox';

interface MyAppState {
	isChatBoxVisisble: boolean;
}

const initialState = {
	isChatBoxVisisble: true
}

class App extends Component {
	state: MyAppState;
	private websocketUrl: string = "ws://localhost:8999";

	constructor() {
		super({});

		this.state = {...initialState};
	}

	onDisconnect = () => {
		this.setState({isChatBoxVisisble: false})
	}

	render() {
		return (
			<div className="App">
				<WebSocketChatBox url={this.websocketUrl}/>
				<br />
				<button onClick={this.onDisconnect}>
					DISCONNECT
				</button>
			</div>
		);
	}
}

export default App;
