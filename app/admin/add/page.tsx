"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import Link from "next/link";
import { CircleUserRound } from "lucide-react"

export type ProductFormType = {
    name: string;
    price: number;
    quantity: number;
    category: "tops" | "shoes" | "bottoms";
    description: string;
    image: FileList;
};

export default function ProductForm() {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormType>();

    const onSubmit: SubmitHandler<ProductFormType> = async (data) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("price", data.price.toString());
            formData.append("quantity", data.quantity.toString());
            formData.append("category", data.category);
            formData.append("description", data.description);

            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]);
            }

            const response = await fetch("/api/products", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Failed to upload product");
            }

            toast.success("Success", {
                description: "Product uploaded successfully",
            });

            reset()
        } catch (error: any) {
            toast.error("Upload Failed", {
                description: error.message
            });
        }
    }

    return (
        <div className="max-w-150 px-5 mb-15 mx-auto">
            <div className='flex items-center justify-between'>
                <h1 className="text-lg font-bold mb-4">New Product</h1>
                <Link href="/admin">
                    <CircleUserRound className="size-6" />
                </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="name">Name *</label>
                    <Input id="name" className="h-11 bg-near-black border-2 border-[#252525]" {...register("name", {
                        minLength: {
                            value: 3,
                            message: "provide valid name"
                        },
                        required: "provide valid name"
                    })} placeholder="Product name" />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-4">{errors.name.message}</p>
                    )}
                </div>
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="price">Price *</label>
                    <Input type="number" id="price" className="h-11 bg-near-black border-2 border-[#252525]" {...register("price", {
                        valueAsNumber: true,
                        min: {
                            value: 1,
                            message: "provide valid product price"
                        },
                        required: {
                            value: true,
                            message: "provide valid product price"
                        }
                    })} placeholder="Product price" />
                    {errors.price && (
                        <p className="text-red-500 text-sm mt-4">{errors.price.message}</p>
                    )}
                </div>
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="quantity">Quantity *</label>
                    <Input type="number" id="quantity" className="h-11 bg-near-black border-2 border-[#252525]" {...register("quantity", {
                        valueAsNumber: true,
                        min: {
                            value: 1,
                            message: "provide valid product quantity"
                        },
                        required: {
                            value: true,
                            message: "provide valid product quantity"
                        }
                    })} placeholder="Product quantity" />
                    {errors.quantity && (
                        <p className="text-red-500 text-sm mt-4">{errors.quantity.message}</p>
                    )}
                </div>
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="category">Category *</label>
                    <Input id="category" className="h-11 bg-near-black border-2 border-[#252525]" {...register("category", {
                        required: {
                            value: true,
                            message: "provide valid category"
                        },
                        minLength: {
                            value: 4,
                            message: "provide valid category"
                        }
                    })} placeholder="Product category eg: shoes | tops | bottoms" />
                    {errors.category && (
                        <p className="text-red-500 text-sm mt-4">{errors.category.message}</p>
                    )}
                </div>
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="description">Description *</label>
                    <Textarea id="description" className="h-11 bg-near-black border-2 border-[#252525]" {...register("description", {
                        required: {
                            value: true,
                            message: "provide valid product description"
                        },
                        minLength: {
                            value: 12,
                            message: "provide valid product description"
                        }
                    })} placeholder="Product description"></Textarea>
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-4">{errors.description.message}</p>
                    )}
                </div>

                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="image">Product image *</label>
                    <Input
                        {...register("image", {
                            required: "product image is required",
                            validate: {
                                fileType: (files: FileList) => {
                                    if (!files || files.length === 0) return "Please select an image";
                                    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
                                    return allowedTypes.includes(files[0].type) || "Only JPEG, PNG, or WEBP files are allowed";
                                },
                                fileSize: (files: FileList) => {
                                    if (!files || files.length === 0) return true;
                                    const maxSizeInMB = 4;
                                    return files[0].size / 1024 / 1024 <= maxSizeInMB || `File must be smaller than ${maxSizeInMB}MB`;
                                },
                            },
                        })}
                        id="image" className="h-11 bg-near-black border-2 border-[#252525]" type="file" accept="image/*" />
                    {errors.image && (
                        <p className="text-red-500 text-sm mt-4">{errors.image.message}</p>
                    )}
                </div>
                <Button disabled={isSubmitting} type="submit" className="bg-brand-green text-black w-full h-12 cursor-pointer">Upload</Button>
            </form>
        </div>
    );
}