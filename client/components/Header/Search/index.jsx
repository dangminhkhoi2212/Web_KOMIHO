import { useForm } from 'react-hook-form';
import { TfiSearch } from 'react-icons/tfi';
const Search = ({ handleEvent }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: { textSearch: '' } });

    const submit = (data) => {
        if (handleEvent) handleEvent(data);
    };
    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-row rounded-ss-xl h-10 rounded-ee-xl overflow-hidden border border-slate-400">
            <input
                type="search"
                className=" px-4 py-1 border-0  text-md border-transparent focus:border-transparent focus:ring-0 outline-none "
                {...register('textSearch')}
                placeholder="Search"
            />
            <button>
                <TfiSearch className="bg-accent  h-10 flex-grow text-white  text-5xl px-3 " />
            </button>
        </form>
    );
};

export default Search;
