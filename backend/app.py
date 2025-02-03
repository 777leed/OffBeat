from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from tempo_matcher import optimized_approach_no_duplicates
from artist_snap import getArtistsList_optimized



app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load the dataset
file_path = 'tracks_features.csv.zip'
df = pd.read_csv(file_path)
filtered_df = df[['tempo', 'name', 'artists']]
filtered_df_artist_only = df[['artists']]


@app.route('/match-artist', methods=['POST'])
def match_artist():
    data = request.json
    artist = data.get('artist')

    if not artist:
        return jsonify({'error': 'No Name Yet.'}), 400

    result,imageUrl = getArtistsList_optimized(artist,filtered_df_artist_only)
    return jsonify({
        'artists': result,  # The list of artists
        'imageUrl': imageUrl   # The message string
    })

@app.route('/match-tempo', methods=['POST'])
def match_tempo():
    data = request.json
    artist1 = data.get('artist1')
    artist2 = data.get('artist2')

    if not artist1 or not artist2:
        return jsonify({'error': 'Please provide both artist names.'}), 400

    result = optimized_approach_no_duplicates(artist1, artist2, filtered_df)
    return jsonify(result.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)

