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
            className=" flex flex-row  h-10 my-2">
            <input
                type="search"
                className=" px-4 py-1  text-md rounded-ss-2xl rounded-bl-sm  focus:border-accent focus:ring-0 border-2 border-slate-400 outline-none "
                {...register('textSearch')}
                placeholder="Search"
            />
            <button>
                <TfiSearch className="bg-accent  h-10 flex-grow text-white  text-5xl px-3 rounded-ee-2xl rounded-se-sm " />
            </button>
        </form>
    );
};

export default Search;
