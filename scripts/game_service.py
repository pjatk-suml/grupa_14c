import base64
from io import BytesIO
from random import randint

from PIL import Image

from scripts.dto.game_response import GameOption


def create_file(request, timestamp):
    image = request.data.decode()
    image = image.split(',', 1)[1]

    im = Image.open(BytesIO(base64.b64decode(image)))
    filename = timestamp + ".bmp"
    im.save(filename, 'BMP')


def get_random_computer_option():
    option_index = randint(0, 2)
    return GameOption(option_index)
