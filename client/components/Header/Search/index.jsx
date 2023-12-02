import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { TfiSearch } from 'react-icons/tfi';
const Search = ({ handleEvent }) => {
    const searchParams = useSearchParams();
    const textSearch = searchParams.get('textSearch');
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ defaultValues: { textSearch: '' } });

    const submit = (data) => {
        if (handleEvent) handleEvent(data);
        setValue('textSearch', '');
    };
    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="w-full flex flex-row  h-10 my-2">
            <input
                type="search"
                className="w-full px-4 py-1  text-md rounded-s-full  focus:border-accent focus:ring-0 border-2 border-slate-400 outline-none "
                {...register('textSearch')}
                placeholder={textSearch || 'Search'}
            />
            <button>
                <TfiSearch className="bg-accent  h-10 flex-grow text-white  text-5xl px-3 rounded-e-full " />
            </button>
        </form>
    );
};

export default Search;
