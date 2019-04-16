// EVENT.HPP
#pragma once
#include <unordered_map>

template<typename Func, typename Args>
class Event
{
public:
	Event() {};
	~Event() {};

	static void dispatch(Args args) noexcept {
		for (auto listener : listeners) {
			listener.second(args);
		}
	}

	static void attach(const std::string& id, Func func) noexcept {
		listeners.insert({ id, func });
	}

	static void detach(const std::string& id) noexcept {
		listeners.erase(id);
	}

private:
	static std::unordered_map<std::string, Func> listeners;
};

template<typename Func, typename Args>
std::unordered_map<std::string, Func> Event<Func, Args>::listeners;




// SOMEONE WHO WANTS TO USE EVENT CLASS
class Listener() {
public:
	int DoSomething(double arg1);
}

// HOOK THEM UP

struct IntArgs
{
	int big_ol_nummer;
}

class MessageEvent : public Event< std::function< void(const MessageEventArgs&) >, MessageEventArgs >;
struct MessageEventArgs {
	MessageEventArgs(std::string msg) :
		messageThatHappened(msg)
	{}

	std::string messageThatHappened;
}


auto listener = std::make_unique(Listener);
// auto event = std::make_unique(Event<int, double>); // Prolly heckin wrong
auto event = std::make_unique(Event < std::function<void(const IntArgs&)>, IntArgs;
event.attach("listener1", listener.DoSomething);


class Broadcaster {
public:
	DoSomeWork() {
		while (true) {
			// Doing work..
			if (somethingInterestingHappened) {
				auto args = MessageEventArgs("oh boy something cool sure did occur");
				event.dispatch(args);
			}
		}
	}

	void Subscribe(std::string listenerId, Observer.DoSomething) {
		event.attach(listenerId, )
	}
private:
	MessageEvent event;

}

class Observer {
	Observer(const Broadcaster& broadcaster) {
		broadcaster.Subscribe(id, Callback); // DOES THIS MAKE SENSE?


	}
	string id = "your favourite listener"
		void Callback(const &IntArgs intRef)
}