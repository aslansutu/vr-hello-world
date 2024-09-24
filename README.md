# VR Hello World

The purpose is to try out A-Frame and its capabilities such as object collision and animation.

Using a low-poly Earth model, I have placed checkpoint markers at random points on the model. To help navigate, a simple means of transportation such as a paper airplane was used. Selecting the checkpoint marker (upon collision with the vehicle's shadow) will navigate to the predetermined web URL. 

To be secure when publishing, I am utilizing an already running Traefik service. 

## ToDo

There is always room for improvement.

- Fix the 3D rotation of the Earth. Since the local axis of the object is also rotated when rotating around the other axis, the correct calculation needs to be made so that the rotation is relative to the camera.
- Add other planets.
- Add the moon.

## Building

### With Traefik

Edit the `.env` file accordingly. In addition adjust the Traefik labels in `docker-compose.yml` according to your needs.

Execute `docker compose up` to start the container.

### Without Traefik

Since it is a simple html file, use your favorite HTTP/HTTPS server. Due to its ease I use `python -m http.server`.