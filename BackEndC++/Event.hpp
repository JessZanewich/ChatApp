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