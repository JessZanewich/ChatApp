import React, { Component } from 'react';

interface WebSocketWrapperState {
	ws: WebSocket;
	message: string;
	receivedMessageHistory: string;
}

interface WebSocketWrapperProps {
	url: string;
}

export class WebSocketChatBox extends Component<WebSocketWrapperProps, WebSocketWrapperState> {
	state: WebSocketWrapperState;

	constructor(props: WebSocketWrapperProps) {
		super(props);
		this.state = {
			ws: new WebSocket(props.url),
			message: "",
			receivedMessageHistory: ""
		};
		
		this.state.ws.onmessage = (event) => this.setState((previousState) => {
			//! This is a bad way to do it because you have to copy the entire message history every time a new message comes in
			// TODO figure out a more efficient way to do this setState.
			let newState = {...previousState};
			newState.receivedMessageHistory += event.data;
			return newState;
		});

		this.state.ws.onopen = () => {
			const testMessage = {
				"sender": "React client",
				"time": new Date(),
				"content": "Greetings",
				"chatroom": "general"
			}
			const testMessageString: string = JSON.stringify(testMessage);
			this.state.ws.send(testMessageString);
			console.log(`Sent message: ${testMessageString}`);
		}
	}

	onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			message: e.currentTarget.value
		} as Pick<WebSocketWrapperState, keyof WebSocketWrapperState>);
		console.log(e.currentTarget.value);
	}

	onSendMessage = () => {
		this.state.ws.send(this.state.message);
	}

	render() {
		return( // Note: whatever is returned by the Component.render() method MUST be wrapped in a div or some other element, so that you're only returning a single top-level element
			<div>
				<input type="text" />
				<button onClick={this.onSendMessage}>Send</button>
			</div>
		);
	}
}