#include "pch.h";
#include <iostream> // Remove after cout is unused

class Server {
	Server() = default;

	void BroadcastMessage(std::string message) {
		std::cout << message << std::endl;
	}
};