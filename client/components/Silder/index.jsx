import Carousel from './Carousel';
import CardPromotion from './CardPromotion';
const Slider = () => {
    return (
        <div className="grid grid-cols-12 h-carousel p-5 gap-6">
            <div className="col-span-7 ">
                <Carousel />
            </div>
            <div className="col-span-5 ">
                <CardPromotion />
            </div>
        </div>
    );
};

export default Slider;
