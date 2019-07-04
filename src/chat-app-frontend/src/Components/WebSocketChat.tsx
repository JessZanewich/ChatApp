import React, { Component } from 'react';
import { IFromClientChatMessage, IFromServerChatMessage, IClientIntroductionMessage } from '../../../interfaces';
import { WebSocketChatBox } from './WebSocketChatBox';
import { handleMessage } from '../../../backend/handlers';

interface WebSocketWrapperState {
	clientId: number;
	websocket: WebSocket;
	receivedMessageHistory: IFromServerChatMessage[];
	chatroom: string;
}

interface WebSocketWrapperProps {
	clientId: number;
	websocketServerUrl: string;
}

export class WebSocketChat extends Component<WebSocketWrapperProps, WebSocketWrapperState> {
	state: WebSocketWrapperState;

	// TODO - make it so you don't have to refresh the whole webpage to reconnect if the server is restarted
	constructor(props: WebSocketWrapperProps) {
		super(props);
		this.state = {
			clientId: 0,
			websocket: new WebSocket(props.websocketServerUrl),
			receivedMessageHistory: [],
			chatroom: "general" // TODO - make this settable via a dropdown UI element or something.
		};
		
		this.state.websocket.onmessage = (event) => this.setState((previousState) => {
			console.log(`Received message: ${event.data}`);
			//! This is a terrible inefficient way to setState because it copies the entire message history (plus all other properties of state) every time a new message comes in.
			// TODO figure out a more efficient way to do this setState.
			let newState = {...previousState};
			const parsedMsg = JSON.parse(event.data) as IFromServerChatMessage;
			newState.receivedMessageHistory.push(parsedMsg);
			return newState;
		});

		this.state.websocket.onopen = () => {
			const introMessage: IClientIntroductionMessage = {
				"clientId": this.props.clientId,
				"messageType": "clientIntro",
				"previousMessageId": 0
			}
			const testMessageString: string = JSON.stringify(introMessage);
			this.state.websocket.send(testMessageString);
			console.log(`Sent message: ${testMessageString}`);
		}
	}

	handleMessage = (chatMessage: string) => {
		if (chatMessage.length === 0) {
			alert("No blank messages.");
			return;
		}
		console.log(`Sending message: ${chatMessage}`);
		const msg: IFromClientChatMessage = {
			messageType: "chatMessage",
			clientId: this.state.clientId,
			content: chatMessage,
			chatroom: this.state.chatroom,
			previousMessageId: this.state.receivedMessageHistory.length
		}
		const msgString = JSON.stringify(msg);
		console.log(msgString);

		this.state.websocket.send(msgString);
	}

	render() {
		return(
			<div>
                <WebSocketChatBox
					handleMessageSend={this.handleMessage} />
			</div>
		);
	}
}