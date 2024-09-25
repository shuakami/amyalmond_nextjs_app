"use client"
import { Github } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import '../styles/globals.css'
import {DashboardIcon} from "@radix-ui/react-icons";

gsap.registerPlugin(ScrollTrigger)

export default function Component() {
    const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 })
    const containerRef = useRef(null)
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        const lenis = new Lenis()

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        const handleMouseMove = (e: { clientX: number; clientY: number }) => {
            setBgPosition({ x: e.clientX / 20, y: e.clientY / 20 })
        }
        window.addEventListener('mousemove', handleMouseMove)

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1.5 }
        )
            .fromTo(titleRef.current,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2 },
                '-=0.5'
            )
            .fromTo(subtitleRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                '-=0.5'
            )
            .fromTo(buttonRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5 },
                '-=0.3'
            )

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="min-h-screen text-white flex flex-col justify-center p-8 md:p-16 relative overflow-hidden bg-animate"
            style={{
                backgroundImage: `linear-gradient(45deg, #c94bdb, #6a0dad, #bc8f8f)`,
                backgroundSize: '400% 400%',
                backgroundPosition: `${bgPosition.x}% ${bgPosition.y}%`,
                transition: 'background-position 0.3s ease-out'
            }}
        >
            <div className="max-w-4xl relative z-10">
                <h1
                    ref={titleRef}
                    className="text-7xl md:text-9xl font-bold mb-6 text-transparent bg-clip-text flowing-text-animate"
                    style={{fontFamily: 'Inter, sans-serif'}}
                >
                    AmyAlmond
                </h1>
                <h2
                    ref={subtitleRef}
                    className="text-3xl md:text-4xl font-semibold leading-snug mb-12 text-transparent bg-clip-text flowing-text-animate"
                    style={{fontFamily: 'Inter, sans-serif'}}
                >
                    AI-powered chats.
                    <br/>
                    Effortless context with AmyAlmond.
                </h2>
                <a
                    ref={buttonRef}
                    href="https://github.com/shuakami/amyalmond_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center px-6 py-3 bg-white/80 text-purple-600 rounded-xl text-lg font-medium transition-all hover:bg-opacity-90 shadow-sm backdrop-filter backdrop-blur-lg"
                >
                    <Github className="w-6 h-6 mr-3"/>
                    Github
                </a>
                <a
                    ref={buttonRef}
                    href="/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 ml-8 inline-flex items-center px-6 py-3 bg-white/80 text-purple-600 rounded-xl text-lg font-medium transition-all hover:bg-opacity-90 shadow-sm backdrop-filter backdrop-blur-lg"
                >
                    <DashboardIcon className="w-6 h-6 mr-3"/>
                    DashBoard
                </a>
            </div>
        </div>
    )
}