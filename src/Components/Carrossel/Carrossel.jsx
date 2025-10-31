import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carrossel = ({
    imagens,
    className,
}) => {
    const settings = {
        dots: true,
        Infinity: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return(
        <Slider {...settings}>
            {imagens?.map((img, i) => (
                <div key={i}>
                <img
                    src={img}
                    alt={`Imagem ${i + 1}`}
                    className={className}
                />
                </div>
            ))}
        </Slider>
    );
}

export default Carrossel