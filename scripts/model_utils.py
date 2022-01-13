import os

import numpy as np
from PIL import Image, ImageOps
from keras.models import load_model

from scripts.dto.game_response import GameOption


# TODO: first version, needs refactor
def predict_option_from_image():
    # TODO: model needs to be trained better. It also takes really long to load - should it be stored in memory all the time?
    model = load_model('model/keras_model.h5')

    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    image = Image.open('image.bmp')
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.ANTIALIAS)

    image_array = np.asarray(image)
    normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
    data[0] = normalized_image_array

    prediction = model.predict(data)
    max_index = prediction.argmax()
    os.remove('image.bmp')
    return GameOption(max_index)
