"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CustomPopoverProps {
    trigger: React.ReactNode
    children: React.ReactNode
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'default' | 'bottom-left'
    offset?: number
    animationDuration?: number
    className?: string
}

export default function CustomPopover({
    trigger,
    children,
    placement = 'bottom',
    offset = 0,
    animationDuration = 0.1,
    className = '',
}: CustomPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const triggerRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const getPopoverStyles = () => {
        switch (placement) {
            case 'top':
                return { top: `-${offset}px`, left: '50%', transform: 'translateX(-50%)' }
            case 'bottom':
                return { bottom: `-${offset}px`, left: '50%', transform: 'translateX(-50%)' }
            case 'left':
                return { left: `-${offset}px`, top: '50%', transform: 'translateY(-50%)' }
            case 'right':
                return { top: `-${offset}px`, left: '100%', transform: 'translateY(-50%)' }
            case 'default':
                return { bottom: '0%', left: 0, transformOrigin: 'left bottom' }
            case 'bottom-left':
                return { top: '0%', right: '0%', transformOrigin: 'left bottom' }
        }
    }

    const getPopoverEnterAnimation = () => {
        switch (placement) {
            case 'top':
                return { y: [-10, 0], opacity: [0, 1] }
            case 'bottom':
                return { y: [10, 0], opacity: [0, 1] }
            case 'left':
                return { x: [-10, 0], opacity: [0, 1] }
            case 'right':
                return { x: [10, 0], opacity: [0, 1] }
            case 'default':
                return { opacity: [0, 1], transformOrigin: 'left bottom', scale: [0.5, 1] }
            case 'bottom-left':
                return { opacity: [0, 1], transformOrigin: 'right top', scale: [0.5, 1] }
        }
    }

    const getPopoverExitAnimation = () => {
        switch (placement) {
            case 'top':
                return { y: 10, opacity: 0 }
            case 'bottom':
                return { y: -10, opacity: 0 }
            case 'left':
                return { x: 10, opacity: 0 }
            case 'right':
                return { x: -10, opacity: 0 }
            case 'default':
                return { opacity: 0, transformOrigin: 'left bottom', scale: 0.5 }
            case 'bottom-left':
                return { opacity: 0, transformOrigin: 'right top', scale: 0.5 }
        }
    }

    return (
        <div className="relative inline-block">
            <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={popoverRef}
                        className={`absolute ${className}`}
                        style={getPopoverStyles()}
                        initial={{ opacity: 0 }}
                        animate={getPopoverEnterAnimation()}
                        exit={getPopoverExitAnimation()}
                        transition={{ duration: animationDuration, ease: 'easeInOut' }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}