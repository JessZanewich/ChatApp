#include "pch.h"
#include "../BackEnd/Server.h"

class ServerTest : public ::testing::Test {
protected:
	std::unique_ptr<Server> m_server;
	
	void SetUp() override {
		m_server = std::make_unique<Server>();
	}
};

TEST_F(ServerTest, TestThatServerCanDoX) {
	// TODO write a test
}