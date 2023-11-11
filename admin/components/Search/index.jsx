import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
const SearchCpn = ({ handleEvent }) => {
    const { handleSubmit, register, reset } = useForm();
    const submit = (data) => {
        if (handleEvent) handleEvent(data.searchText);
        reset();
    };
    return (
        <form className="flex" onSubmit={handleSubmit(submit)}>
            <input
                type="search"
                name="searchText"
                id=""
                {...register('searchText')}
                placeholder="Search..."
                className="px-4 rounded-s-full outline-none border-none min-w-[300px]"
            />
            <Button className="rounded-e-full">
                <Search />
            </Button>
        </form>
    );
};

export default SearchCpn;
