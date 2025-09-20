import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import PropertyCard from './PropertyCard';
import PropertyAmenities from './PropertyAmenities';
import PropertyNeighborhoodInfo from './PropertyNeighborhoodInfo';

import { IoHammerOutline, IoCloseOutline } from 'react-icons/io5';
import { BsPinMap } from 'react-icons/bs';
import {
  BiBuildingHouse,
  BiCalendarWeek,
  BiInfoCircle,
  BiStats,
  BiImages,
} from 'react-icons/bi';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { MdFavoriteBorder, MdOutlineFavorite } from 'react-icons/md';

interface PropertyDetailsProps {
  property: any;
  user: any;
  session: any;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  user,
  session,
}) => {
  const { id, username } = user;
  const { sessionId } = session;
  const {
    title,
    price,
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
    yearBuilt,
    yard,
    description,
    yardSize,
    category,
    createdAt,
    status,
    latLong,
    propertyId,
    amenities,
  } = property;

  const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
  });

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState(images[0]);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [properties, setProperties] = useState([] as any);
  const [userProperties, setUserProperties] = useState([] as any);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userPropertiesSlide, setUserPropertiesSlide] = useState(0);

  const modal = useCallback(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, []);

  useEffect(() => {
    modal();
  }, []);

  // useEffect(() => {
  //   if (!address || !city) {
  //     return;
  //   }
  //   const addMarker = async () => {
  //     try {
  //       const res = await axios.get(
  //         `https://nominatim.openstreetmap.org/search?q=${address},+${city}&format=json&polygon_threshold=1&addressdetails=1`
  //       );
  //       if (res.status === 200) {
  //         setPosition([res.data[0].lat, res.data[0].lon]);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       return;
  //     }
  //   };
  //   addMarker();
  // }, [address, city]);

  const dateDif = (date: any) => {
    const startDate: any = new Date();
    let delta = Math.abs(date - startDate) / 1000;
    const isNegative = startDate > date ? 1 : 1;
    return [
      ['days', 24 * 60 * 60],
      ['hours', 60 * 60],
      ['minutes', 60],
      ['seconds', 1],
    ].reduce(
      (acc: any, [key, value]: any) => (
        (acc[key] = Math.floor(delta / value) * isNegative),
        (delta -= acc[key] * isNegative * value),
        acc
      ),
      {}
    );
  };

  const daysOnMarket = dateDif(new Date(createdAt));

  const nextImage = () => {
    images.map((image: any, index: any) => {
      image === modalImage &&
        setModalImage(images[images.length - 1 !== index ? index + 1 : 0]);
    });
  };

  const previousImage = () => {
    images.map((image: any, index: any) => {
      image === modalImage &&
        setModalImage(images[index !== 0 ? index - 1 : images.length - 1]);
    });
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
  };

  const loadProperty = async () => {
    if (!type) {
      return;
    }
    try {
      const res = await axios.post('/api/nekretnineFetch', {
        type,
        propertyId,
        city,
        category,
        id,
      });
      if (res.status === 200) {
        //console.log(res.data.property);
        setProperties(res.data.property);
        setUserProperties(res.data.userProperties);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  useEffect(() => {
    loadProperty();
    setModalImage(images[0]);
    setModalImageIndex(0);
  }, [property]);

  const CustomNextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      >
        <SlArrowRight size={25} color="black" fontStyle={'bold'} />
      </div>
    );
  };

  const CustomPrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      >
        <SlArrowLeft size={25} color="black" fontStyle={'bold'} />
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    swipe: false,
    afterChange: (current: number) => setCurrentSlide(current),
    nextArrow:
      currentSlide === properties.length - 3 ? null : <CustomNextArrow />,
    prevArrow: currentSlide === 0 ? null : <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 1,
          swipe: true,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          swipe: true,
          arrows: false,
        },
      },
    ],
  };

  const userPropertiesSlider = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    swipe: false,
    afterChange: (current: number) => setUserPropertiesSlide(current),
    nextArrow:
      userPropertiesSlide === userProperties.length - 3 ? null : <CustomNextArrow />,
    prevArrow: userPropertiesSlide === 0 ? null : <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 1,
          swipe: true,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          swipe: true,
          arrows: false,
        },
      },
    ],
  };

  const [activeSlide, setActiveSlide] = useState(0);

  const settingsModal = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    beforeChange: (current: number, next: number) => setActiveSlide(next),
    appendDots: (dots: React.ReactNode) => {
      return (
        <div style={{ position: 'absolute', bottom: '0px', width: '100%' }}>
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
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="lg:block hidden w-full h-full fixed z-40 bg-black bg-opacity-80">
            <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-6 text-white text-lg z-50 transition-all hover:rotate-180 rotate-0 transform">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setModalImage(images[0]);
                }}
              >
                <IoCloseOutline size={50} />
              </button>
            </div>
            <div className="flex h-screen justify-center items-center select-none">
              <div className="m-auto w-full h-3/4">
                <div className="flex w-full h-full items-center">
                  <div
                    className="absolute inline-flex justify-center items-center left-0 mx-6 bg-white bg-opacity-10 rounded-full w-20 h-20 text-white hover: cursor-pointer hover:bg-opacity-20"
                    onClick={previousImage}
                  >
                    <SlArrowLeft size={50} />
                  </div>
                  <img
                    className="w-full h-full object-contain"
                    src={modalImage}
                    alt=""
                  />
                  <div
                    className="absolute inline-flex justify-center items-center right-0 mx-6 bg-white bg-opacity-10 rounded-full w-20 h-20 text-white hover:cursor-pointer hover:bg-opacity-20 focus:outline-none"
                    onClick={nextImage}
                  >
                    <SlArrowRight size={50} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden flex justify-center items-center w-screen h-screen fixed z-40 bg-black bg-opacity-80">
            <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-6 text-white text-lg z-50 transition-all hover:rotate-180 rotate-0 transform">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setModalImage(images[0]);
                }}
              >
                <IoCloseOutline size={50} />
              </button>
            </div>
            <div className="h-1/3 w-full">
              <Slider initialSlide={modalImageIndex} {...settingsModal}>
                {images.map((image: any, i: any) => (
                  <div
                    key={i}
                    className="w-full h-full flex justify-center items-center md:max-h-96 max-h-64"
                  >
                    <img
                      className="w-full h-full md:max-h-96 max-h-64 object-contain"
                      src={image}
                      alt={`Property image ${i}`}
                      key={i}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </>
      )}
      <div
        className={`${
          isOpen ? 'overflow-hidden' : ''
        } max-w-screen-xl mx-auto lg:px-4 px-3 py-24 lg:py-24 relative bg-white`}
      >
        <div className="flex flex-col md:flex-row gap-2 mb-10">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col">
              <span className="flex absolute z-10 left-8 mt-4 items-center text-xs text-gray-500 font-bold bg-white px-3 py-1 rounded-md">
                <span className="flex w-2.5 h-2.5 bg-red-500 rounded-full me-1.5 flex-shrink-0 mr-2"></span>
                {type}
              </span>
              <img
                className="object-cover h-full lg:rounded-l-xl lg:rounded-tr-none rounded-tl-xl rounded-tr-xl hover:filter hover:brightness-75 hover:cursor-pointer"
                onClick={() => {
                  setModalImage(images[0]);
                  setModalImageIndex(0);
                  setActiveSlide(0);
                  setIsOpen(true);
                }}
                src={images[0]}
                alt=""
              />
            </div>
          </div>
          <div className="flex flex-1">
            <div className="grid grid-cols-2 gap-2 place-items-end">
              <div className="flex absolute z-10 mt-4 items-center lg:px-3 px-0 py-1 rounded-md m-3">
                <button
                  className="bg-white text-gray-500 lg:w-44 w-auto font-semibold text-xs lg:py-2 lg:px-4 py-1 px-2 border border-gray-400 rounded shadow"
                  onClick={() => {
                    setModalImageIndex(0);
                    setActiveSlide(0);
                    setIsOpen(true);
                  }}
                >
                  <div className="flex flex-row items-center justify-center lg:gap-2 gap-1">
                    <BiImages size={25} />
                    <p className="hidden lg:block">
                      Pogledaj {images.length}
                      {images.length === 1
                        ? ' sliku'
                        : images.length >= 2 && images.length <= 4
                        ? ' slike'
                        : ' slika'}
                    </p>
                    <p className="lg:hidden block">+{images.length}</p>
                  </div>
                </button>
              </div>
              {Object.values(images.slice(0, 5)).map(
                (image: any, index: any) => {
                  if (index === 0) return '';
                  return (
                    <div key={index} className="">
                      <img
                        className={`object-cover h-full hover:filter hover:brightness-75 hover:cursor-pointer ${
                          (index === 2 && 'lg:rounded-tr-xl') ||
                          (index === 4 && 'rounded-br-xl') ||
                          (index === 3 && 'rounded-bl-xl lg:rounded-bl-none')
                        }`}
                        onClick={() => {
                          setModalImage(images[index]);
                          setModalImageIndex(index);
                          setActiveSlide(index);
                          setIsOpen(true);
                        }}
                        src={image}
                        alt=""
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex lg:flex-row flex-col lg:items-center gap-4">
            <h1 className="mt-0 mb-4 lg:text-5xl md:text-4xl text-3xl font-bold text-primary">
              {title}
            </h1>
          </div>
          <div className="flex lg:flex-row flex-col lg:gap-10 gap-4">
            <div className="flex flex-col w-full">
              <div className="flex">
                <h1 className="mt-0 lg:text-4xl md:text-3xl text-2xl font-bold leading-tight text-primary flex items-center">
                  {price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} BAM{' '}
                  {type === 'Iznajmljivanje' && (
                    <span className="text-sm font-black mx-2">/ mjesečno</span>
                  )}
                </h1>
              </div>
              <div className="flex">
                <p className="text-xl font-light">
                  {address}, {municipality}, {city}, {zip}, {state}
                </p>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex flex-row">
                <div className="w-1/3">
                  <h1 className="mt-0 lg:text-4xl text-3xl font-medium leading-tight text-primary">
                    {bedrooms?.toString()}
                  </h1>
                </div>
                <div className="w-1/3">
                  <h1 className="mt-0 lg:text-4xl text-3xl font-medium leading-tight text-primary">
                    {bathrooms?.toString()}
                  </h1>
                </div>
                <div className="w-1/3">
                  <h1 className="mt-0 lg:text-4xl text-3xl font-medium leading-tight text-primary">
                    {size?.toString()}
                  </h1>
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3">
                  <p className="text-xl font-light">
                    {bedrooms >= 2 && bedrooms <= 4 ? ' sobe' : ' soba'}
                  </p>
                </div>
                <div className="w-1/3">
                  <p className="text-xl font-light">
                    {bathrooms === 1 ? ' kupatilo' : ' kupatila'}
                  </p>
                </div>
                <div className="w-1/3">
                  <p className="text-xl font-light">
                    m<sup>2</sup>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full lg:mt-0 mt-4 relative lg:items-end">
              {id !== sessionId ? (
                <>
                  <div className="flex flex-row mb-2">
                    <img
                      className="w-12 rounded-md"
                      src="../images/avatar.png"
                      alt="Avatar"
                    />
                    <p
                      className="ml-2 text-lg font-medium self-center hover: cursor-pointer"
                      onClick={() => router.push(`/profil/${id}`)}
                    >
                      {username}
                    </p>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold border-b-4 h-14 border-blue-700 hover:border-blue-500 rounded md:w-1/2">
                    Kontaktiraj vlasnika
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold border-b-4 h-14 mb-2 border-blue-700 hover:border-blue-500 rounded">
                    Uredi nekretninu
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold border-b-4 h-14 border-red-700 hover:border-red-500 rounded">
                    Izbriši nekretninu
                  </button>
                </>
              )}
            </div>
          </div>
          <div
            className="mt-4 mb-4 flex flex-row gap-2 text-white justify-center items-center text-xs rounded-xl bg-blue-500 py-1 lg:w-1/6 w-2/4 hover:cursor-pointer select-none"
            onClick={handleFavorite}
          >
            <MdOutlineFavorite
              className={`${favorite ? 'text-red-500' : 'text-white'}`}
              size={25}
            />
            <h1>{favorite ? 'Izbriši iz spremljenih' : 'Spremi nekretninu'}</h1>
          </div>
          <div className="flex flex-row flex-wrap mt-4">
            <div className="flex flex-row items-center gap-2 mt-6 lg:w-1/4 w-full">
              <BiCalendarWeek size={35} />
              <div className="flex flex-col">
                <p className="text-md font-black">
                  Prije{' '}
                  {(daysOnMarket.days > 0 && daysOnMarket.days + ' dana') ||
                    (daysOnMarket.hours > 0 && daysOnMarket.hours + ' h') ||
                    (daysOnMarket.minutes >= 0 &&
                      daysOnMarket.minutes + ' min')}
                </p>
                <p className="text-xs">Vrijeme dodavanja nekretnine</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 mt-6 lg:w-1/4 w-full">
              <BiInfoCircle size={35} />
              <div className="flex flex-col">
                <p className="text-md font-black flex items-center">
                  <span className="flex w-3 h-3 mr-2 bg-green-500 rounded-full"></span>{' '}
                  {status}
                </p>
                <p className="text-xs">Status nekretnine</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 mt-6 lg:w-1/4 w-full">
              <BiStats size={35} />
              <div className="flex flex-col">
                <p className="text-md font-black flex items-center">--</p>
                <p className="text-xs">Broj pregleda nekretnine</p>
              </div>
            </div>
          </div>
          <div className="flex -mx-2 my-4 flex-wrap lg:w-3/4">
            <div className="lg:w-1/3 w-full px-2 py-2">
              <div className="bg-gray-200 h-14 text-sm items-center flex flex-row px-4 gap-2 rounded-md">
                <BiBuildingHouse size={25} />
                <div className="flex flex-col">
                  <p>Tip nekretnine</p>
                  <p className="font-black">{category}</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 w-full px-2 py-2">
              <div className="bg-gray-200 h-14 text-sm items-center flex flex-row px-4 gap-2 rounded-md">
                <IoHammerOutline size={25} />
                <div className="flex flex-col">
                  <p>Godina izgradnje</p>
                  <p className="font-black">{yearBuilt?.toString()}.</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 w-full px-2 py-2">
              <div className="bg-gray-200 h-14 text-sm items-center flex flex-row px-4 gap-2 rounded-md">
                <BsPinMap size={25} />
                <div className="flex flex-col">
                  <p>Površina okućnice</p>
                  <p className="font-black">
                    {yard === 'Da' ? yardSize?.toString() + ' ' : 'Nema'}
                    {yard === 'Da' && (
                      <span>
                        m<sup>2</sup>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="lg:w-1/3 w-1/2 px-2 py-2">
              <div className="bg-gray-200 h-12 text-sm items-center flex px-4"></div>
            </div>
            <div className="lg:w-1/3 w-1/2 px-2 py-2">
              <div className="bg-gray-200 h-12 text-sm items-center flex px-4"></div>
            </div>
            <div className="lg:w-1/3 w-1/2 px-2 py-2">
              <div className="bg-gray-200 h-12 text-sm items-center flex px-4"></div>
            </div>
            <div className="lg:w-1/3 w-1/2 px-2 py-2">
              <div className="bg-gray-200 h-12 text-sm items-center flex px-4"></div>
            </div> */}
          </div>
          <div className="flex flex-col lg:w-3/4 mb-6">
            <h1 className="my-4 font-black tracking-tight text-gray-900 text-xl">
              Opis nekretnine
            </h1>
            <p className="text-sm lg:text-md tracking-wider whitespace-pre-line">
              {description}
            </p>
          </div>

          {amenities.length !== 0 && (
            <div className="flex flex-col lg:w-3/4 mb-10">
              <h1 className="my-4 font-black tracking-tight text-gray-900 text-xl">
                Nekretnina posjeduje
              </h1>
              <PropertyAmenities amenities={amenities} />
            </div>
          )}

          <div className="mb-10">
            <h1 className="my-6 font-black tracking-tight text-gray-900 text-xl">
              Lokacija nekretnine
            </h1>
            <Map position={latLong} />
          </div>

          <div className="mb-10">
            <PropertyNeighborhoodInfo lat={latLong[0]} lon={latLong[1]} />
          </div>
        </div>

        <h1 className="my-4 font-black tracking-tight text-gray-900 text-xl">
          Slične nekretnine
        </h1>
        <div className="flex flex-col justify-center mb-10">
          {properties.length !== 0 && (
            <Slider {...settings}>
              {properties.map((prop: any, i: any) => (
                <PropertyCard
                  property={{
                    title: prop.title,
                    description: prop.description,
                    images: prop.images,
                    type: prop.type,
                    price: prop.price,
                    address: prop.address,
                    city: prop.city,
                    state: prop.state,
                    bedrooms: prop.bedrooms,
                    bathrooms: prop.bathrooms,
                    size: prop.size,
                    category: prop.category,
                    daysOnMarket: dateDif(new Date(prop.createdAt)),
                    id: prop.id,
                  }}
                  key={i}
                />
              ))}
            </Slider>
          )}
        </div>
        <h1 className="my-4 font-black tracking-tight text-gray-900 text-xl">
          Ostale nekretnine od korisnika
        </h1>
        <div className="flex flex-col justify-center">
          {userProperties.length !== 0 && (
            <Slider {...userPropertiesSlider}>
              {userProperties.map((prop: any, i: any) => (
                <PropertyCard
                  property={{
                    title: prop.title,
                    description: prop.description,
                    images: prop.images,
                    type: prop.type,
                    price: prop.price,
                    address: prop.address,
                    city: prop.city,
                    state: prop.state,
                    bedrooms: prop.bedrooms,
                    bathrooms: prop.bathrooms,
                    size: prop.size,
                    category: prop.category,
                    daysOnMarket: dateDif(new Date(prop.createdAt)),
                    id: prop.id,
                  }}
                  key={i}
                />
              ))}
            </Slider>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
