"use client"
import { FC } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

interface ExportDataButtonProps {
    data: any;
    name: string;
}

const ExportDataButton: FC<ExportDataButtonProps> = ({ data, name }) => {
    return (
        <Button onClick={() => {
            const columns = Object.keys(data[0]);
            data.unshift(columns);
            const csv = data.map((row: any) => Object.values(row).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${name}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }}
            variant="outline"
            className="flex gap-2 items-center"
        >
            <Download size={16} />
            Export Data
        </Button>
    );
}

export default ExportDataButton;