import { useToast } from "@/components/ui/use-toast"

export const useToaster = () => {
    const { toast } = useToast();

    return toast;
};