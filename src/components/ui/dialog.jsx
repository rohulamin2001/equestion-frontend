import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext({ open: false, setOpen: () => {} })

const Dialog = ({ open, onOpenChange, children, ...props }) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen} {...props}>
      <DialogContext.Provider value={{ open: isOpen, setOpen: setIsOpen }}>
        {children}
      </DialogContext.Provider>
    </DialogPrimitive.Root>
  )
}

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = ({ children, ...props }) => {
  const { open } = React.useContext(DialogContext)
  return (
    <DialogPrimitive.Portal forceMount {...props}>
      <AnimatePresence>
        {open && children}
      </AnimatePresence>
    </DialogPrimitive.Portal>
  )
}

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay asChild ref={ref}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  </DialogPrimitive.Overlay>
))
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = React.forwardRef(
  (
    {
      className,
      children,
      showCloseButton = true,
      from = "top",
      transition = { type: "spring", stiffness: 150, damping: 25 },
      onPointerDownOutside,
      onEscapeKeyDown,
      ...props
    },
    ref
  ) => {
    const animationVariants = {
      top: {
        initial: { opacity: 0, y: -40, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -40, scale: 0.95 },
      },
      bottom: {
        initial: { opacity: 0, y: 40, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 40, scale: 0.95 },
      },
      left: {
        initial: { opacity: 0, x: -40, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: -40, scale: 0.95 },
      },
      right: {
        initial: { opacity: 0, x: 40, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: 40, scale: 0.95 },
      },
    }

    const directionVariants = animationVariants[from] || animationVariants.top

    return (
      <DialogPortal>
        <DialogOverlay key="dialog-overlay" />
        <DialogPrimitive.Content 
          key="dialog-content"
          asChild 
          ref={ref}
          onPointerDownOutside={onPointerDownOutside}
          onEscapeKeyDown={onEscapeKeyDown}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={directionVariants.initial}
              animate={directionVariants.animate}
              exit={directionVariants.exit}
              transition={transition}
              className={cn(
                "relative w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-xl focus:outline-none",
                className
              )}
              {...props}
            >
              {children}
              {showCloseButton && (
                <DialogPrimitive.Close asChild>
                  <button className="absolute right-6 top-6 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100">
                    <X className="size-4" />
                    <span className="sr-only">Close</span>
                  </button>
                </DialogPrimitive.Close>
              )}
            </motion.div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left mb-4",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 border-t border-slate-50 pt-4",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-bold text-slate-900 leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

const DialogClose = DialogPrimitive.Close

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
