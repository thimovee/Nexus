import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
import { Table } from "@tanstack/react-table"
import { Button } from "./button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="w-full flex mt-4 justify-between">
            <div className="text-sm">
                {Object.keys(table.getState().rowSelection).length} of{' '}
                {table.getPreFilteredRowModel().rows.length} Total Rows Selected
            </div>
            <div className="flex gap-20">
                <div className="flex gap-2 items-center">
                    <span className="text-sm font-medium">Rows per page</span>
                    <Select onValueChange={(value) => { table.setPageSize(Number(value)) }}>
                        <SelectTrigger className="max-w-fit">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {[10, 20, 30, 40, 50].map(pageSize => (
                                    <SelectItem key={pageSize} value={String(pageSize)}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="font-medium text-sm">Page {table.getState().pagination.pageIndex + 1} of
                        {" "} {table.getPageCount()}
                    </span>
                    <div className="flex gap-1.5">
                        <Button size="sm" variant="ghost" className="border border-border" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} >
                            <ChevronsLeft className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="border border-border" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="border border-border" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="border border-border " onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                            <ChevronsRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}