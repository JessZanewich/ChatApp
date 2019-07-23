import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { IFromServerChatMessage } from '../../../interfaces';

const messageWindow = {
    height: '500px',
    margin: '3%',
    overflow: 'auto',
    border: '1px solid #D3D3D3',
}
interface MessageListProps {
    messages: IFromServerChatMessage[];
}

export class MessageList extends Component<MessageListProps, {}> {
    render() {
        const messages = this.props.messages.slice(1);
        return(
            <Grid container justify="center">
                <Grid item xs={12} sm={6} lg={4} xl={3} style={messageWindow}>
                    <List>
                        {messages.map((message, index) => (
                            <Paper key={index} square style={{margin: 5}}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={message.username}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="textPrimary"
                                                >
                                                    {message.content}
                                                </Typography>                             
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </Paper>
                        ))}
                    </List>
                </Grid>
            </Grid>
        );
    }
}