import base64
from io import BytesIO

from flask import Flask, render_template, url_for, request
from PIL import Image

app = Flask(__name__)


@app.route('/')
def main_page():
    return render_template('index.html')


@app.route('/game', methods=['POST'])
def game():
    image = request.data.decode()
    image = image.split(',', 1)[1]

    im = Image.open(BytesIO(base64.b64decode(image)))
    im.save('image.png', 'PNG')
    return 'OK'


if __name__ == '__main__':
    app.run(port=8080, debug=True)
