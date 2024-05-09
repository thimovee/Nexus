import * as React from "react"
import Image from "next/image"
import type { FileWithPreview } from "@/types"
import Cropper, { type ReactCropperElement } from "react-cropper"
import { useDropzone, type Accept, type FileRejection, type FileWithPath } from "react-dropzone"
import type { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Trash, Upload, Crop, TimerReset } from "lucide-react"
import { Input } from "./ui/input"
import "cropperjs/dist/cropper.css"

interface FileDialogProps<TFieldValues extends FieldValues>
    extends React.HTMLAttributes<HTMLDivElement> {
    name: Path<TFieldValues>
    setValue: UseFormSetValue<TFieldValues>
    accept?: Accept
    maxSize?: number
    maxFiles?: number
    files: FileWithPreview[] | null
    setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>
    isUploading?: boolean
    disabled?: boolean
}

export function FileDialog<TFieldValues extends FieldValues>({
    name,
    setValue,
    accept = {
        "image/*": [],
    },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    files,
    setFiles,
    isUploading = false,
    disabled = false,
    className,
    ...props
}: FileDialogProps<TFieldValues>) {
    const onDrop = React.useCallback(
        (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
            setValue(
                name,
                acceptedFiles as PathValue<TFieldValues, Path<TFieldValues>>,
                {
                    shouldValidate: true,
                }
            )

            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            )

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ errors }) => {
                    if (errors[0]?.code === "file-too-large") {
                        toast.error(
                            `File is too large. Max size is ${maxSize / 1024 / 1024}MB`
                        )
                        return
                    }
                    errors[0]?.message && toast.error(errors[0].message)
                })
            }
        },

        [maxSize, name, setFiles, setValue]
    )

    React.useEffect(() => {
        setValue(name, files as PathValue<TFieldValues, Path<TFieldValues>>)
    }, [files, name, setValue])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles,
        multiple: maxFiles > 1,
        disabled,
    })

    React.useEffect(() => {
        return () => {
            if (!files) return
            files.forEach((file) => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="bg-popover h-20 flex items-center" disabled={disabled}>
                    <Upload className="w-5 h-5 mr-2" />Upload Image{maxFiles === 1 ? null : `'s`}
                    <span className="sr-only">Upload Images</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <p className="absolute left-5 top-4 font-medium text-primary">
                    Upload Your Image{maxFiles === 1 ? null : `'s`}
                </p>
                <div
                    {...getRootProps()}
                    className={cn(
                        "group relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
                        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isDragActive && "border-muted-foreground/50",
                        disabled && "pointer-events-none opacity-60",
                        className
                    )}
                    {...props}
                >
                    <Input {...getInputProps()} />
                    {isUploading ? (
                        <div className="group grid w-full place-items-center gap-1 sm:px-10">
                            <Upload
                                className="h-9 w-9 animate-pulse text-muted-foreground"
                                aria-hidden="true"
                            />
                        </div>
                    ) : isDragActive ? (
                        <div className="grid place-items-center gap-2 text-muted-foreground sm:px-5">
                            <Upload
                                className={cn("h-8 w-8", isDragActive && "animate-bounce")}
                                aria-hidden="true"
                            />
                            <p className="text-base font-medium">Drop the file here</p>
                        </div>
                    ) : (
                        <div className="grid place-items-center gap-1 sm:px-5">
                            <Upload
                                className="h-8 w-8 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <p className="mt-2 text-base font-medium text-muted-foreground">
                                Drag {`'n'`} drop file here, or click to select file
                            </p>
                            <p className="text-sm text-slate-500">
                                Please upload file with size less than {maxSize / 1024 / 1024}MB
                            </p>
                        </div>
                    )}
                </div>
                <p className="text-center text-sm font-medium text-muted-foreground">
                    You can upload up to {maxFiles} {maxFiles === 1 ? "file" : "files"}
                </p>
                {files?.length ? (
                    <div className="grid gap-5">
                        {files?.map((file, i) => (
                            <FileCard
                                key={i}
                                i={i}
                                name={name}
                                setValue={setValue}
                                files={files}
                                setFiles={setFiles}
                                file={file}
                            />
                        ))}
                    </div>
                ) : null}
                {files?.length ? (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2.5 w-full items-center"
                        onClick={() => {
                            setFiles(null)
                            setValue(
                                name,
                                null as PathValue<TFieldValues, Path<TFieldValues>>,
                                {
                                    shouldValidate: true,
                                }
                            )
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" aria-hidden="true" />
                        Remove All
                        <span className="sr-only">Remove All</span>
                    </Button>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

interface FileCardProps<TFieldValues extends FieldValues> {
    i: number
    file: FileWithPreview
    name: Path<TFieldValues>
    setValue: UseFormSetValue<TFieldValues>
    files: FileWithPreview[] | null
    setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>
}

function FileCard<TFieldValues extends FieldValues>({
    i,
    file,
    name,
    setValue,
    files,
    setFiles,
}: FileCardProps<TFieldValues>) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [cropData, setCropData] = React.useState<string | null>(null)
    const cropperRef = React.useRef<ReactCropperElement>(null)

    const onCrop = React.useCallback(() => {
        if (!files || !cropperRef.current) return

        const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas()
        setCropData(croppedCanvas.toDataURL())

        croppedCanvas.toBlob((blob) => {
            if (!blob) {
                console.error("Blob creation failed")
                return
            }
            const croppedImage = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
            })

            const croppedFileWithPathAndPreview = Object.assign(croppedImage, {
                preview: URL.createObjectURL(croppedImage),
                path: file.name,
            }) satisfies FileWithPreview

            const newFiles = files.map((file, j) =>
                j === i ? croppedFileWithPathAndPreview : file
            )
            setFiles(newFiles)
        })
    }, [file.name, file.type, files, i, setFiles])

    React.useEffect(() => {
        function handleKeydown(e: KeyboardEvent) {
            if (e.key === "Enter") {
                onCrop()
                setIsOpen(false)
            }
        }
        document.addEventListener("keydown", handleKeydown)
        return () => document.removeEventListener("keydown", handleKeydown)
    }, [onCrop])

    return (
        <div className="relative flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
                <div className="border border-border rounded-md min-w-10 min-h-10 w-10 h-10 relative">
                    <Image
                        src={cropData ? cropData : file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover shrink-0 rounded-md"
                        fill
                        loading="lazy"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
                        {file.name}
                    </p>
                    <p className="text-xs text-primary/50">
                        {(file.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {file.type.startsWith("image") && (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0 items-center"
                            >
                                <Crop className="h-4 w-4" aria-hidden="true" />
                                <span className="sr-only">Crop image</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <p className="absolute left-5 top-4 text-base font-medium text-muted-foreground">
                                Crop image
                            </p>
                            <div className="mt-8 grid place-items-center space-y-5">
                                <Cropper
                                    ref={cropperRef}
                                    zoomTo={0.5}
                                    initialAspectRatio={1 / 1}
                                    preview=".img-preview"
                                    src={file.preview}
                                    viewMode={1}
                                    minCropBoxHeight={10}
                                    minCropBoxWidth={10}
                                    background={false}
                                    responsive={true}
                                    autoCropArea={1}
                                    checkOrientation={false}
                                    guides={true}
                                />
                                <div className="flex items-center justify-center space-x-2">
                                    <Button
                                        aria-label="Crop image"
                                        type="button"
                                        className="h-8 items-center bg-slate-900 text-slate-100 border-slate-600 border"
                                        onClick={() => {
                                            onCrop()
                                            setIsOpen(false)
                                        }}
                                    >
                                        <Crop
                                            className="mr-2 h-3.5 w-3.5"
                                            aria-hidden="true"
                                        />
                                        Crop Image
                                    </Button>
                                    <Button
                                        aria-label="Reset crop"
                                        type="button"
                                        className="h-8 items-center bg-slate-900 text-slate-100 border-slate-600 border"
                                        onClick={() => {
                                            cropperRef.current?.cropper.reset()
                                            setCropData(null)
                                        }}
                                    >
                                        <TimerReset
                                            className="mr-2 h-3.5 w-3.5"
                                            aria-hidden="true"
                                        />
                                        Reset Crop
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                        if (!files) return
                        setFiles(files.filter((_, j) => j !== i))
                    }}
                >

                    <Trash className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="sr-only">Remove file</span>
                </Button>
            </div>
        </div>
    )
}