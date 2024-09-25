import { useEffect, useState, useRef } from 'react';
import { Space_Grotesk } from 'next/font/google';
import '@/styles/globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function LoadingPage() {
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false); // 用于控制出场动画
    const animationRef = useRef(null);

    useEffect(() => {
        const animationSteps = [
            { target: 5, duration: 100 },
            { target: 20, duration: 400 },
            { target: 40, duration: 200 },
            { target: 80, duration: 500 },
            { target: 90, duration: 100 },
            { target: 100, duration: 120 },
        ];

        let currentStep = 0;
        let startTime: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;

            const { target, duration } = animationSteps[currentStep];
            const prevTarget = currentStep > 0 ? animationSteps[currentStep - 1].target : 0;

            const stepProgress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeInOutCubic(stepProgress);
            const currentProgress = prevTarget + (target - prevTarget) * easedProgress;

            setProgress(currentProgress);

            if (stepProgress < 1) {
                // @ts-ignore
                animationRef.current = requestAnimationFrame(animate);
            } else {
                currentStep++;
                if (currentStep < animationSteps.length) {
                    startTime = timestamp;
                    // @ts-ignore
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    // 出场动画
                    setTimeout(() => setFadeOut(true), 200); // 延迟200ms触发出场动画
                }
            }
        };

        // @ts-ignore
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    return (
        <div
            className={`h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-between py-20 ${spaceGrotesk.className} ${
                fadeOut ? 'opacity-0 transition-opacity duration-200' : 'opacity-100'
            }`}
        >
            <div className="flex-1" />
            <div className="text-center space-y-10 w-full max-w-sm">
                <h1 className="text-3xl tracking-tight text-gray-800 font-semibold">Robot Dashboard</h1>
                <div className="text-lg text-gray-600 tracking-wide font-light">Initializing</div>
                <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
                    />
                </div>
                <div className="text-sm text-gray-500 font-medium">{Math.round(progress)}% Complete</div>
            </div>
            <div className="flex-1" />
            <div className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">ACE</span>
            </div>
        </div>
    );
}
