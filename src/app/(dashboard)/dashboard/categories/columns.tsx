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
import { ExtentedCategory, ImageFile } from "@/types"
import { deleteCategories, undoDeleteCategories } from "@/app/_actions/category"
import { useToaster } from "@/hooks/useToaster"
import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"


export const columns: ColumnDef<ExtentedCategory>[] = [
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
                    Category
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            const images = cell.row.original.thumbnail as ImageFile[]
            return (
                <>{cell.row.original.name && (
                    <div className="pl-2 flex items-center gap-4">
                        {images.map((image, i) => (
                            <Image key={i} loading="lazy" width={1500} height={1500} className="h-10 w-10 shrink-0 rounded-full object-cover object-center" src={image.url} alt={image.name} />
                        ))}
                        <span className="font-semibold">{cell.row.original.name}</span>
                    </div>
                )}</>)
        },
    },
    {
        accessorKey: "productCount",
        sortingFn: "alphanumeric",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Products
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4 " />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span className="pl-6">{cell.row.original.productCount}x</span>
            )
        },
    },
    {
        accessorKey: "status",
        sortingFn: "basic",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4 " />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: (cell) => (
            <div>
                <Badge className="!text-xs !rounded-md" variant={cell.row.original.status === 'ACTIVE' ? 'success' : cell.row.original.status === 'NOT_FEATURED' ? 'destructive' : 'archived'}>
                    {cell.row.original.status === 'ACTIVE' ? 'Featured' : cell.row.original.status === 'NOT_FEATURED' ? 'Not Featured' : 'Archived'}
                </Badge>
            </div>
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
            const category = row.original
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [isDialogOpen, setIsDialogOpen] = React.useState(false)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const toast = useToaster()
            function deleteCategory() {
                if (category.status === 'ACTIVE') {
                    toast({
                        title: "Cannot delete a featured category",
                        variant: "warning",
                        icon: <TriangleAlert className="h-4 w-4" />,
                        duration: 5000,
                        size: "icon"
                    })
                    return
                } else if (category.productCount > 0) {
                    toast({
                        title: "Cannot delete a category with linked products",
                        variant: "warning",
                        icon: <TriangleAlert className="text-warning h-4 w-4" />,
                        duration: 5000,
                        size: "icon"
                    })
                } else {
                    setIsDialogOpen(true)
                }
            }

            function undoDeletion() {
                undoDeleteCategories(category.id)
                toast({
                    title: "Category deletion undone",
                    variant: "success",
                    duration: 3000,
                    icon: <Undo className="h-4 w-4" />,
                })
            }


            return (
                <div className="flex items-center gap-2">
                    <Link href={`/dashboard/categories/edit/${category.slug}`} className={cn(buttonVariants({ variant: "ghost", size: "md" }))} aria-label="Edit category">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit category</span>
                    </Link>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <Button onClick={() => deleteCategory()} size="md" variant="ghost" aria-label="Delete category">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete category</span>
                        </Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Category Deletion.</DialogTitle>
                                <DialogDescription asChild className="py-8">
                                    <div className="flex gap-2 items-center">
                                        <TriangleAlert className="h-5 w-5 text-warning" />
                                        <p>You are about to delete the category <span className="font-semibold">{category.name}</span>. Are you sure you want to proceed?</p>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="w-full grid grid-cols-2 gap-3">
                                <DialogClose asChild>
                                    <Button size="md" variant="subtle">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button size="md" variant="destructive" onClick={() => {
                                    deleteCategories(category.id).then(() => {
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
                                    setIsDialogOpen(false)
                                }
                                }>
                                    Delete
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )
        },
    },
]
