"use client"
import { ColumnDef, ColumnFiltersState, getFilteredRowModel, VisibilityState, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, SortingState, getSortedRowModel, } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button, buttonVariants } from "@/components/ui/button"
import React, { Suspense } from "react"
import { Eye, Plus, Search, SlidersHorizontal, Star, StarOff, Trash, Trash2, TriangleAlert, Undo, Undo2, X } from "lucide-react"
import { Category, FeaturedStatus } from "@prisma/client";
import { toast } from "sonner";
import Image from "next/image";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DataTablePagination } from "@/components/ui/PaginationControls"
import { catchError, cn } from "@/lib/utils"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExtendedAttributeGroup, ExtendedProduct, ImageFile } from "@/types"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { changeCategoriesStatus, deleteCategories, undoDeleteCategories } from "@/app/_actions/category"
import Link from "next/link"
import { useToaster } from "@/hooks/useToaster"
import ExportDataButton from "@/components/ExportDataButton"
import { CreateAttributeGroup } from "@/components/forms/CreateAttributeGroup"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends ExtendedAttributeGroup, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const toast = useToaster()
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [showWarning, setShowWarning] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            rowSelection,
            columnVisibility,
        },
    })

    return (
        <div className="pb-10 mt-10">
            <div className="w-full justify-end flex mb-4">
                <CreateAttributeGroup />
            </div>
            <div className="flex mb-6 justify-between">
                <div className="flex gap-8">
                    <div className="flex gap-3 items-center">
                        <Badge variant="outline" className={cn("opacity-50 pointer-events-none gap-2")} >
                            <Plus className=" w-4 h-4" />
                            <span>Assign</span>
                        </Badge>
                        <Badge variant="outline" className={cn("opacity-50 pointer-events-none gap-2")} >
                            <Eye className=" w-4 h-4" />
                            <span>Visibility</span>
                        </Badge>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="max-w-fit border border-border gap-2">
                            <SlidersHorizontal className="w-4 h-4" /> View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Table>
                <TableHeader className="!bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="!bg-white">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-[72.5px] text-center">
                                No products found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <DataTablePagination table={table} />
        </div >
    )
}