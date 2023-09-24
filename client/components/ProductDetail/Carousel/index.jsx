import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
const CarouselComponent = ({ images }) => {
    if (!images || images.length === 0) return;
    return (
        <Carousel>
            {images.map((image) => (
                <div key={image.url}>
                    <img src={image.url} alt={image.url} />
                </div>
            ))}
        </Carousel>
    );
};

export default CarouselComponent;
