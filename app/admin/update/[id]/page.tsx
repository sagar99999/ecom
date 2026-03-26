"use client"

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { CircleUserRound, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type ProductFormType = {
    name: string;
    price: number;
    quantity: number;
    category: "tops" | "shoes" | "bottoms";
    description: string;
    image: FileList;
};

export default function ProductForm() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormType>();

    // Handle image preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImagePreview(URL.createObjectURL(file));
    };

    // Submit handler
    const onSubmit: SubmitHandler<ProductFormType> = async (data) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("price", data.price.toString());
            formData.append("quantity", data.quantity.toString());
            formData.append("category", data.category);
            formData.append("description", data.description);

            // Append image only if a new file is selected
            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]);
            }

            // Determine HTTP method and URL
            const method = id ? "PUT" : "POST";
            const url = id ? `/api/products/${id}` : "/api/products";

            const response = await fetch(url, { method, body: formData });

            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.error || "Failed to upload product");
            }

            const result = await response.json();

            toast.success("Product Updated", {
                description: `Product ${id ? "updated" : "created"} successfully`,
            });

            // Reset form and image preview if adding new product
            reset({
                name: result.name,
                price: result.price,
                quantity: result.quantity,
                category: result.category,
                description: result.description,
            });
            setImagePreview(result.imageUrl);

            router.refresh()

            if (!id) setImagePreview(null);

            // If editing, update the preview with the returned image URL
            if (id && result.product?.imageUrl) {
                setImagePreview(result.product.imageUrl);
            }
        } catch (error: any) {
            toast.error("Update Failed", { description: error.message });
        }
    }

    // Delete handler via ShadCN AlertDialog
    const handleDeleteConfirm = async () => {
        if (!id) return;
        try {
            const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete product");

            setIsDeleteOpen(false);
            toast.success("Deleted", { description: "Product deleted successfully" });
            router.push("/admin");
        } catch (error: any) {
            toast.error("Delete Failed", { description: error.message });
        }
    };

    // Fetch existing product data if editing
    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");

                const product = await res.json();
                reset({
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    category: product.category,
                    description: product.description,
                });
                setImagePreview(product.imageUrl);
                setIsMounted(true)
            } catch (error: any) {
                toast.error("Error", { description: error.message });
            }
        };
        fetchProduct();
    }, [id, reset]);

    // Wait for user data to load before rendering the form
    if (!isMounted) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="max-w-150 px-5 mb-15 mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold mb-4">Update Product</h1>
                <Link href="/admin">
                    <CircleUserRound className="size-6" />
                </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name */}
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="name">Name *</label>
                    <Input
                        id="name"
                        className="h-11 bg-near-black border-2 border-[#252525]"
                        {...register("name", { minLength: { value: 3, message: "provide valid name" }, required: "provide valid name" })}
                        placeholder="Product name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-4">{errors.name.message}</p>}
                </div>

                {/* Price */}
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="price">Price *</label>
                    <Input
                        type="number"
                        id="price"
                        className="h-11 bg-near-black border-2 border-[#252525]"
                        {...register("price", { valueAsNumber: true, min: { value: 1, message: "provide valid product price" }, required: { value: true, message: "provide valid product price" } })}
                        placeholder="Product price"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-4">{errors.price.message}</p>}
                </div>

                {/* Quantity */}
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="quantity">Quantity *</label>
                    <Input
                        type="number"
                        id="quantity"
                        className="h-11 bg-near-black border-2 border-[#252525]"
                        {...register("quantity", { valueAsNumber: true, min: { value: 1, message: "provide valid product quantity" }, required: { value: true, message: "provide valid product quantity" } })}
                        placeholder="Product quantity"
                    />
                    {errors.quantity && <p className="text-red-500 text-sm mt-4">{errors.quantity.message}</p>}
                </div>

                {/* Category */}
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="category">Category *</label>
                    <Input
                        id="category"
                        className="h-11 bg-near-black border-2 border-[#252525]"
                        {...register("category", { required: { value: true, message: "provide valid category" }, minLength: { value: 4, message: "provide valid category" } })}
                        placeholder="Product category eg: shoes | tops | bottoms"
                    />
                    {errors.category && <p className="text-red-500 text-sm mt-4">{errors.category.message}</p>}
                </div>

                {/* Description */}
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="description">Description *</label>
                    <Textarea
                        id="description"
                        className="h-11 bg-near-black border-2 border-[#252525]"
                        {...register("description", { required: { value: true, message: "provide valid product description" }, minLength: { value: 12, message: "provide valid product description" } })}
                        placeholder="Product description"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-4">{errors.description.message}</p>}
                </div>

                {/* Image */}
                <div className="mb-7">
                    <label className="text-sm mb-2 block" htmlFor="image">Product image {id ? "(leave empty to keep existing)" : "*"}</label>
                    {(() => {
                        const { onChange, ...rest } = register("image", {
                            validate: {
                                fileType: (files: FileList) => {
                                    if (!files || files.length === 0) return true;
                                    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
                                    return allowedTypes.includes(files[0].type) || "Only JPEG, PNG, or WEBP files are allowed";
                                },
                                fileSize: (files: FileList) => {
                                    if (!files || files.length === 0) return true;
                                    return files[0].size / 1024 / 1024 <= 4 || "Max 4MB";
                                },
                            },
                        });
                        return (
                            <Input
                                type="file"
                                accept="image/*"
                                {...rest}
                                onChange={(e) => {
                                    onChange(e);
                                    handleImageChange(e);
                                }}
                                className="h-11 bg-near-black border-2 border-[#252525]"
                            />
                        )
                    })()}
                    {imagePreview && (
                        <Image src={imagePreview} alt="Preview" width={300} height={300} className="mt-5 rounded object-cover mx-auto" />
                    )}
                    {errors.image && <p className="text-red-500 text-sm mt-4">{errors.image.message}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <Button disabled={isSubmitting} type="submit" className="bg-brand-green text-black grow h-12 cursor-pointer">
                        {
                            isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />
                        }
                        Update
                    </Button>

                    {/* ShadCN AlertDialog for Delete */}
                    <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-red-700 text-white grow h-12 cursor-pointer" disabled={!id || isSubmitting}>
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black box-content p-8">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="font-bold">Confirm Delete</AlertDialogTitle>
                                <AlertDialogDescription className="font-semibold">
                                    Are you sure you want to delete this product? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogDescription className=" bg-black">
                                <AlertDialogCancel className="bg-white cursor-pointer font-bold! rounded-sm px-4! py-0! text-sm mr-3 text-black">Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-700 cursor-pointer font-bold! rounded-sm px-4! py-0! text-sm text-white" onClick={handleDeleteConfirm}>
                                    Confirm
                                </AlertDialogAction>
                            </AlertDialogDescription>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </form>
        </div>
    );
}