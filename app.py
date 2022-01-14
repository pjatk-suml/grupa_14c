import json

from flask import Flask, render_template, request, Response

from scripts.dto.game_response import GameResponse, GameOption
from scripts.game_service import create_file, get_random_computer_option
from scripts.model_utils import predict_option_from_image

app = Flask(__name__)


@app.route('/')
def main_page():
    return render_template('index.html')


@app.route('/game', methods=['POST'])
def game():
    create_file(request)
    user_option = predict_option_from_image()

    if user_option == GameOption.NOTHING:
        return Response(json.dumps({"errorMessage": "Shape not recognized"}), status=400)

    computer_option = get_random_computer_option()
    response = GameResponse(user_option.name, computer_option.name)
    return Response(response.to_json(), status=200)


if __name__ == '__main__':
    app.run(port=8080, debug=True)
