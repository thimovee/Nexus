"use client"
import { ColumnDef, ColumnFiltersState, getFilteredRowModel, VisibilityState, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, SortingState, getSortedRowModel, } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button, buttonVariants } from "@/components/ui/button"
import React, { Suspense } from "react"
import { Archive, Filter, LucideAlertTriangle, Merge, Plus, Search, SlidersHorizontal, Star, Trash, Trash2, Undo2, X } from "lucide-react"
import { Category, FeaturedStatus } from "@prisma/client";
// import { deleteCategories } from "@/app/_actions/category";
import { toast } from "sonner";
import Image from "next/image";
// import { CreateCategory } from "@/components/forms/CreateCategory"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DataTablePagination } from "@/components/ui/PaginationControls"
import { catchError, cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExtentedCategory, ImageFile } from "@/types"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends ExtentedCategory, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
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

    // function deleteSelectedRows() {
    //     setIsLoading(true)
    //     const selectedRows = table.getFilteredSelectedRowModel().rows;
    //     const ids = selectedRows.map(row => row.original.id);
    //     toast.promise(Promise.all(selectedRows.map(() => deleteCategories(ids))),
    //         {
    //             loading: "Deleting...",
    //             success: () => {
    //                 setRowSelection({})
    //                 setIsLoading(false)
    //                 return "Categories deleted successfully."
    //             },
    //             error: (err: unknown) => {
    //                 setRowSelection({})
    //                 return catchError(err)
    //             },
    //         }
    //     )
    // }

    function checkForProducts() {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const products = selectedRows.filter(row => row.original.productCount > 0);
        if (products.length > 0) {
            setShowWarning(true)
        } else {
            setShowWarning(false)
        }
    }

    return (
        <div className="pb-10">
            <div className="flex mb-6 w-full ">
                <div className={cn("hover:text-primary hover:cursor-pointer transition duration-150 flex gap-2 items-center font-semibold text-sm capitalize px-5 py-2 border-b-2 text-primary/50 border-border", !table.getColumn("status")?.getFilterValue() && "text-cta border-cta hover:text-cta")} onClick={() => table.getColumn("status")?.setFilterValue("")}>
                    <span>All</span>
                    <div className="bg-border h-[18px] text-xs w-[18px] p-1 rounded-md flex items-center justify-center">
                        {data.length}
                    </div>
                </div>
                {Object.values(FeaturedStatus).sort().map(status => (
                    <div key={status} className={cn("hover:text-primary hover:cursor-pointer transition duration-150 flex gap-2 items-center font-semibold text-sm capitalize px-5 py-2 border-b-2 text-primary/50 border-border", table.getColumn("status")?.getFilterValue() === status.toString() && "text-cta border-cta hover:text-cta")} onClick={() => table.getColumn("status")?.setFilterValue(status.toString())}>
                        {status === FeaturedStatus.ACTIVE ? 'Featured' : status === FeaturedStatus.ARCHIVED ? 'Archived' : 'Not Featured'}
                        <div className="bg-border h-[18px] text-xs w-[18px] p-1 rounded-md flex items-center justify-center">
                            {data.filter((category: Category) => category.status === status).length}
                        </div>
                    </div>
                ))}
                <div className="flex-1 border-b-2 border-border flex justify-end">
                    <Button variant="cta" className="mb-4 flex gap-2 items-center">
                        <Plus className="w-4 h-4" />
                        Add Category
                    </Button>
                </div>
            </div>
            <div className="flex mb-6 justify-between">
                <div className="flex gap-8">
                    <div className="relative">
                        <div className="w-80 relative">
                            <Input className="pl-7" placeholder="Search categories..." value={(table.getColumn("name")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)} />
                            <Search className="absolute left-2 top-1/2 transform -translate-y-2/4 h-4 w-4 text-[#A1A1AA]" />
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <Badge
                            className={cn(
                                "opacity-50 pointer-events-none gap-2",
                                table.getFilteredSelectedRowModel().rows.length > 0 &&
                                (table.getFilteredSelectedRowModel().rows.length > 1 || table.getFilteredSelectedRowModel().rows.some((row) => row.original.status !== "ACTIVE")) &&
                                "opacity-100 cursor-pointer"
                            )}
                            variant="outline"
                        >
                            <Star className="fill-orange-500 text-orange-500 w-4 h-4" />
                            <span>Feature</span>
                        </Badge>

                        <Badge className={cn("opacity-50 pointer-events-none gap-2", table.getFilteredSelectedRowModel().rows.length > 1 && "opacity-100 cursor-pointer")} variant="outline">
                            <Merge className="text-blue-500 w-4 h-4" />
                            <span>Merge</span>
                        </Badge>
                        <Badge className={cn("opacity-50 pointer-events-none gap-2", table.getFilteredSelectedRowModel().rows.length > 0 && "opacity-100 cursor-pointer")} variant="outline">
                            <Archive className="text-primary/50 w-4 h-4" />
                            <span>Archive</span>
                        </Badge>

                        <Badge className={cn("opacity-50 pointer-events-none gap-2", table.getFilteredSelectedRowModel().rows.length > 0 && "opacity-100 cursor-pointer")} variant="outline">
                            <Undo2 className="text-green-500 w-4 h-4" />
                            <span>Restore</span>
                        </Badge>
                        <Badge className={cn("opacity-50 pointer-events-none gap-2", table.getFilteredSelectedRowModel().rows.length > 0 && "opacity-100 cursor-pointer")} variant="outline">
                            <Trash2 className="text-red-500 w-4 h-4" />
                            <span className="-mb-px">Delete</span>
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-3">
                    {table.getFilteredSelectedRowModel().rows.length < 1 && (
                        <Suspense fallback={<Button variant="ghost" size="sm" className="border border-border flex gap-2 items-center">
                            <Plus className="w-4 h-4" />
                            New Category
                        </Button>}>
                            <div className="flex items-center">
                                {/* <CreateCategory /> */}
                            </div>
                        </Suspense>
                    )}
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
                                No categories found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <DataTablePagination table={table} />
        </div>
    )
}