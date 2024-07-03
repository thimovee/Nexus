"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsUpDown, Edit, Edit2Icon, EditIcon, Eye, PencilIcon, Redo, Trash, TriangleAlert, Undo } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Customer, ExtentedCategory, ImageFile } from "@/types"
import React, { useState } from "react"
import Link from "next/link"
import { cn, formatDate, formatNumberDate, formatPrice } from "@/lib/utils"
import Image from "next/image"
import { deleteUser, updateUser } from "@/app/_actions/users"
import EditUser from "@/components/forms/EditUser"


export const columns: ColumnDef<Customer>[] = [
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
            const id = cell.row.original.id.replace("user_", "")
            return (
                <span>{id}</span>
            );
        },



    },
    {
        accessorKey: "firstName",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    User
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image src={cell.row.original.imageUrl} alt="" fill className=" rounded-full" />
                    </div>
                    <span className="font-semibold">
                        {cell.row.original.firstName && cell.row.original.lastName ? `${cell.row.original.firstName} ${cell.row.original.lastName}` : cell.row.original.emailAddresses[0].emailAddress}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Registered
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span>{formatNumberDate(cell.row.original.createdAt)}</span>
            )
        },
    },
    {
        accessorKey: "lastSignInAt",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last sign in
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span className="pl-3">{cell.row.original.lastSignInAt ? formatNumberDate(cell.row.original.lastSignInAt) : "Never"}</span>
            )
        },
    },
    {
        accessorKey: "role",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Role
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span className="pl-3 capitalize">{cell.row.original.role === "admin" ? "Admin" : "User"}</span>
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
        cell: ({ cell }) => {
            const customer = cell.row.original
            return (
                <div className="flex items-center gap-2">
                    <EditUser customer={customer} />

                    <Button onClick={() => deleteUser(customer.id)} variant="ghost" size="md" aria-label="Delete order">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete user</span>
                    </Button>
                </div>
            )
        },
    },
]
