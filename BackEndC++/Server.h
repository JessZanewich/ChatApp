#pragma once
#include "pch.h";

class Server {
public:
	Server();
	
	void BroadcastMessage(std::string message);
	

private:
	std::vector<std::string> m_database;
};