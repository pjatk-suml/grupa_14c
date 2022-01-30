import os

import numpy as np
from PIL import Image, ImageOps
from tensorflow.keras.models import load_model

from scripts.dto.game_response import GameOption


def predict_option_from_image(timestamp):
    model = load_model('model/keras_model.h5')

    # Create the array of the right shape to feed into the keras model
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    filename = timestamp + ".bmp"
    image = Image.open(filename)
    size = (224, 224)
    image = ImageOps.fit(image, size)

    image_array = np.asarray(image)
    normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
    data[0] = normalized_image_array

    prediction = model.predict(data)
    max_index = prediction.argmax()
    os.remove(filename)
    return GameOption(max_index)
