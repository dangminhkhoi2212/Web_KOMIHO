import Card from './Card';
const TemplateProduct = ({ title, products }) => {
    return (
        <div>
            <h1>{title}</h1>
            {products &&
                products.map((product) => (
                    <div>
                        <Card item={product} />
                    </div>
                ))}
        </div>
    );
};

export default TemplateProduct;
