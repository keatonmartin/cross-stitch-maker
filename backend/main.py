from PIL import Image
import numpy as np
from sklearn.cluster import MiniBatchKMeans
import matplotlib.pyplot as plt
from sklearn.utils import shuffle
from io import BytesIO
from flask import send_file


def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.

    This function was originally implemented as the trigger for an endpoint on our Google Cloud function. 
    It accepts an image in a request payload, scales it down, performs K-means clustering, and returns a matplotlib visualization of the 
    image as a blob. 
    """
    # def serve_pil_image(pil_img):
    #     img_io = BytesIO()
    #     pil_img.save(img_io, 'JPEG', quality=70)
    #     img_io.seek(0)
    #     return send_file(img_io, mimetype='image/jpeg')

    upload = request.files['image']
    size = int(request.args['size'])
    im = Image.open(upload)
    im.thumbnail((size,size))

    image = np.asarray(im)
    image = np.array(image, dtype=np.float64) / 255

    w, h, d = original_shape = tuple(image.shape)
    image_array = np.reshape(image, (w * h, d))

    n_colors = int(request.args['colors'])
    size = int(request.args['size'])

    image_array_sample = shuffle(image_array, random_state=0)
    kmeans = MiniBatchKMeans(n_clusters=n_colors, n_init="auto", random_state=0).fit(
        image_array_sample
    )

    labels = kmeans.predict(image_array)

    def recreate_image(codebook, labels, w, h):
        """Recreate the (compressed) image from the code book & labels"""
        return codebook[labels].reshape(w, h, -1)

    processed_image = recreate_image(kmeans.cluster_centers_, labels, w, h)
    final = Image.fromarray((processed_image * 255).astype(np.uint8))

    plt.imshow(final)
    img_io = BytesIO()
    plt.savefig(img_io)
    img_io.seek(0)
    return send_file(img_io, mimetype='application/pdf')

