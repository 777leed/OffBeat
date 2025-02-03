import PropTypes from "prop-types";

function TableResults({ songs, artist1, artist2 }) {
  // Check if there are no songs
  if (songs.length === 0) {
    return (
      <p className="text-center text-gray-500">No matching songs found yet.</p>
    );
  }

  return (
    <div className="h-96 pb-10">
      <h2 className="GothamBook text-sm mb-2 mt-6">
        Search Results ({songs.length})
      </h2>
      <div className=" h-full overflow-y-auto scrollbar" id="style-1">
        <table className="bg-white/30 w-full h-full rounded-[16px] shadow-lg ">
          <thead>
            <tr className="bg-black/80 text-white">
              <th className="px-4 py-2 text-left rounded-tl-[16px] capitalize">
                {artist1}
              </th>
              <th className="px-4 py-2 text-left">Tempo</th>
              <th className="px-4 py-2 text-left capitalize">{artist2}</th>
              <th className="px-4 py-2 text-left">Tempo</th>
              <th className="px-4 py-2 text-left rounded-tr-[16px]">
                Tempo Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => (
              <tr key={index} className="hover:bg-white/10 transition-colors">
                <td className="px-4 py-2">{song.name_artist1}</td>
                <td className="px-4 py-2">{song.tempo_artist1}</td>
                <td className="px-4 py-2">{song.name_artist2}</td>
                <td className="px-4 py-2">{song.tempo_artist2}</td>
                <td className="px-4 py-2">
                  {String(song.tempo_difference).slice(0, 5)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

TableResults.propTypes = {
  songs: PropTypes.array.isRequired,
  artist1: PropTypes.string.isRequired,
  artist2: PropTypes.string.isRequired,
};

export default TableResults;
