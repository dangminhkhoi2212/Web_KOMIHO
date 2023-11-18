'use client';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import routes from '@/routes';
import { useRouter, useSearchParams } from 'next/navigation';
import { route } from 'nextjs-routes';
import { Rating } from 'react-simple-star-rating';
import { clearObject } from '@/utils/site';
import { Badge, Button } from 'flowbite-react';
const listPercent = [
    { name: 'Sale off 75% & Up', value: 75 },
    { name: 'Sale off 50% & Up', value: 50 },
    { name: 'Sale off 25% & Up', value: 25 },
];
const listRatingStar = [
    { name: '5', value: 5 },
    { name: '4', value: 4 },
    { name: '3', value: 3 },
    { name: '2', value: 2 },
    { name: '1', value: 1 },
];
const listSortBy = [
    { name: 'Latest new', value: 'top-new' },
    { name: 'Top sold', value: 'top-sold' },
    { name: 'Top views', value: 'top-views' },
    { name: 'Price: High to Low', value: 'price-desc' },
    { name: 'Price: Low to High', value: 'price-asc' },
];

const FilterSearch = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const price = searchParams.get('price');
    const percent =
        searchParams.get('percent') && parseInt(searchParams.get('percent'));
    const star = searchParams.get('star') && parseInt(searchParams.get('star'));
    const sortBy = searchParams.get('sortBy');
    const filter = {
        price,
        percent,
        star,
        sortBy,
    };
    const handleChangeSFilter = (key, value) => {
        filter[key] = value;
        const newRoute = route({
            pathname: routes.products,
            query: { ...clearObject(filter) },
        });

        router.push(newRoute, { scroll: false });
    };
    const handleClear = () => {
        router.replace(routes.products, { scroll: false });
    };
    return (
        <div className="bg-white rounded-lg p-5 flex flex-col gap-4 relative">
            <Badge size="xl">Filter</Badge>
            <section>
                <RadioGroup
                    value={sortBy}
                    onValueChange={(value) => {
                        handleChangeSFilter('sortBy', value);
                    }}>
                    {listSortBy?.map((item) => (
                        <div
                            className="flex items-center space-x-2"
                            key={item.value}>
                            <RadioGroupItem value={item.value} id={item.name} />
                            <Label htmlFor={item.name}>{item.name}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </section>
            <hr />

            <section>
                <RadioGroup
                    value={percent}
                    onValueChange={(value) =>
                        handleChangeSFilter('percent', value)
                    }>
                    {listPercent?.map((item) => (
                        <div
                            className="flex items-center space-x-2"
                            key={item.value}>
                            <RadioGroupItem value={item.value} id={item.name} />
                            <Label htmlFor={item.name}>{item.name}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </section>
            <hr />
            <section>
                <RadioGroup
                    value={star}
                    onValueChange={(value) =>
                        handleChangeSFilter('star', value)
                    }>
                    {listRatingStar?.map((item) => (
                        <div
                            className="flex items-center space-x-2"
                            key={item.value}>
                            <RadioGroupItem value={item.value} id={item.name} />
                            <Label
                                htmlFor={item.name}
                                className="flex gap-2 justify-center items-center">
                                <p>{item.name}</p>
                                <Rating
                                    SVGclassName="inline"
                                    readonly
                                    size={25}
                                    transition
                                    initialValue={item.value}
                                />
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </section>
            <Button
                onClick={() => {
                    handleClear();
                }}>
                Clear
            </Button>
        </div>
    );
};

export default FilterSearch;
