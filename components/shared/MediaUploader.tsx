'use client'
import React from 'react'
import { useToast } from "@/hooks/use-toast"
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { dataUrl, getImageSize } from '@/lib/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';


type MediaUploaderProps = {
    onValueChange: (value: string) => void;
    setImage: React.Dispatch<any>;
    image: any;
    publicId: string;
    type: string;
}

const MediaUploader = ({
    onValueChange,
    setImage,
    image,
    publicId,
    type,
}: MediaUploaderProps) => {

    const onUploadSuccessHandler = (result: any) => {
        setImage((prevState: any) => ({
            ...prevState,
            publicId: result?.info?.public_id,
            width: result?.info?.width,
            height: result?.info?.height,
            secureURL: result?.info?.secure_url
        }));
        
        onValueChange(result?.info?.secure_url);

        toast({
            title: 'Image uploaded successfully',
            description: '1 credit was deducted from your account',
            duration: 5000,
            className: 'success-toast'
        })
    }

    const onUploadErrorHandler = () => {
        toast({
            title: 'Something went wrong while uploading',
            description: 'Please try agian',
            duration: 5000,
            className: 'error-toast'
        })
    }

    const { toast } = useToast()

    return (
        <CldUploadWidget
            uploadPreset='jsm_imaginify'
            options={{
                multiple: false,
                // maxFiles: 1,
                resourceType: 'image',
                // clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma', 'aiff', 'ape', 'au', 'mid', 'midi', 'rmi', 'mpg', 'mpeg', 'mpe', 'qt', 'mov', 'avi', 'movie', 'webm', 'mp4', 'm4v', '3gp', '3g2', 'ogg', 'ogv', 'webm', 'mp3', 'wav', 'flac', 'aac', 'm4a', 'wma', 'aiff', 'ape', 'au', 'mid', 'midi', 'rmi', 'mpg', 'mpeg', 'mpe', 'qt', 'mov', 'avi', 'movie', 'webm', 'mp4', 'm4v', '3gp', '3g2', 'ogg', 'ogv', 'webm', 'mp3', 'wav', 'flac', 'aac', 'm4a', 'wma', 'aiff', 'ape', 'au', 'mid', 'midi', 'rmi'],
            }}
            onSuccess={onUploadSuccessHandler}
            onError={onUploadErrorHandler}
        >
            {({ open }) => {
                return (
                    <div className='flex flex-col gap-4'>
                        <h3 className='h3-bold text-dark-600'>
                            Original
                        </h3>

                        {publicId ?
                            <>
                                <div className='cursor-pointer overflow-hidden rounded-[10px]'>
                                    <CldImage
                                        width={getImageSize(type, image, 'width')}
                                        height={getImageSize(type, image, 'height')}
                                        src={publicId}
                                        alt='image'
                                        sizes={"(max-width: 767px) 100vw, 50vw"}
                                        placeholder={dataUrl as PlaceholderValue}
                                        className='media-uploader_cld-image'
                                    />
                                </div>
                            </>
                            :
                            <div
                                className='media-uploader_cta'
                                onClick={() => open()} >
                                <div className='media-uploader_cta-image'>
                                    <Image src="/assets/icons/add.svg" alt='add image' width={24} height={24} />

                                </div>
                                <p className='p-14-medium'>Click here to upload an image</p>
                            </div>
                        }

                    </div>

                )
            }}

        </CldUploadWidget>
    )
}

export default MediaUploader