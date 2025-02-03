import "./App.css";
import { useState } from "react";
import ArtistCard from "./components/ArtistCard";
import MyHeader from "./components/MyHeader";
import TableResults from "./components/TableResults";
import TempoSet from "./components/TempoSet";
import faye from "./assets/faye.jpg";
import ken from "./assets/ken.jpg";
import logo from "./assets/global.png";
import machine from "./assets/offbeat_arcade-min.png";
function App() {
  const [artist1, setArtist1] = useState("");
  const [artist2, setArtist2] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [artist1Pic, setArtist1Pic] = useState(ken);
  const [artist2Pic, setArtist2Pic] = useState(faye);

  const handleSearch = async () => {
    if (!artist1 || !artist2) {
      alert("Please enter both artist names.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/match-tempo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ artist1, artist2 }),
      });
      const data = await response.json();
      setSongs(data);
      setArtist1Pic(ken);
      setArtist2Pic(faye);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-screen pt-7 px-7 min-h-screen  noise antialiased lg:h-screen ">
        <div className="w-full invert">
          <img
            src={logo}
            alt=""
            className=" object-contain h-8 w-8 rounded-sm"
          />
        </div>
        <div className="w-full h-full flex flex-col-reverse justify-between items-center scale-95 lg:flex-row">
          <div className="relative w-full h-full lg:w-1/2">
            <div className="absolute -bottom-10 left-10 grayscale lg:bottom-0">
              <img src={machine} alt="" className="w-96 h-auto object-cover" />
            </div>
          </div>
          <div className="w-full h-full relative p-4 pt-8 lg:w-1/2">
            <MyHeader />
            <div className="flex flex-col gap-2 items-center justify-between lg:flex-row">
              <ArtistCard
                artist={artist1}
                setArtist={setArtist1}
                artistPic={artist1Pic}
              />
              <TempoSet
                searchButtonOnClick={handleSearch}
                searchButtonDisabled={loading}
              />
              <ArtistCard
                artist={artist2}
                setArtist={setArtist2}
                artistPic={artist2Pic}
              />
            </div>

            <TableResults songs={songs} artist1={artist1} artist2={artist2} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
