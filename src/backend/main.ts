import { ChatAppServer } from './ChatAppServer'

const serverPort = 8999;
const server = new ChatAppServer(serverPort);

// This function doesn't return so no statements after this line will execute
server.Activate();