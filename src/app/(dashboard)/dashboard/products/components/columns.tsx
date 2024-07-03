"use client"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsUpDown, Edit, EditIcon, Eye, PencilIcon, Redo, Trash, TriangleAlert, Undo } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ExtendedProduct, ImageFile } from "@/types"
import { deleteCategories, undoDeleteCategories } from "@/app/_actions/category"
import { useToaster } from "@/hooks/useToaster"
import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { deleteProducts, undoDeleteProducts } from "@/app/_actions/product"


export const columns: ColumnDef<ExtendedProduct>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                className=""
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        sortingFn: "text",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Product
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            const images = cell.row.original.images as ImageFile[]
            return (
                <>{cell.row.original.name && (
                    <div className="pl-2 flex items-center gap-4">
                        {images.slice(0, 1).map((image, i) => (
                            <Image key={i} loading="lazy" width={1500} height={1500} className="h-10 w-10 shrink-0 rounded-full object-cover object-center" src={image.url} alt={image.name} />
                        ))}
                        <span className="font-semibold">{cell.row.original.name}</span>
                    </div>
                )}</>)
        },
    },
    {
        accessorKey: "category",
        sortingFn: "basic",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4 " />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: (cell) => (
            <Badge className="!bg-cta/15 !rounded-md" variant="outline" >
                {cell.row.original.category}
            </Badge>
        )
    },
    {
        accessorKey: "rating",
        sortingFn: "basic",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Rating
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4 " />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: (cell) => {
            const rating = cell.row.original.rating ? cell.row.original.rating : 0
            const formattedRating = rating % 1 === 0 ? rating + ".0" : rating
            return (
                <span className="pl-6">{formattedRating}</span>
            )
        }
    },
    {
        //  voor filtering op discount
        accessorKey: "discount",
        sortingFn: "basic",
        header: ({ column }) => <></>,
        cell: ({ }) => <></>
    },
    {
        accessorKey: "price",
        sortingFn: "basic",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4 " />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },

        cell: ({ cell }) => {
            const amount = parseFloat(cell.row.original.price.toString());
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return (
                <span className="pl-3 relative">
                    {cell.row.original.discount ? (
                        <>
                            <span className="absolute -top-4 right-1 line-through text-xs text-primary/50">{formatted}</span>
                            <span>{new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                            }).format(amount - (amount * cell.row.original.discount / 100))}</span>
                        </>
                    ) : (
                        formatted
                    )}
                </span>
            );
        },
    },
    {
        accessorKey: "inventory",
        sortingFn: "basic",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Inventory
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4 " />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: (cell) => (
            <span className="pl-3">{cell.row.original.inventory}x</span>
        )
    },
    {
        accessorKey: "orders",
        sortingFn: "basic",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Orders
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4 " />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: (cell) => (
            <span className="pl-3">{cell.row.original.orders}x</span>
        )
    },
    {
        id: "actions",
        enableHiding: false,
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                >
                    Actions
                </Button>
            )
        },
        cell: ({ row }) => {
            const product = row.original
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [isDialogOpen, setIsDialogOpen] = React.useState(false)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const toast = useToaster()
            // function deleteCategory() {
            //     if (category.status === 'ACTIVE') {
            //         toast({
            //             title: "Cannot delete a featured category",
            //             variant: "warning",
            //             icon: <TriangleAlert className="h-4 w-4" />,
            //             duration: 5000,
            //             size: "icon"
            //         })
            //         return
            //     } else if (category.productCount > 0) {
            //         toast({
            //             title: "Cannot delete a category with linked products",
            //             variant: "warning",
            //             icon: <TriangleAlert className="text-warning h-4 w-4" />,
            //             duration: 5000,
            //             size: "icon"
            //         })
            //     } else {
            //         setIsDialogOpen(true)
            //         if (row.getIsSelected()) {
            //             row.toggleSelected()
            //         }
            //     }
            // }

            // function undoDeletion() {
            //     undoDeleteCategories([category.id])
            //     toast({
            //         title: "Category deletion undone",
            //         variant: "success",
            //         duration: 3000,
            //         icon: <Undo className="h-4 w-4" />,
            //     })
            // }

            function undoDeletion() {
                undoDeleteProducts([product.id])
                toast({
                    title: "Category deletion undone",
                    variant: "success",
                    duration: 3000,
                    icon: <Undo className="h-4 w-4" />,
                })
            }

            return (
                <div className="flex items-center gap-2">
                    <Link href={`/dashboard/products/edit/${product.slug}`} className={cn(buttonVariants({ variant: "ghost", size: "md" }))} aria-label="Edit product">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit product</span>
                    </Link>
                    <Link href={`/products/${product.slug}`} className={cn(buttonVariants({ variant: "ghost", size: "md" }))} aria-label="View product">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View category</span>
                    </Link>
                    <Button onClick={async () => await deleteProducts([product.id]).then(() => {
                        toast({
                            title: "Category deleted",
                            description: "Category has been deleted successfully",
                            action: <div
                                onClick={() => undoDeletion()}
                                className="translate-x-4 border border-red-500 text-sm text-background font-semibold bg-red-500 rounded-md px-2 py-1">Undo</div>,
                            duration: 10000,
                            size: "icon"
                        })
                    }).catch((error) => {
                        toast({
                            title: "Error deleting category",
                            description: error.message,
                            variant: "warning",
                            icon: <TriangleAlert className="h-4 w-4" />,
                            duration: 5000,
                            size: "icon"
                        })
                    })

                    } variant="ghost" size={"md"} aria-label="Delete category">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete category</span>
                    </Button>
                </div>
            )
        },
    },
]
