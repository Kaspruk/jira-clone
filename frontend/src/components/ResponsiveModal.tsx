import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Drawer, DrawerContent} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export interface ResponsiveModalProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = (props: ResponsiveModalProps) => {
//   const isDesktop = useMedia("(min-width: 1024px)", true);
  const {
    open,
    children,
    className,
    onOpenChange
  } = props;

  const isDesktop = true;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "w-full max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]",
            className
          )}
        >
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
