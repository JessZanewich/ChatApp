import React, { Component } from 'react';
import Button from '@material/react-button';
import TextField, { HelperText, Input } from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';

interface ChatBoxState {
	chatMessage: string;
}
interface ChatBoxProps {
	handleMessageSend: (chatMessage: string) => void;
}

const ENTER_KEY = 13;

export class WebSocketChatBox extends Component<ChatBoxProps, ChatBoxState> {
	state: ChatBoxState;

	constructor(props: ChatBoxProps) {
		super(props);
		this.state = {
			chatMessage: ''
		};
	}
	
	handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({chatMessage: event.target.value});
	}
	
	onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if(event.keyCode === ENTER_KEY) {
			this.props.handleMessageSend(this.state.chatMessage);
			this.setState({chatMessage: ""});
		}
	}
	
	onMessageSend = () => {
		if (this.state.chatMessage.length === 0) {
			alert("No blank messages.");
			return;
		} else {
			this.props.handleMessageSend(this.state.chatMessage);
			this.setState({chatMessage: ""});
		}
	}
	render() {
		return(
			<div>
				<TextField
					outlined={true}
					label={'Message Box'}
					helperText={<HelperText>This is the helper text</HelperText>}
					onTrailingIconSelect={() => this.setState({ chatMessage: '' })}
					trailingIcon={<MaterialIcon role="button" icon="clear" />}>
					<Input
						value={this.state.chatMessage}
						onChange={this.handleInputChange} 
						onKeyDown={this.onKeyDown} />
				</TextField>
				<Button
					raised
					color="primary"
					onClick={this.onMessageSend}>
					Send
				</Button>
			</div>
		);
	}
}