import json
from enum import Enum


class GameResponse:
    def __init__(self, user_option, computer_option):
        self.user_option = user_option
        self.computer_option = computer_option

    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


class GameOption(Enum):
    PAPER = 0
    SCISSORS = 1
    ROCK = 2
