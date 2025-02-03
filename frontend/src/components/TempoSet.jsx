import PropTypes from "prop-types";

function TempoSet({ searchButtonOnClick, searchButtonDisabled }) {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="number"
        placeholder="Tempo Difference"
        className="bg-white/80 w-fit rounded-full text-black/60 px-2 py-1.5 placeholder:text-black/60 text-sm outline-0"
      />
      <div className="flex gap-2">
        <div className="rounded-full bg-white/90 text-black flex items-center justify-center w-6 h-6 px-2 cursor-pointer">
          +
        </div>
        <div className="rounded-full bg-white/90 text-black flex items-center justify-center w-6 h-6 px-2 cursor-pointer">
          -
        </div>
        <div className="">
          <button onClick={searchButtonOnClick} disabled={searchButtonDisabled}>
            {searchButtonDisabled ? "Wait..." : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}

TempoSet.propTypes = {
  searchButtonOnClick: PropTypes.func.isRequired,
  searchButtonDisabled: PropTypes.bool.isRequired,
};

export default TempoSet;
