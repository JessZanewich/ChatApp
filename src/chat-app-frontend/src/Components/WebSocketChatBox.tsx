import React, { Component } from 'react';
import {Message} from '../../../interfaces';
import Button from '@material/react-button';
import TextField, { HelperText, Input } from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';

interface WebSocketWrapperState {
	websocket: WebSocket;
	clientMessage: string;
	receivedMessageHistory: string;
	chatroom: string;
}

interface WebSocketWrapperProps {
	clientName: string;
	websocketServerUrl: string;
}

export class WebSocketChatBox extends Component<WebSocketWrapperProps, WebSocketWrapperState> {
	state: WebSocketWrapperState;

	// TODO - make it so you don't have to refresh the whole webpage to reconnect if the server is restarted
	constructor(props: WebSocketWrapperProps) {
		super(props);
		this.state = {
			websocket: new WebSocket(props.websocketServerUrl),
			clientMessage: "",
			receivedMessageHistory: "",
			chatroom: "general" // TODO - make this settable via a dropdown UI element or something.
		};
		
		this.state.websocket.onmessage = (event) => this.setState((previousState) => {
			//! This is a terrible inefficient way to setState because it copies the entire message history (plus all other properties of state) every time a new message comes in.
			// TODO figure out a more efficient way to do this setState.
			let newState = {...previousState};
			newState.receivedMessageHistory += event.data;
			return newState;
		});

		this.state.websocket.onopen = () => {
			const testMessage: Message = {
				"sender": this.props.clientName,
				"time": new Date().toISOString(),
				"content": `${this.props.clientName} Online.`, // TODO figure out how to make the client have a unique name. The server should assign it a name. Maybe we do this when we set up user auth, and for now we just trust that every client is who they say they are in the "sender" field
				"chatroom": "general"
			}
			const testMessageString: string = JSON.stringify(testMessage);
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
		const msg: Message = {
			sender: this.props.clientName,
			content: this.state.clientMessage,
			time: new Date().toISOString(),
			chatroom: this.state.chatroom
		}
		const msgString = JSON.stringify(msg);
		this.state.websocket.send(msgString);
		this.setState({clientMessage: ""})
	}

	render() {
		return( // Note: whatever is returned by the Component.render() method MUST be wrapped in a div or some other element, so that you're only returning a single top-level element
			<div>
				{/* TODO make it so that you can also hit Enter to send the message (we shouldn't have to just click the Send button) */}
				{/* <input type="text" onChange={this.onInputChange}/> */}
				<p>Your message here:</p>
				<br/>
				<TextField
					// fullWidth={true}
					outlined={true}
					label={`${this.props.clientName}:`}
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