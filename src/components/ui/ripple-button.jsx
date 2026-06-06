import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const RippleButtonContext = React.createContext(null)

const RippleButton = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      hoverScale = 1.05,
      tapScale = 0.95,
      onPointerDown,
      children,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState([])

    const addRipple = React.useCallback((ripple) => {
      setRipples((prev) => [...prev, ripple])
    }, [])

    const removeRipple = React.useCallback((id) => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, [])

    const handlePointerDown = (event) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const w = rect.width
      const h = rect.height
      const diameter = Math.max(
        Math.sqrt(x * x + y * y),
        Math.sqrt((w - x) * (w - x) + y * y),
        Math.sqrt(x * x + (h - y) * (h - y)),
        Math.sqrt((w - x) * (w - x) + (h - y) * (h - y))
      ) * 2

      addRipple({
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        size: diameter,
      })

      if (onPointerDown) {
        onPointerDown(event)
      }
    }

    return (
      <RippleButtonContext.Provider value={{ ripples, removeRipple }}>
        <motion.button
          ref={ref}
          onPointerDown={handlePointerDown}
          whileHover={{ scale: hoverScale }}
          whileTap={{ scale: tapScale }}
          className={cn(
            buttonVariants({ variant, size }),
            "relative overflow-hidden cursor-pointer select-none",
            className
          )}
          {...props}
        >
          {children}
        </motion.button>
      </RippleButtonContext.Provider>
    )
  }
)
RippleButton.displayName = "RippleButton"

const RippleButtonRipples = ({
  color = "var(--ripple-button-ripple-color, rgba(255, 255, 255, 0.35))",
  scale = 10,
  transition = { duration: 0.6, ease: "easeOut" },
  className,
  ...props
}) => {
  const context = React.useContext(RippleButtonContext)
  if (!context) {
    throw new Error("RippleButtonRipples must be used within RippleButton")
  }

  const { ripples, removeRipple } = context

  return (
    <span className="absolute inset-0 block pointer-events-none overflow-hidden rounded-[inherit]">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: ripple.size * (scale / 10), opacity: 0 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => removeRipple(ripple.id)}
            transition={transition}
            style={{
              position: "absolute",
              top: ripple.y,
              left: ripple.x,
              width: 1,
              height: 1,
              borderRadius: "50%",
              backgroundColor: color,
            }}
            className={cn("pointer-events-none", className)}
            {...props}
          />
        ))}
      </AnimatePresence>
    </span>
  )
}
RippleButtonRipples.displayName = "RippleButtonRipples"

export { RippleButton, RippleButtonRipples }
