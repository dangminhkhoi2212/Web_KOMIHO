import { TfiSearch } from 'react-icons/tfi';
const Search = () => {
    return (
        <div className="flex flex-row rounded-ss-xl h-10 rounded-ee-xl overflow-hidden border border-slate-400">
            <input
                type="search"
                className=" px-4 py-1 border-0  text-md border-transparent focus:border-transparent focus:ring-0 outline-none "
                placeholder="Search"
            />
            <TfiSearch className="bg-accent  h-10 flex-grow text-white  text-5xl px-3 " />
        </div>
    );
};

export default Search;
