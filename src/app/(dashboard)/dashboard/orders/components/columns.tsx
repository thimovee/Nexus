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
import { ChevronDown, ChevronUp, ChevronsUpDown, Edit, Edit2Icon, EditIcon, Eye, PencilIcon, Redo, Trash, TriangleAlert, Undo } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ExtentedCategory, ImageFile } from "@/types"
import { deleteCategories, undoDeleteCategories } from "@/app/_actions/category"
import { useToaster } from "@/hooks/useToaster"
import React from "react"
import Link from "next/link"
import { cn, formatDate, formatPrice } from "@/lib/utils"
import { Order } from "@prisma/client"


export const columns: ColumnDef<Order>[] = [
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
        accessorKey: "id",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span className="pl-6">{cell.row.original.id}</span>
            )
        },
    },
    {
        accessorKey: "date",
        sortingFn: "datetime",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span>{formatDate(cell.row.original.createdAt)}</span>
            )
        },
    },
    {
        accessorKey: "name",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span className="pl-3">{cell.row.original.name}</span>
            )
        },
    },
    {
        accessorKey: "status",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span className="pl-3">{cell.row.original.status}</span>
            )
        },
    },
    {
        accessorKey: "total",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Total
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span className="pl-3">{cell.row.original.total && formatPrice(cell.row.original.total)}</span>
            )
        },
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
            const order = row.original
            return (
                <div className="flex items-center gap-2">
                    <Link href={`/dashboard/orders/${order.id}`} className={cn(buttonVariants({ variant: "ghost", size: "md" }))} aria-label="Edit category">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Edit category</span>
                    </Link>
                    <Button variant="ghost" size="md" aria-label="Edit order">
                        <Edit2Icon className="h-4 w-4" />
                        <span className="sr-only">Edit category</span>
                    </Button>
                    <Button variant="ghost" size="md" aria-label="Delete order">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete category</span>
                    </Button>
                </div>
            )
        },
    },
]
