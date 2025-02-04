import ast
import pandas as pd
from scipy.spatial import cKDTree

def optimized_approach_no_duplicates(artist1, artist2, df, tempo_tolerance=5, top_n=20):
    """
    Optimized approach using numpy and scipy.spatial.cKDTree for faster matching.
    Removes duplicates based on `name_artist2`.
    """
    # Convert the string to an actual list (only if needed)
    df['artists'] = df['artists'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) and x.startswith('[') else x)

    # Filter songs by artist match once
    artist1_songs = df[df['artists'].apply(lambda x: artist1 in x)]
    artist2_songs = df[df['artists'].apply(lambda x: artist2 in x)]

    # If either artist's songs are not available, return empty DataFrame
    if artist1_songs.empty or artist2_songs.empty:
        return pd.DataFrame()

    # Sort songs by tempo for faster matching
    artist1_songs = artist1_songs.sort_values(by='tempo').reset_index(drop=True)
    artist2_songs = artist2_songs.sort_values(by='tempo').reset_index(drop=True)

    # Create a KDTree for artist2_songs based on tempo
    artist2_tree = cKDTree(artist2_songs[['tempo']])

    # Find matches within the tempo tolerance
    matches = artist2_tree.query_ball_point(artist1_songs[['tempo']], r=tempo_tolerance)

    # Collect similar songs
    similar_songs = []
    seen_artist2_songs = set()  # Track seen `name_artist2` to avoid duplicates

    for i, match_indices in enumerate(matches):
        for j in match_indices:
            name_artist2 = artist2_songs.loc[j, 'name']
            if name_artist2 not in seen_artist2_songs:
                similar_songs.append({
                    'name_artist1': artist1_songs.loc[i, 'name'],
                    'tempo_artist1': artist1_songs.loc[i, 'tempo'],
                    'artists_artist1': artist1_songs.loc[i, 'artists'],
                    'name_artist2': name_artist2,
                    'tempo_artist2': artist2_songs.loc[j, 'tempo'],
                    'artists_artist2': artist2_songs.loc[j, 'artists'],
                    'tempo_difference': abs(artist1_songs.loc[i, 'tempo'] - artist2_songs.loc[j, 'tempo'])
                })
                seen_artist2_songs.add(name_artist2)  # Mark this song as seen

    # Convert to DataFrame and sort by tempo difference
    result_df = pd.DataFrame(similar_songs)

    # Return the top_n closest matches based on tempo difference
    return result_df.nsmallest(top_n, 'tempo_difference')
