import React, { Component } from 'react';
import { IFromClientChatMessage, IFromServerChatMessage, IClientIntroductionMessage } from '../../../interfaces';
import Button from '@material/react-button';
import TextField, { HelperText, Input } from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';

interface WebSocketWrapperState {
	clientId: number;
	websocket: WebSocket;
	clientMessage: string;
	receivedMessageHistory: IFromServerChatMessage[];
	chatroom: string;
}

interface WebSocketWrapperProps {
	clientId: number;
	websocketServerUrl: string;
}

export class WebSocketChatBox extends Component<WebSocketWrapperProps, WebSocketWrapperState> {
	state: WebSocketWrapperState;

	// TODO - make it so you don't have to refresh the whole webpage to reconnect if the server is restarted
	constructor(props: WebSocketWrapperProps) {
		super(props);
		this.state = {
			clientId: 0,
			websocket: new WebSocket(props.websocketServerUrl),
			clientMessage: "",
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

	onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			clientMessage: event.currentTarget.value
		} as Pick<WebSocketWrapperState, keyof WebSocketWrapperState>);
		console.log(this.state.clientMessage);
	}

	onClickSend = () => {
		if (this.state.clientMessage.length === 0) {
			alert("No blank messages.");
			return;
		}
		console.log(`Sending message: ${this.state.clientMessage}`);
		const msg: IFromClientChatMessage = {
			messageType: "chatMessage",
			clientId: this.state.clientId,
			content: this.state.clientMessage,
			chatroom: this.state.chatroom,
			previousMessageId: this.state.receivedMessageHistory.length
		}
		const msgString = JSON.stringify(msg);
		this.state.websocket.send(msgString);
		this.setState({clientMessage: ""})
	}

	render() {
		return(
			<div>
				<p>Your message here:</p>
				<br/>
				<TextField
					outlined={true}
					label={`${this.props.clientId}:`}
					helperText={<HelperText>This is the helper text</HelperText>}
					onTrailingIconSelect={() => this.setState({ clientMessage: "" })}
					trailingIcon={<MaterialIcon role="button" icon="clear" />}
				>
					<Input
						value={this.state.clientMessage}
						onChange={this.onInputChange} />
				</TextField>
				
				<Button
					raised
					color="primary"
					onClick={this.onClickSend}>
					Send
				</Button>
			</div>
		);
	}
}