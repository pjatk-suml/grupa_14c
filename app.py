import base64
from io import BytesIO

from PIL import Image
from flask import Flask, render_template, url_for, request

from scripts.model_utils import predict_option_from_image

app = Flask(__name__)


@app.route('/')
def main_page():
    return render_template('index.html')


# TODO: whole logic should be moved to another file or method
@app.route('/game', methods=['POST'])
def game():
    image = request.data.decode()
    image = image.split(',', 1)[1]

    im = Image.open(BytesIO(base64.b64decode(image)))
    im.save('image.bmp', 'BMP')
    return predict_option_from_image()


if __name__ == '__main__':
    app.run(port=8080, debug=True)
