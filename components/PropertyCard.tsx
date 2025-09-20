import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {
  TbBed,
  TbBath,
  TbRulerMeasure,
  TbStairs,
  TbHeart,
  TbMapPin,
} from 'react-icons/tb';

interface PropertyCardProps {
  property: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const {
    id,
    title,
    images,
    type,
    address,
    city,
    zip,
    municipality,
    state,
    bedrooms,
    bathrooms,
    size,
    description,
    category,
    price,
    daysOnMarket,
  } = property;

  const router = useRouter();

  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`hidden lg:block ${className} text-white bg-gray-800 bg-opacity-50 p-4 rounded-full`}
        style={{ ...style, display: 'block', right: '10px', zIndex: 1 }}
        onClick={onClick}
      />
    );
  };

  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`hidden lg:block ${className} text-white bg-gray-800 bg-opacity-50 p-4 rounded-full`}
        style={{ ...style, display: 'block', left: '10px', zIndex: 1 }}
        onClick={onClick}
      />
    );
  };

  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<any>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    swipe: false,
    nextArrow: <NextArrow onClick={() => sliderRef.current.slickNext()} />,
    prevArrow: <PrevArrow onClick={() => sliderRef.current.slickPrev()} />,
    beforeChange: (current: number, next: number) => setActiveSlide(next),
    appendDots: (dots: React.ReactNode) => {
      return (
        <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
          <ul className="flex justify-center">{dots}</ul>
        </div>
      );
    },
    customPaging: (i: number) => (
      <div className="w-4 h-2 rounded-full mx-1">
        <div
          className={`h-2 rounded-full ${
            activeSlide === i ? 'bg-blue-500 w-full' : 'bg-white w-2'
          } transition-all duration-500`}
        ></div>
      </div>
    ),
    dotsClass: 'slick-dots custom-slick-dots',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          swipe: false,
          arrows: true,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          swipe: true,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col mt-2 max-w-sm bg-white border border-gray-200 rounded-lg shadow lg:ml-4 ml-0 lg:mx-0 mx-1">
      {/* <div>
        <div className="h-30 relative">
            <img
              className="object-cover h-30 hover:filter hover:brightness-75 hover:cursor-pointer"
              src={image}
              alt="property image"
            />
            <span className="flex absolute z-10 left-4 mt-4 top-1 items-center text-xs text-gray-500 font-bold bg-white px-3 py-1 rounded-md">
              <span className="flex w-2.5 h-2.5 bg-red-500 rounded-full me-1.5 flex-shrink-0 mr-2"></span>
              {type}
            </span>
          <Slider {...settings}>
            {image.map((image: any, index: any) => (
              <div key={index}>
                <img
                  className="w-full"
                  src={image}
                  alt={`Property ${index + 1}`}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 flex-auto">
        <h5 className="mx-2 my-4 text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 px-2">
          {description.length > 180
            ? description.substring(0, 180) + '...'
            : description}
        </p>
      </div> */}
      <div className="flex flex-col max-w-sm rounded overflow-hidden shadow-lg bg-white relative min-h-[26rem] h-full">
        <div className="flex-1 lg:grow-0 h-full">
          <span className="flex absolute z-10 left-4 top-2 mt-4 items-center text-xs text-gray-500 font-bold bg-white px-3 py-1 rounded-md">
            <span className="flex w-2.5 h-2.5 bg-red-500 rounded-full me-1.5 flex-shrink-0 mr-2"></span>
            {type}
          </span>
          <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10 cursor-pointer hover:bg-red-100 transition duration-300 ease-in-out">
            <TbHeart className="text-red-500 text-2xl" />
          </div>
          <div className='lg:block hidden'>
            <Slider ref={sliderRef} {...settings}>
              {images.slice(0, 6).map((image: any, index: any) => (
                <div key={index} className="relative h-full">
                  <img
                    className="w-full h-48 object-cover"
                    src={image}
                    alt={`Property ${index + 1}`}
                  />
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <div
                      className="hidden lg:flex w-1/2 h-full cursor-pointer"
                      onClick={() => sliderRef.current.slickPrev()}
                    ></div>
                    <div
                      className="hidden lg:flex w-1/2 h-full cursor-pointer justify-end"
                      onClick={() => sliderRef.current.slickNext()}
                    ></div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <div className='lg:hidden block'>
                  <img
                    className="w-full h-48 object-cover"
                    src={images[0]}
                    alt={`Property image`}
                  />
          </div>
        </div>
        <div className="px-4 py-2 flex-1 flex flex-col justify-between">
          <div className="flex space-x-1">
            <span className="bg-sky-200 text-black text-xs font-normal px-2.5 py-0.5 rounded">
              {category}
            </span>
            <span className="bg-rose-200 text-black text-xs font-normal px-2.5 py-0.5 rounded">
              Prije{' '}
              {(daysOnMarket.days > 0 && daysOnMarket.days + ' dana') ||
                (daysOnMarket.hours > 0 && daysOnMarket.hours + ' h') ||
                (daysOnMarket.minutes >= 0 && daysOnMarket.minutes + ' min')}
            </span>
          </div>
          <div
            onClick={() => {
              router.replace(`/nekretnina/${id}`);
              // setTimeout(() => {
              //   router.refresh();
              // }, 10);
            }}
            className="font-bold text-xl mb-1 hover:cursor-pointer hover:text-blue-500 transition duration-200 ease-in-out"
          >
            {title}
          </div>
          <div className="flex items-center text-gray-700 mb-1">
            {address}, {city}, {state}
          </div>
          <div className="text-xl text-blue-500 font-semibold mb-2">
            {price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} BAM
            {type === 'Iznajmljivanje' && (
              <span className="text-xs text-black font-black mx-1">
                / mjesečno
              </span>
            )}
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <TbBed className="text-2xl mr-2 text-black" />
                <div className="text-base font-semibold">{bedrooms}</div>
              </div>
              <div className="text-xs">
                {bedrooms >= 2 && bedrooms <= 4 ? ' Sobe' : ' Soba'}
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <TbBath className="text-2xl mr-2 text-black" />
                <div className="text-base font-semibold">{bathrooms}</div>
              </div>
              <div className="text-xs">
                {bathrooms === 1 ? ' Kupatilo' : ' Kupatila'}
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <TbRulerMeasure className="text-2xl mr-2 text-black" />
                <div className="text-base font-semibold">{size}</div>
              </div>
              <div className="text-xs">
                <span>
                  m<sup>2</sup>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <TbStairs className="text-2xl mr-2 text-black" />
                <div className="text-base font-semibold">1</div>
              </div>
              <div className="text-xs">Sprat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
