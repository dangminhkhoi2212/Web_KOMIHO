'use client';

import { Rating } from 'react-simple-star-rating';
import { useFormContext } from 'react-hook-form';

const StarsForm = () => {
    const { getValues, setValue } = useFormContext();
    const stars = getValues('stars');
    const handleRating = (number) => {
        setValue('stars', number);
    };
    return (
        <Rating
            SVGclassName="inline"
            showTooltip
            onClick={handleRating}
            size={25}
            transition
            initialValue={stars}
            tooltipArray={['Terrible', 'Bad', 'Average', 'Great', 'Prefect']}
        />
    );
};

export default StarsForm;
