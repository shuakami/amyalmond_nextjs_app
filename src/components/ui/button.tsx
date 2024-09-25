import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-700 disabled:pointer-events-none disabled:opacity-50", // 将焦点环颜色更改为灰色
    {
        variants: {
            variant: {
                default:
                    " text-white hover:bg-gray-800", // 将默认按钮背景设为黑色，悬停时为深灰色
                destructive:
                    "bg-red-600 text-white shadow-sm hover:bg-red-500", // 保持破坏性操作为红色
                outline:
                    "border shadow-sm hover:bg-gray-100 hover:text-black dark:hover:text-white dark:hover:bg-white/10" , // 修改为灰色边框和白色背景
                secondary:
                    " text-white shadow-sm hover:bg-[#262626]", // 修改为灰色背景和黑色文字
                ghost: "border-none bg-transparent text-inherit p-0 m-0 shadow-none outline-none hover:bg-gray-100 hover:text-black", //
                link: "text-black underline-offset-4 hover:underline", // 修改为黑色文字
            },
            size: {
                default: "h-9 px-4 py-2",
                default1: "h-9 px-5 py-3",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
