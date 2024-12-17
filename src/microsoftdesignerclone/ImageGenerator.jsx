import React, { useState } from 'react';
import { generateImageWithHuggingFace } from './imageService';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [imageCount, setImageCount] = useState(1);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useGSAP(()=>{
        gsap.from('#content',{
            y:100,
            opacity:0,
            stagger:0.3
        })
        gsap.from('#images',{
            y:100,
            opacity:0,
            stagger:0.4,
        })
    })

    const styles = ['Photorealistic', 'Digital Art', 'Anime', 'Cyberpunk', 'Watercolor', 'Pixel Art', 'unreal', '3D'];

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        const newImages = [];

        try {
            const promises = Array.from({ length: imageCount }).map(() => generateImageWithHuggingFace(prompt));
            const results = await Promise.all(promises);

            results.forEach((url) => {
                if (url) newImages.push(url);
            });

            setImages((prev) => [...newImages, ...prev]); // Add new images to existing ones
        } catch (err) {
            setError('Failed to generate one or more images. Please try again.');
            console.error('Image Generation Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-gradient-to-r from-violet-200 to-pink-200 h-full lg:h-screen w-full  py-10'>
        <div className={`flex flex-col justify-items-center  ${images.length > 0 ? 'pt-10' : 'pt-28'}`}>
            <h1 className="text-4xl font-bold text-center text-black  mb-6" id='content' >Dream Morph AI Image Generator</h1>

            <div className="flex flex-col xl:flex-col md:flex-row justify-center items-center mb-6 gap-4">
                <div className='relative' id='content'>
                    <input
                        type="text"
                        placeholder="Describe your image..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="p-3 border rounded-lg xl:w-[800px] w-96 pe-36 "
                    />
                    <div className='absolute items-center bg-white  py-0.5 flex top-2 right-0.5 gap-2'>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={imageCount}
                            onChange={(e) => setImageCount(Number(e.target.value))}
                            className="w-20 p-1 border rounded-lg text-center"
                            placeholder="Count"
                        />
                        {prompt &&
                            <button type="button" className='w-8 h-8 text-red-500 rounded-full' onClick={() => {
                                setPrompt('')
                                setImages([])
                                setImageCount(1)
                            }}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </button>
                        }
                    </div>
                </div>



                {/* Generate Button */}
                <div className='relative p-1' id='content'>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-gradient-to-r from-amber-500 to-pink-500  text-white px-6 py-3 rounded-lg transition duration-200 w-56" 
                    >
                        {loading ? <div className="animate-spin flex justify-center items-center mx-auto ease-linear rounded-full w-8 h-8 border-t-2 border-b-2 border-white" /> : <span className='flex gap-2 justify-center items-center'><p >Generate </p>{imageCount > 1 && <span className=' mt-1 w-5 h-5 p-1 rounded-full flex justify-center items-center bg-yellow-500 text-black absolute -top-1 right-0'>{imageCount}</span>}</span>}
                    </button>
                </div>
            </div>

            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            {/* Style Buttons */}
                <p className='text-xl text-center font-semibold mb-4' id='content'>Apply Styles</p><br /> <br />
            <div className="flex justify-center flex-wrap gap-3 mb-6 w-fit mx-auto border p-2" id='content'>
                {styles.map((style) => (
                    <button
                        key={style}
                        onClick={() => setPrompt(`${prompt} in ${style} style`)}
                        className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-lg text-white hover:bg-gray-100 transition flex justify-center items-center gap-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 19.5-15-15m0 0v11.25m0-11.25h11.25" />
                        </svg>

                        <p>{style}</p>
                    </button>
                ))}
            </div>

            {/* Generated Images */}
            <div className="flex justify-center items-center lg:gap-10 flex-col gap-3  lg:flex-row md:flex-wrap">
                {images.map((url, index) => (
                    <div key={index} className="bg-white rounded-lg shadow overflow-hidden relative" id='images'>
                        <img src={url} alt={`Generated ${index}`} className="w-full h-48 object-cover hover:scale-105 hover:ease-in hover:duration-300 hover:backdrop-blur-lg" />
                        {/* <div className="p-3 text-center">
                            <button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `generated-image-${index + 1}.png`;
                                    link.click();
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Download
                            </button>
                        </div> */}
                        <button type="button" className='bg-transparent border border-white rounded-lg p-0.5 h-7 w-7 text-white absolute top-1 right-2 hover:text-black hover:bg-white' onClick={() => {
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${prompt}-${index + 1}.png`;
                            link.click();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mx-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>

                        </button>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default ImageGenerator;
