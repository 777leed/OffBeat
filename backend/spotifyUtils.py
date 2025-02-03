import spotipy
from spotipy.oauth2 import SpotifyClientCredentials



client_id = '86e255c4ada847528a41a995a568e2af'
client_secret = '41432e75d477452f88209c6a58acb030'


def get_spotify_client(client_id, client_secret):

    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    return sp

def get_artist_images_by_name(artist_name, sp):

    artist_image = ""

    result = sp.search(q=artist_name, type='artist', limit=1)

    if result['artists']['items']:
        # Get the first artist from the search results
        artist_data = result['artists']['items'][0]
        image_url = artist_data['images'][0]['url'] if artist_data['images'] else None
        artist_image = image_url
    else:
        artist_image = ""

    return artist_image




