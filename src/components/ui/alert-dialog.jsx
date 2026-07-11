import { cn } from "@/lib/utils";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

const AlertDialogContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const AlertDialog = ({ open, onOpenChange, children, ...props }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  return (
    <AlertDialogPrimitive.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      {...props}
    >
      <AlertDialogContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
        {children}
      </AlertDialogContext.Provider>
    </AlertDialogPrimitive.Root>
  );
};

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = ({ children, ...props }) => {
  const { open } = React.useContext(AlertDialogContext);
  return (
    <AlertDialogPrimitive.Portal forceMount {...props}>
      <AnimatePresence>{open && children}</AnimatePresence>
    </AlertDialogPrimitive.Portal>
  );
};

const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay asChild ref={ref}>
    <motion.div
      initial={{ opacity: 0, filter: 'blur(4px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(4px)' }}
      transition={{ duration: 0.12, ease: 'easeInOut' }}
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  </AlertDialogPrimitive.Overlay>
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

const AlertDialogPopup = React.forwardRef(
  (
    {
      className,
      children,
      from = "top",
      transition = { type: "spring", stiffness: 300, damping: 28 },
      ...props
    },
    ref,
  ) => {
    const animationVariants = {
      top: {
        initial: { opacity: 0, y: -24, scale: 0.95, filter: 'blur(4px)' },
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -24, scale: 0.95, filter: 'blur(4px)' },
      },
      bottom: {
        initial: { opacity: 0, y: 24, scale: 0.95, filter: 'blur(4px)' },
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, y: 24, scale: 0.95, filter: 'blur(4px)' },
      },
      left: {
        initial: { opacity: 0, x: -24, scale: 0.95, filter: 'blur(4px)' },
        animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, x: -24, scale: 0.95, filter: 'blur(4px)' },
      },
      right: {
        initial: { opacity: 0, x: 24, scale: 0.95, filter: 'blur(4px)' },
        animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, x: 24, scale: 0.95, filter: 'blur(4px)' },
      },
    };

    const directionVariants = animationVariants[from] || animationVariants.top;

    return (
      <AlertDialogPortal>
        <AlertDialogOverlay key="alert-dialog-overlay" />
        <AlertDialogPrimitive.Content
          key="alert-dialog-content"
          asChild
          ref={ref}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={directionVariants.initial}
              animate={directionVariants.animate}
              exit={directionVariants.exit}
              transition={transition}
              className={cn(
                "relative w-full max-w-md rounded-2xl border border-slate-200/50 bg-glass-elevated backdrop-blur-xl p-6 shadow-2xl focus:outline-none overflow-visible",
                className,
              )}
              {...props}
            >
              {children}
            </motion.div>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPortal>
    );
  },
);
AlertDialogPopup.displayName = "AlertDialogPopup";

const AlertDialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left mb-4",
      className,
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 border-t border-slate-50 pt-4",
      className,
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-bold text-slate-900 leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-slate-500", className)}
      {...props}
    />
  ),
);
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:bg-red-800 transition-all cursor-pointer",
      className,
    )}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-100 active:bg-slate-100 transition-all cursor-pointer sm:mt-0 mt-2",
      className,
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
