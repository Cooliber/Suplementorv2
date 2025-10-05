"use client";

import { useEffect, useState } from "react";

interface StatsCounterProps {
	value: number;
	label: string;
	duration?: number;
}

export function StatsCounter({
	value,
	label,
	duration = 2000,
}: StatsCounterProps) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		let startTime: number;
		let animationFrame: number;

		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);

			setCount(Math.floor(progress * value));

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);

		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	}, [value, duration]);

	return (
		<div className="text-center">
			<div className="font-bold text-3xl text-blue-600 dark:text-blue-400">
				{count}+
			</div>
			<div className="text-gray-600 text-sm dark:text-gray-300">{label}</div>
		</div>
	);
}
