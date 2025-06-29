import { useMediaQuery } from "react-responsive";
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
  const {
    open,
    children,
    className,
    onOpenChange
  } = props;

  const isMobile = useMediaQuery({ maxWidth: 768 });

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div 
            className={cn(
              "w-full max-w-lg p-0 flex-1 border-none overflow-y-auto hide-scrollbar max-h-[85vh]",
              className
            )}
          >
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-full max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]",
          className
        )}
        aria-describedby="modal-description"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};
