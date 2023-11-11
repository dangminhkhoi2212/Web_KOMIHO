import AvatarText from '@/components/Avatar';
import ImageIconProduct from '@/components/ProductImageCover';

import { Rating } from 'react-simple-star-rating';
const FeedbackContent = ({ feedback }) => {
    return (
        <div className="flex flex-col gap-3 ">
            <AvatarText
                name={feedback?.userId?.name}
                src={feedback?.userId?.avatar?.url}
            />
            <Rating
                SVGclassName="inline"
                showTooltip
                size={25}
                initialValue={feedback.stars}
                readonly={true}
                tooltipArray={[
                    'Terrible',
                    'Bad',
                    'Average',
                    'Great',
                    'Prefect',
                ]}
            />
            <div className="flex gap-1">
                {feedback?.images?.map((img, index) => (
                    <ImageIconProduct image={img} key={index} />
                ))}
            </div>

            <p className="whitespace-pre-line">{feedback.content}</p>
        </div>
    );
};

export default FeedbackContent;
