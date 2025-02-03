import ast
from Levenshtein import distance as levenshtein_distance
from spotifyUtils import get_spotify_client
from spotifyUtils import get_artist_images_by_name

# Replace with your actual Spotify credentials
client_id = '86e255c4ada847528a41a995a568e2af'
client_secret = '41432e75d477452f88209c6a58acb030'

# Get the Spotipy client
sp = get_spotify_client(client_id, client_secret)

def getArtistsList_optimized(queryTerm, df, max_results=2):
    queryTerm = queryTerm.lower()
    matched_artists = set()
    for artists_str in df['artists']:
        artists = ast.literal_eval(artists_str)
        for artist in artists:
            if queryTerm in artist.lower():
                matched_artists.add(artist)
                if len(matched_artists) >= max_results:
                    break
        if len(matched_artists) >= max_results:
            break
    sorted_artists = sorted(matched_artists, key=lambda name: levenshtein_distance(queryTerm, name.lower()))
    ImageUrl = get_artist_images_by_name(sorted_artists[0],sp)
    return sorted_artists[:max_results],ImageUrl

# file_path = 'tracks_features.csv.zip'
# df = pd.read_csv(file_path)
# filtered_df = df[['artists']]

# start_time = time.time()
# artists_optimized = getArtistsList_optimized("Drake", filtered_df)
# optimized_time = time.time() - start_time

# print(f"Optimized Function Execution Time: {optimized_time:.4f} seconds")
# print(f"Optimized Results: {artists_optimized}")