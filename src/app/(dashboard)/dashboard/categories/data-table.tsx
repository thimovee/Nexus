"use client"
import { ColumnDef, ColumnFiltersState, getFilteredRowModel, VisibilityState, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, SortingState, getSortedRowModel, } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button, buttonVariants } from "@/components/ui/button"
import React, { Suspense } from "react"
import { Archive, Filter, LucideAlertTriangle, Merge, Plus, Search, SlidersHorizontal, Star, StarOff, Trash, Trash2, TriangleAlert, Undo, Undo2, X } from "lucide-react"
import { Category, FeaturedStatus } from "@prisma/client";
// import { deleteCategories } from "@/app/_actions/category";
import { toast } from "sonner";
import Image from "next/image";
// import { CreateCategory } from "@/components/forms/CreateCategory"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DataTablePagination } from "@/components/ui/PaginationControls"
import { catchError, cn } from "@/lib/utils"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExtentedCategory, ImageFile } from "@/types"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { changeCategoriesStatus, deleteCategories, undoDeleteCategories } from "@/app/_actions/category"
import Link from "next/link"
import { useToaster } from "@/hooks/useToaster"
import ExportDataButton from "@/components/ExportDataButton"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends ExtentedCategory, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
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

    async function featureSelectedRows() {
        try {
            setIsLoading(true)
            const selectedRows = table.getFilteredSelectedRowModel().rows;
            const rowsToFeature = selectedRows.filter(row => row.original.status !== "ACTIVE");
            const ids = rowsToFeature.map(row => row.original.id);
            await changeCategoriesStatus(ids, "ACTIVE")
            setIsLoading(false)
            setRowSelection({})
        } catch (err) {
            catchError(err)
        }
    }

    async function archiveSelectedRows() {
        try {
            setIsLoading(true)
            const selectedRows = table.getFilteredSelectedRowModel().rows;
            const rowsToArchive = selectedRows.filter(row => row.original.status !== "ARCHIVED");
            const ids = rowsToArchive.map(row => row.original.id);
            await changeCategoriesStatus(ids, "ARCHIVED")
            setIsLoading(false)
            setRowSelection({})
        } catch (err) {
            catchError(err)
        }
    }

    async function unfeatureSelectedRows() {
        try {
            setIsLoading(true)
            const selectedRows = table.getFilteredSelectedRowModel().rows;
            const rowsToUnfeature = selectedRows.filter(row => row.original.status !== "NOT_FEATURED");
            const ids = rowsToUnfeature.map(row => row.original.id);
            await changeCategoriesStatus(ids, "NOT_FEATURED")
            setIsLoading(false)
            setRowSelection({})
        } catch (err) {
            catchError(err)
        }
    }

    // async function mergeCategories() {
    //     try {
    //         setIsLoading(true)
    //         const selectedRows = table.getFilteredSelectedRowModel().rows;
    //         const ids = selectedRows.map(row => row.original.id);
    //         await mergeCategories(ids)
    //         setIsLoading(false)
    //         setRowSelection({})
    //     } catch (err) {
    //         catchError(err)
    //     }
    // }

    function deleteCategory() {
        const categories = table.getFilteredSelectedRowModel().rows;
        const hasLinkedProducts = categories.some(category => category.original.productCount > 0);
        const isFeatured = categories.some(category => category.original.status === "ACTIVE");


        if (isFeatured) {
            toast({
                title: "Cannot delete a featured category",
                variant: "warning",
                icon: <TriangleAlert className="h-4 w-4" />,
                duration: 5000,
                size: "icon"
            })
            return
        } else if (hasLinkedProducts) {
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

    function checkForProducts() {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const products = selectedRows.filter(row => row.original.productCount > 0);
        if (products.length > 0) {
            setShowWarning(true)
        } else {
            setShowWarning(false)
        }
    }

    function undoDeletion(rowIds: number[]) {
        undoDeleteCategories(rowIds);
        toast({
            title: "Category deletion undone",
            variant: "success",
            duration: 3000,
            icon: <Undo className="h-4 w-4" />,
        });
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
                    <div className="flex gap-2 items-center mb-4">
                        <ExportDataButton data={data} name="categories" />
                        <Link href="/dashboard/categories/new" className={cn(buttonVariants({ variant: "cta" }), "flex gap-2 items-center")}>
                            <Plus className="w-4 h-4" />
                            Add Category
                        </Link>
                    </div>
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
                        <Badge variant="outline" onClick={featureSelectedRows} className={cn("opacity-50 pointer-events-none gap-2", table.getFilteredSelectedRowModel().rows.length > 0 && (table.getFilteredSelectedRowModel().rows.length > 1 || table.getFilteredSelectedRowModel().rows.some((row) => row.original.status !== "ACTIVE")) && "opacity-100 cursor-pointer pointer-events-auto")} >
                            <Star className="fill-orange-500 text-orange-500 w-4 h-4" />
                            <span>Feature</span>
                        </Badge>
                        <Badge variant="outline" onClick={unfeatureSelectedRows} className={cn("opacity-50 pointer-events-none gap-2", table.getFilteredSelectedRowModel().rows.length > 0 && (table.getFilteredSelectedRowModel().rows.length > 1 || table.getFilteredSelectedRowModel().rows.some((row) => row.original.status !== "NOT_FEATURED")) && "opacity-100 cursor-pointer pointer-events-auto")} >
                            <StarOff className="fill-red-500 text-red-500 w-4 h-4" />
                            <span>Unfeature</span>
                        </Badge>
                        <Badge variant="outline" onClick={archiveSelectedRows} className={cn("opacity-50 pointer-events-none gap-2", table.getFilteredSelectedRowModel().rows.length > 0 && "opacity-100 cursor-pointer pointer-events-auto", badgeVariants({ variant: "outline" }))}>
                            <Archive className="w-4 h-4" />
                            <span>Archive</span>
                        </Badge>
                        <Badge variant="outline" className={cn("opacity-50 pointer-events-none gap-2", table.getFilteredSelectedRowModel().rows.length > 1 && "opacity-100 cursor-pointerpointer-events-auto")}>
                            <Merge className="w-4 h-4" />
                            <span>Merge</span>
                        </Badge>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <Badge onClick={() => deleteCategory()} className={cn("opacity-50 pointer-events-none gap-2", table.getFilteredSelectedRowModel().rows.length > 0 && "opacity-100 cursor-pointer pointer-events-auto")} variant="outline">
                                <Trash2 className="text-red-500 w-4 h-4" />
                                <span className="-mb-px">Delete</span>
                            </Badge>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirm Category Deletion.</DialogTitle>
                                    <DialogDescription asChild>
                                        <div className="flex flex-col gap-10">
                                            <p>You are about to delete the following categor{table.getFilteredSelectedRowModel().rows.length > 1 ? "ies" : "y"} </p>
                                            <div className="bg-gray-50 border border-border p-3 rounded-md flex flex-col gap-3">
                                                {table.getFilteredSelectedRowModel().rows.map((row) => (
                                                    <div key={row.original.id} className="border-b pb-3 border-border last:border-none relative h-16 w-full flex gap-6 items-center">
                                                        {row.original.thumbnail && row.original.thumbnail[0] && (
                                                            <div className="relative h-full w-1/4">
                                                                {/* @ts-ignore */}
                                                                <Image src={row.original.thumbnail[0].url} alt={row.original.name} fill className="shadow h-full w-full object-cover rounded-md" />
                                                            </div>
                                                        )}
                                                        <p className="mt-auto font-semibold text-lg">{row.original.name}</p>
                                                        <Badge className="ml-auto mb-auto !text-xs !rounded-md" variant={row.original.status === 'ACTIVE' ? 'success' : row.original.status === 'NOT_FEATURED' ? 'destructive' : 'archived'}>
                                                            {row.original.status === 'ACTIVE' ? 'Featured' : row.original.status === 'NOT_FEATURED' ? 'Not Featured' : 'Archived'}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                            <p>
                                                Are you sure you want to delete these categories?
                                            </p>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="w-full grid grid-cols-2 gap-3">
                                    <DialogClose asChild>
                                        <Button size="md" variant="subtle">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        size="md"
                                        variant="destructive"
                                        onClick={() => {
                                            const rowIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
                                            deleteCategories(rowIds)
                                                .then(() => {
                                                    toast({
                                                        title: "Categories deleted",
                                                        description: "Category has been deleted successfully",
                                                        action: (
                                                            <div
                                                                onClick={() => undoDeletion(rowIds)}
                                                                className="translate-x-4 border border-red-500 text-sm text-background font-semibold bg-red-500 rounded-md px-2 py-1">
                                                                Undo
                                                            </div>
                                                        ),
                                                        duration: 10000,
                                                        size: "icon"
                                                    });
                                                    setRowSelection({})
                                                })
                                                .catch((error) => {
                                                    toast({
                                                        title: "Error deleting category",
                                                        description: error.message,
                                                        variant: "warning",
                                                        icon: <TriangleAlert className="h-4 w-4" />,
                                                        duration: 5000,
                                                        size: "icon"
                                                    });
                                                });
                                            setIsDialogOpen(false);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
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