// WIP full of incomplete ideas.


class Server
{
  std::vector<Chatroom> m_chatRooms;
  std::vector<std::map<Connection, std::queue<Message>> m_memberMap;

}

class Chatroom
{
  std::vector<Clients> m_memberList;
  Broadcaster m_broadcaster;
}

static class Broadcaster
{
  Broadcaster void Broadcast(std::string message, vector<Clients> memberList); // broadcasts messages to all clients that are members of the list
};

class Connection
{
  std::thread<Connection::SendMethod> sendingThread;
  std::thread<Connection::ReceiveMethod> receivingThread;

  Receive()
  {
    while (true)
    {
      if (thereIsANewIncomingMessage)
      {
        // tell the server
        pushMessageToQueue();
        // log the incoming message
      }
    }
  }
}

class IncomingMessagesQueue
{
  //make this thread safe
  std::queue<Messages>
}

class Message
{
}