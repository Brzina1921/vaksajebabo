import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';

import toast, { Toaster } from 'react-hot-toast';

import { GoLocation } from 'react-icons/go';
import { BsBuilding, BsPlusCircle } from 'react-icons/bs';
import { AiOutlinePicture } from 'react-icons/ai';

import { TbAirConditioning } from 'react-icons/tb';
import { GiHomeGarage } from 'react-icons/gi';

import {
  FaSwimmer,
  FaDumbbell,
  FaCar,
  FaWifi,
  FaSnowflake,
  FaDog,
  FaTshirt,
  FaBuilding,
  FaLeaf,
  FaShieldAlt,
  FaArchway,
  FaFireAlt,
} from 'react-icons/fa';
import { GiBarbecue } from 'react-icons/gi';

import Navbar from '@/components/Navbar';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import LoaderOverlay from '@/components/LoaderOverlay';
import PhotoUpload from '@/components/PhotoUpload';
import AmenitySelector from '@/components/AmenitySelector';

import {
  cities,
  countries,
  entities,
  categories,
  types,
  yesOrNo,
} from '@/lib/selectOptions';
import { setTimeout } from 'timers/promises';

const Select = dynamic(() => import('react-select'), {
  ssr: false,
});

const MapInitial = dynamic(() => import('@/components/MapInitial'), {
  ssr: false,
});

const Nova = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [zip, setZip] = useState('');
  const [state, setState] = useState('');
  // const [country, setCountry] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [zamjena, setZamjena] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [lot, setLot] = useState('');
  const [lotArea, setLotArea] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [description, setDescription] = useState('');

  interface Amenity {
    name: string;
    icon: React.ReactNode;
  }

  const amenities: Amenity[] = [
    { name: 'Bazen', icon: <FaSwimmer /> },
    { name: 'Teretana', icon: <FaDumbbell /> },
    { name: 'Parking', icon: <FaCar /> },
    { name: 'WiFi', icon: <FaWifi /> },
    { name: 'Klima Uređaj', icon: <FaSnowflake /> },
    { name: 'Pet Friendly', icon: <FaDog /> },
    { name: 'Roštilj', icon: <GiBarbecue /> },
    { name: 'Lift', icon: <FaBuilding /> },
    { name: 'Bašta', icon: <FaLeaf /> },
    { name: 'Video Nadzor', icon: <FaShieldAlt /> },
    { name: 'Balkon', icon: <FaArchway /> },
    { name: 'Grijanje', icon: <FaFireAlt /> },
  ];

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name)
        ? prev.filter((amenityName) => amenityName !== name)
        : [...prev, name]
    );
    console.log(selectedAmenities);
  };

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const [loader, setLoader] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [position, setPosition] = useState([
    44.152950581513196, 17.859505419255424,
  ]);
  const [finalPosition, setFinalPosition] = useState([0, 0] as any);

  const handleFile = async (e: any) => {
    setMessage('');
    let file = e.target.files;
    let goodFile = [] as any;

    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]['type'];
      const validImageTypes = ['image/webp', 'image/jpeg', 'image/png'];
      if (
        validImageTypes.includes(fileType) &&
        file[i]['size'] / 1024 ** 2 <= 2
      ) {
        goodFile = [...goodFile, file[i]];
      } else {
        setMessage(
          'Greška! Dozvoljeni formati su: JPEG, PNG i WEBP. Maksimalna veličina fotografije (< 2 MB).'
        );
      }
    }
    setFiles(goodFile);
  };

  const removeImage = (i: any) => {
    setFiles(files.filter((x: any) => x !== i));
  };

  // useEffect(() => {
  //   if (address === '') {
  //     return;
  //   }
  //   const searchByAddress = async () => {
  //     try {
  //       const res = await axios.get(
  //         `https://nominatim.openstreetmap.org/search?q=${address}&format=json&polygon_threshold=1&addressdetails=1`
  //       );
  //       if (res.status === 200) {
  //         console.log(res.data);
  //         // setPosition([res.data[0].lat, res.data[0].lon]);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       return;
  //     }
  //   };
  //   searchByAddress();
  // }, [address]);

  const searchByAddress = async () => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${address}&format=json&polygon_threshold=1&addressdetails=1`
      );
      if (res.status === 200) {
        setPosition([res.data[0].lat, res.data[0].lon]);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const addNew = useCallback(
    async (e: any) => {
      if (files.length === 0) {
        toast.error('Morate dodati minimalno jednu sliku nekretnine!');
        return;
      }
      if (
        (title &&
          address &&
          city &&
          state &&
          zip &&
          area &&
          price &&
          category &&
          (type === 'Prodaja' ? type && zamjena : type) &&
          bedrooms &&
          bathrooms &&
          yearBuilt &&
          state &&
          municipality &&
          description &&
          (lot === 'Da' ? lot && lotArea : lot)) === ''
      ) {
        e.preventDefault();
        toast.error(
          'Polja označena zvjezdicom (*) su obavezna i ne mogu biti prazna!'
        );
        setCurrentStep(0);
      } else {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('address', address);
        formData.append('city', city);
        // formData.append('country', country);
        formData.append('state', state);
        formData.append('zip', zip);
        formData.append('size', area);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('type', type);
        formData.append('bedrooms', bedrooms);
        formData.append('bathrooms', bathrooms);
        formData.append('yearBuilt', yearBuilt);
        formData.append('municipality', municipality);
        formData.append('description', description);
        formData.append('lot', lot);
        formData.append('lotArea', lotArea);
        formData.append('zamjena', zamjena);
        formData.append('userId', session?.user?.id as string);
        formData.append('lat', finalPosition[0]);
        formData.append('long', finalPosition[1]);
        formData.append('amenities', JSON.stringify(selectedAmenities));

        files.forEach((file: File, i: any) => {
          formData.append('images[' + i + ']', file);
          formData.append('length', i);
        });

        try {
          setLoader(true);
          const res = await axios.post('/api/nekretnina', formData);
          console.log(res);
          if (res.status === 200) {
            router.push(`/nekretnina/${res.data.property.id}`);
            setLoader(false);
          }
          console.log(files.length);
        } catch (error) {
          setLoader(false);
          console.log(error);
        }
      }
    },
    [
      files,
      title,
      address,
      city,
      // country,
      state,
      zip,
      area,
      price,
      bedrooms,
      bathrooms,
      yearBuilt,
      description,
      finalPosition,
      selectedAmenities,
    ]
  );

  return (
    <>
      <Navbar />
      <div className="bg-gray-200 min-h-screen h-full">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col pt-28 pb-20 px-4 h-full w-full">
            <div className={`flex flex-col self-center bg-white px-4 lg:w-4/5 w-full`}>
              <div
                id="lokacija"
                className={`flex flex-col gap-2 self-center h-auto bg-white px-4 w-full ${
                  currentStep !== 0 && 'hidden'
                }`}
              >
                {/* LOKACIJA NEKRETNINE */}
                <div className="flex flex-row gap-2 items-center bg-white h-20 w-full">
                  <GoLocation size={25} />
                  <p className="text-black lg:text-2xl text-xl font-semibold">
                    Lokacija nekretnine
                  </p>
                </div>
                <div className="bg-white self-center pb-6 w-full mb-10 ml-2 mr-2 rounded-t-none rounded-md">
                  <div className="flex lg:flex-row flex-col flex-wrap lg:gap-6 gap-4 mt-6">
                    <Input
                      label="Adresa"
                      onChange={(e: any) => setAddress(e.target.value)}
                      id="address"
                      value={address}
                      required
                      onBlur={() => {
                        {
                          address !== '' && searchByAddress();
                        }
                      }}
                    />
                    <Select
                      required
                      id="city"
                      isSearchable={true}
                      placeholder={'Odaberite grad *'}
                      className="w-68 lg:w-72"
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          boxShadow: state.isFocused ? 'none' : 'none',
                          border: state.isFocused ? '2px solid #3b82f6' : '',
                          '&:hover': {
                            borderColor: state.isFocused
                              ? '2px solid #3b82f6'
                              : '',
                          },
                          height: '3.3rem',
                          backgroundColor: 'rgb(245 245 245 / 1)',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: 'rgb(161 161 170 / 1)',
                        }),
                      }}
                      options={cities}
                      defaultValue={city}
                      onChange={(e: any) => setCity(e.value)}
                    />
                    <Input
                      required
                      label="Opština"
                      onChange={(e: any) => setMunicipality(e.target.value)}
                      id="municipality"
                      value={municipality}
                    />
                    <Input
                      required
                      type="number"
                      label="Poštanski broj"
                      onChange={(e: any) => setZip(e.target.value)}
                      id="zip"
                      value={zip}
                    />
                    <Select
                      required
                      id="state"
                      isSearchable={false}
                      placeholder={'Odaberite entitet *'}
                      className="w-68 lg:w-72"
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          boxShadow: state.isFocused ? 'none' : 'none',
                          border: state.isFocused ? '2px solid #3b82f6' : '',
                          '&:hover': {
                            borderColor: state.isFocused
                              ? '2px solid #3b82f6'
                              : '',
                          },
                          height: '3.3rem',
                          backgroundColor: 'rgb(245 245 245 / 1)',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: 'rgb(161 161 170 / 1)',
                        }),
                      }}
                      options={entities}
                      defaultValue={state}
                      onChange={(e: any) => setState(e.value)}
                    />
                    {/* <Select
                id="country"
                isSearchable={false}
                placeholder={'Odaberite državu'}
                className="w-68 lg:w-72"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    border: '0',
                    height: '3.3rem',
                    backgroundColor: 'rgb(245 245 245 / 1)',
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: 'rgb(161 161 170 / 1)',
                  }),
                }}
                options={countries}
                defaultValue={country}
                onChange={(e: any) => setCountry(e.value)}
              /> */}
                    <MapInitial
                      position={position}
                      setFinalPosition={setFinalPosition}
                    />
                  </div>
                  <p></p>
                </div>
              </div>
              <div
                id="osnovni"
                className={`flex flex-col gap-2 self-center h-auto bg-white px-4 w-full ${
                  currentStep !== 1 && 'hidden'
                }`}
              >
                {/* OSNOVNI PODACI */}
                <div className="flex flex-row gap-2 items-center bg-white h-20 lg:w-4/5 w-full">
                  <BsBuilding size={25} />
                  <p className="text-black text-2xl font-semibold">
                    Osnovni podaci
                  </p>
                </div>
                <div className="bg-white self-center pb-6 w-full mb-10 ml-2 mr-2 rounded-t-none rounded-md">
                  <div className="flex lg:flex-row flex-col flex-wrap lg:gap-6 gap-4 mt-6">
                    <Input
                      required
                      label="Naziv nekretnine"
                      onChange={(e: any) => setTitle(e.target.value)}
                      id="title"
                      value={title}
                    />
                    <Select
                      required
                      id="category"
                      isSearchable={true}
                      placeholder={'Kategorija *'}
                      className="w-68 lg:w-72"
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          boxShadow: state.isFocused ? 'none' : 'none',
                          border: state.isFocused ? '2px solid #3b82f6' : '',
                          '&:hover': {
                            borderColor: state.isFocused
                              ? '2px solid #3b82f6'
                              : '',
                          },
                          height: '3.3rem',
                          backgroundColor: 'rgb(245 245 245 / 1)',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: 'rgb(161 161 170 / 1)',
                        }),
                      }}
                      options={categories}
                      defaultValue={category}
                      onChange={(e: any) => setCategory(e.value)}
                    />
                    <Select
                      required
                      id="type"
                      isSearchable={false}
                      placeholder={'Vrsta oglasa *'}
                      className="w-68 lg:w-72"
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          boxShadow: state.isFocused ? 'none' : 'none',
                          border: state.isFocused ? '2px solid #3b82f6' : '',
                          '&:hover': {
                            borderColor: state.isFocused
                              ? '2px solid #3b82f6'
                              : '',
                          },
                          height: '3.3rem',
                          backgroundColor: 'rgb(245 245 245 / 1)',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: 'rgb(161 161 170 / 1)',
                        }),
                      }}
                      options={types}
                      defaultValue={type}
                      onChange={(e: any) => setType(e.value)}
                    />
                    {type === 'Prodaja' && (
                      <Select
                        required
                        id="zamjena"
                        isSearchable={false}
                        placeholder={'Moguća zamjena?'}
                        className="w-68 lg:w-72"
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 9999 }),
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            boxShadow: state.isFocused ? 'none' : 'none',
                            border: state.isFocused ? '2px solid #3b82f6' : '',
                            '&:hover': {
                              borderColor: state.isFocused
                                ? '2px solid #3b82f6'
                                : '',
                            },
                            height: '3.3rem',
                            backgroundColor: 'rgb(245 245 245 / 1)',
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: 'rgb(161 161 170 / 1)',
                          }),
                        }}
                        options={yesOrNo('Moguća zamjena?')}
                        defaultValue={zamjena}
                        onChange={(e: any) => setZamjena(e.value)}
                      />
                    )}
                    <Input
                      required
                      type="number"
                      label="Cijena"
                      onChange={(e: any) => setPrice(e.target.value)}
                      id="price"
                      value={price}
                    />
                    <Input
                      required
                      type="number"
                      label="Površina u m2"
                      onChange={(e: any) => setArea(e.target.value)}
                      id="area"
                      value={area}
                    />
                    <Select
                      required
                      id="lot"
                      isSearchable={false}
                      placeholder={'Ima dvorište?'}
                      className="w-68 lg:w-72"
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          boxShadow: state.isFocused ? 'none' : 'none',
                          border: state.isFocused ? '2px solid #3b82f6' : '',
                          '&:hover': {
                            borderColor: state.isFocused
                              ? '2px solid #3b82f6'
                              : '',
                          },
                          height: '3.3rem',
                          backgroundColor: 'rgb(245 245 245 / 1)',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: 'rgb(161 161 170 / 1)',
                        }),
                      }}
                      options={yesOrNo('Ima dvorište?')}
                      defaultValue={lot}
                      onChange={(e: any) => setLot(e.value)}
                    />
                    {lot === 'Da' && (
                      <Input
                        required
                        type="number"
                        label="Površina dvorišta u m2"
                        onChange={(e: any) => setLotArea(e.target.value)}
                        id="lotArea"
                        value={lotArea}
                      />
                    )}
                    <Input
                      type="number"
                      label="Godina izgradnje"
                      onChange={(e: any) => setYearBuilt(e.target.value)}
                      id="yearBuilt"
                      value={yearBuilt}
                    />
                    <Input
                      required
                      type="number"
                      label="Broj soba"
                      onChange={(e: any) => setBedrooms(e.target.value)}
                      id="bedrooms"
                      value={bedrooms}
                    />
                    <Input
                      required
                      type="number"
                      label="Broj kupatila"
                      onChange={(e: any) => setBathrooms(e.target.value)}
                      id="bathrooms"
                      value={bathrooms}
                    />
                  </div>
                  <div className="mt-6">
                    <textarea
                      id="message"
                      rows={6}
                      maxLength={10000}
                      value={description}
                      className="flex p-2.5 w-full text-sm text-black bg-neutral-100 rounded-lg focus:outline-none placeholder:text-[1rem] focus:border-2 focus:border-blue-500"
                      placeholder="Opišite vašu nekretninu..."
                      onChange={(e: any) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div
                id="dodaci"
                className={`flex flex-col gap-2 self-center h-auto bg-white px-4 w-full ${
                  currentStep !== 2 && 'hidden'
                }`}
              >
                {/* DODACI */}
                <div className="flex flex-row gap-2 items-center bg-white h-20 lg:w-4/5 w-full">
                  <BsPlusCircle size={25} />
                  <p className="text-black text-2xl font-semibold">
                    Nekretnina posjeduje
                  </p>
                </div>
                <div className="bg-white self-center pb-6 w-full mb-10 ml-2 mr-2 rounded-t-none rounded-md">
                  <div className="p-4">
                    <AmenitySelector
                      selectedAmenities={selectedAmenities}
                      toggleAmenity={toggleAmenity}
                      amenities={amenities}
                    />
                    <div className="mt-4">
                      <h2 className="text-xl mb-2">Odabrane Stavke:</h2>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        {selectedAmenities.map((name) => (
                          <div
                            key={name}
                            className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 p-1 rounded"
                          >
                            {
                              amenities.find((amenity) => amenity.name === name)
                                ?.icon
                            }
                            <span className="text-xs sm:text-sm">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="slike"
                className={`flex flex-col gap-2 self-center h-auto bg-white px-4 w-full ${
                  currentStep !== 3 && 'hidden'
                }`}
              >
                {/* SLIKE */}
                <div className="flex flex-row gap-2 self-center items-center bg-white h-20 w-full">
                  <AiOutlinePicture size={25} />
                  <p className="text-black text-2xl font-semibold">Slike</p>
                </div>
                <div className="bg-white self-center pb-6 w-full mb-10 ml-2 mr-2 rounded-t-none rounded-md">
                  <PhotoUpload
                    onChange={handleFile}
                    files={files}
                    message={message}
                    onClick={removeImage}
                  />
                </div>
              </div>
              <div className="p-2 flex">
                <div className="lg:w-1/2">
                  {currentStep > 0 && (
                    <button
                      className="bg-white border-2 border-blue-500  text-blue-500 p-3 m-2 rounded-md text-md w-auto hover:bg-blue-500 hover:text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        currentStep >= 0
                          ? setCurrentStep(currentStep - 1)
                          : setCurrentStep(currentStep);
                      }}
                    >
                      Nazad
                    </button>
                  )}
                </div>
                <div className="lg:w-1/2 md:w-full w-full flex justify-center">
                  {currentStep === 3 && (
                    <button
                      className="bg-blue-500 text-white p-3 m-2 rounded text-md lg:w-auto w-full hover:bg-blue-600"
                      onClick={addNew}
                    >
                      Dodaj nekretninu
                    </button>
                  )}
                </div>
                <div className="lg:w-1/2 flex justify-end">
                  {currentStep < 3 && (
                    <button
                      className="bg-white border-2 border-blue-500  text-blue-500 p-3 m-2 rounded-md text-md w-auto hover:bg-blue-500 hover:text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        currentStep < 3
                          ? setCurrentStep(currentStep + 1)
                          : setCurrentStep(currentStep);
                      }}
                    >
                      Dalje
                    </button>
                  )}
                </div>
              </div>
            </div>
            {loader && <LoaderOverlay></LoaderOverlay>}
            <Toaster />
          </div>
        </form>
      </div>
    </>
  );
};

export default Nova;
