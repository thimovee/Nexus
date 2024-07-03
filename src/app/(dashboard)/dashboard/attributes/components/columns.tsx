"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { ChevronDown, ChevronUp, ChevronsUpDown, Edit, EditIcon, Eye, Loader2, MoreHorizontal, PencilIcon, PlusCircle, Redo, Trash, TriangleAlert, Undo } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ExtendedAttributeGroup, ExtendedProduct, ImageFile } from "@/types"
import { deleteCategories, undoDeleteCategories } from "@/app/_actions/category"
import { useToaster } from "@/hooks/useToaster"
import React, { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { deleteProducts, undoDeleteProducts } from "@/app/_actions/product"
import { Input } from "@/components/ui/input"
import { createNewAttributeValue, deleteAttributeGroup, deleteAttributeValue } from "@/app/_actions/attributes"
import EditAttributeGroupForm from "@/components/forms/EditAttributeGroup"


export const columns: ColumnDef<ExtendedAttributeGroup>[] = [
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
        id: "name",
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
                <div className="pl-4 flex items-center gap-2">
                    <span>{cell.row.original.name}</span>
                </div>
            )
        },
    },
    {
        id: "description",
        accessorKey: "description",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Description
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span>{cell.row.original.description}</span>
            )
        },
    },
    {
        id: "values",
        accessorKey: "values",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Values
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [showForm, setShowForm] = useState(false)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [newAttributeValue, setNewAttributeValue] = useState("")
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [isLoading, setIsLoading] = useState(false)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [errorMessage, setErrorMessage] = useState("")
            function createValue() {
                try {
                    setIsLoading(true)
                    if (!newAttributeValue) {
                        setErrorMessage("Value cannot be empty")
                        setIsLoading(false)
                        return
                    } else {
                        setErrorMessage("")
                        createNewAttributeValue(cell.row.original.id, newAttributeValue)
                        setNewAttributeValue("")
                        setIsLoading(false)
                    }
                } catch (error) {
                    console.error(error)
                }
            }

            function deleteValue(id: number) {
                try {
                    deleteAttributeValue(id);
                } catch (error) {
                    console.error(error);
                }
            }



            return (
                <Dialog>
                    <DialogTrigger>
                        <Badge className="ml-4" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                        </Badge>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Manage values for {cell.row.original.name}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-80 w-full flex flex-col bg-gray-100 rounded-md">
                            {cell.row.original.attributeValues.length > 0 ? cell.row.original.attributeValues.map((value) => (
                                <div key={value.id} className="px-3 hover:bg-gray-200 duration-100 ease-in-out flex justify-between items-center gap-2">
                                    <span>{value.value}</span>
                                    <Button
                                        disabled={isLoading}
                                        onClick={() => deleteValue(value.id)}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>

                                </div>
                            )) : <div className="text-sm text-primary/50 text-center my-40">No values found for this attribute,
                                <span
                                    onClick={() => setShowForm(!showForm)}
                                    className="text-cta font-semibold hover:cursor-pointer"> Add one now</span></div>}
                        </ScrollArea>
                        <Button className="w-full gap-2 items-center" variant="outline" onClick={() => setShowForm(!showForm)}>
                            <PlusCircle className={cn("h-4 w-4", showForm && "rotate-45")} />
                            <span>{showForm ? "Cancel" : "Add Value"}</span>
                        </Button>
                        {showForm && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    createValue()
                                }}
                                className="grid grid-cols-1 gap-4">
                                <Input
                                    value={newAttributeValue}
                                    placeholder="Enter the name of a value.." onChange={(e) => setNewAttributeValue(e.target.value)} />
                                {errorMessage && <span className="text-red-500">{errorMessage}</span>}
                                <Button variant="cta">
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Add Value"}
                                </Button>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            )
        },
    },
    {
        id: "attributeCount",
        accessorKey: "attributes",
        sortingFn: "auto",
        header: ({ column }) => {
            return (
                <Button variant="ghost" size={"sm"}
                    className="font-semibold text-primary/75 flex gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Attributes
                    {column.getIsSorted() ? column.getIsSorted() === "desc" ? (<ChevronDown className="h-4 w-4" />) : <ChevronUp className="h-4 w-4 " /> : (<ChevronsUpDown className="h-4 w-4 " />)}
                </Button>
            )
        },
        cell: ({ cell }) => {
            return (
                <span className="pl-6">{cell.row.original.attributeCount}x</span>
            )
        },
    },
    {
        id: "actions",
        accessorKey: "actions",
        header: () => {
            return (
                <span className="font-semibold text-primary/75">Actions</span>
            )
        },
        cell: ({ row }) => {
            const attribute = row.original as ExtendedAttributeGroup
            async function deleteAttribute() {
                await deleteAttributeGroup(row.original.id)
            }
            return (
                <div className="flex gap-2">
                    <EditAttributeGroupForm attribute={attribute} />
                    <Button onClick={deleteAttribute} variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    }
]
