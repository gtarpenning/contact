"""
Generates stats about current and previous games.

TODO:
- add history of semantic distance between words -- correlate with the share button/emojis?
- add history of previous games
- add history of win rate
- add history of average number of guesses
- total time played
- avg time per game
"""

import weave
from util import WEAVE_PROJECT_NAME
import pprint

client = weave.init(WEAVE_PROJECT_NAME)


def _get_latency_ms(call) -> float | None:
    return call.summary.get("weave", {}).get("latency_ms")

def _get_tokens(call) -> int | None:
    model = list(call.summary.get("usage", {}).keys())[0]
    return call.summary.get("usage", {}).get(model, {}).get("total_tokens")

def _get_tries(call) -> int | None:
    model = list(call.summary.get("usage", {}).keys())[0]
    return call.summary.get("usage", {}).get(model, {}).get("requests")

def get_all_game_stats():
    root_calls = client.get_calls(filter={"trace_roots_only": True})

    latencies = []
    tokens = []
    tries = []

    for call in root_calls:
        latency = _get_latency_ms(call)
        if latency is None:
            continue

        latencies.append(latency)
        tokens.append(_get_tokens(call))
        tries.append(_get_tries(call))

    return {
        "game lengths (time)": [f"{l / 1000:.2f}s" for l in latencies],
        "tokens": tokens,
        "total_games": len(latencies),
        "avg game length (seconds)": f"{sum(latencies) / len(latencies) / 1000:.2f}",
        "avg tries per game": f"{sum(tries) / len(tries):.2f}",
        "best game": min(tries),
        "worst game": max(tries),
        "quickest game": f"{min(latencies) / 1000:.2f}s",
        "slowest game": f"{max(latencies) / 1000:.2f}s",
    }


def get_all_stats():
    print("Stats")
    game_stats = get_all_game_stats()
    pprint.pprint(game_stats)


def main():
    get_all_stats()


if __name__ == "__main__":
    main()
