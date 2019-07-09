import React, { Component } from 'react';
import { IFromClientChatMessage, IFromServerChatMessage, IClientIntroductionMessage } from '../../../interfaces';
import { WebSocketChatBox } from './WebSocketChatBox';

interface WebSocketWrapperState {
	clientId: number;
	websocket: WebSocket;
	receivedMessageHistory: IFromServerChatMessage[];
	sentMessageHistory: IFromClientChatMessage[];
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
			receivedMessageHistory: [], // TODO - add all messages that the server sends to this array as they are sent
			sentMessageHistory: [], // TODO - add messages that the client sends to this array as they are sent
			chatroom: "general" // TODO - make this settable via a dropdown UI element or something.
		};
		
		this.state.websocket.onmessage = (event) => this.setState((previousState) => {
			console.log(`Received message: ${event.data}`);
			let newMsgHistory = previousState.receivedMessageHistory;
			const parsedMsg = JSON.parse(event.data) as IFromServerChatMessage;
			newMsgHistory.push(parsedMsg);
			return {
				receivedMessageHistory: newMsgHistory
			};
		});

		this.state.websocket.onopen = () => {
			const introMessage: IClientIntroductionMessage = {
				"clientId": this.props.clientId,
				"messageType": "clientIntro",
				"previousMessageId": 0
			};
			const testMessageString: string = JSON.stringify(introMessage);
			this.state.websocket.send(testMessageString);
			console.log(`Sent message: ${testMessageString}`);
		}
	}

	handleMessageSend = (chatMessage: string) => {
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

		this.setState(previousState => {
			let sentHistory = previousState.sentMessageHistory;
			sentHistory.push(msg);

			return {
				sentMessageHistory: sentHistory
			}
		})
		this.state.websocket.send(msgString);
	}

	render() {
		return(
			<>
                <WebSocketChatBox
					handleMessageSend={this.handleMessageSend} />
			</>
		);
	}
}