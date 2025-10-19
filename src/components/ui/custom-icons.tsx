import type * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
	size?: number;
}

export const BacteriaIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		{/* Bacteria cell body */}
		<ellipse cx="12" cy="12" rx="8" ry="5" fill="currentColor" opacity="0.2" />
		<ellipse cx="12" cy="12" rx="8" ry="5" fill="none" stroke="currentColor" />

		{/* Flagella (whip-like structures) */}
		<path d="M4 12c0-2 2-4 4-4" stroke="currentColor" strokeWidth="1.5" />
		<path d="M20 12c0-2-2-4-4-4" stroke="currentColor" strokeWidth="1.5" />
		<path d="M12 7c-2 0-4-2-4-4" stroke="currentColor" strokeWidth="1.5" />
		<path d="M12 17c-2 0-4 2-4 4" stroke="currentColor" strokeWidth="1.5" />

		{/* Pili (hair-like structures) */}
		<line x1="8" y1="9" x2="6" y2="7" stroke="currentColor" strokeWidth="1" />
		<line x1="16" y1="9" x2="18" y2="7" stroke="currentColor" strokeWidth="1" />
		<line x1="8" y1="15" x2="6" y2="17" stroke="currentColor" strokeWidth="1" />
		<line
			x1="16"
			y1="15"
			x2="18"
			y2="17"
			stroke="currentColor"
			strokeWidth="1"
		/>
	</svg>
);

export const HormoneIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		{/* Hormone molecule structure */}
		<circle cx="12" cy="12" r="3" fill="currentColor" />

		{/* Bonds to other atoms */}
		<line x1="12" y1="9" x2="12" y2="6" stroke="currentColor" />
		<line x1="15" y1="12" x2="18" y2="12" stroke="currentColor" />
		<line x1="12" y1="15" x2="12" y2="18" stroke="currentColor" />
		<line x1="9" y1="12" x2="6" y2="12" stroke="currentColor" />

		{/* Connected atoms */}
		<circle cx="12" cy="4.5" r="1.5" fill="currentColor" opacity="0.7" />
		<circle cx="19.5" cy="12" r="1.5" fill="currentColor" opacity="0.7" />
		<circle cx="12" cy="19.5" r="1.5" fill="currentColor" opacity="0.7" />
		<circle cx="4.5" cy="12" r="1.5" fill="currentColor" opacity="0.7" />

		{/* Functional groups */}
		<path d="M12 4.5c0-1.5-1-2.5-2-2.5" stroke="currentColor" strokeWidth="1" />
		<path
			d="M19.5 12c1.5 0 2.5-1 2.5-2"
			stroke="currentColor"
			strokeWidth="1"
		/>
	</svg>
);

export const VibrationIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		{/* Phone body */}
		<rect
			x="5"
			y="4"
			width="14"
			height="16"
			rx="2"
			fill="none"
			stroke="currentColor"
		/>

		{/* Screen */}
		<rect
			x="7"
			y="6"
			width="10"
			height="10"
			rx="1"
			fill="currentColor"
			opacity="0.1"
		/>

		{/* Vibration waves */}
		<path d="M3 8c0-1 1-2 2-2" stroke="currentColor" strokeWidth="1.5" />
		<path d="M21 8c0-1-1-2-2-2" stroke="currentColor" strokeWidth="1.5" />
		<path d="M3 12c0-1 1-2 2-2" stroke="currentColor" strokeWidth="1.5" />
		<path d="M21 12c0-1-1-2-2-2" stroke="currentColor" strokeWidth="1.5" />
		<path d="M3 16c0-1 1-2 2-2" stroke="currentColor" strokeWidth="1.5" />
		<path d="M21 16c0-1-1-2-2-2" stroke="currentColor" strokeWidth="1.5" />

		{/* Speaker hole */}
		<circle cx="12" cy="17" r="0.5" fill="currentColor" />
	</svg>
);

export const WheelchairIcon: React.FC<IconProps> = ({
	size = 24,
	...props
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		{/* Wheelchair frame */}
		<circle cx="12" cy="16" r="5" fill="none" stroke="currentColor" />
		<circle cx="12" cy="16" r="2" fill="none" stroke="currentColor" />

		{/* Wheel spokes */}
		<line
			x1="12"
			y1="14"
			x2="12"
			y2="18"
			stroke="currentColor"
			strokeWidth="1"
		/>
		<line
			x1="10"
			y1="16"
			x2="14"
			y2="16"
			stroke="currentColor"
			strokeWidth="1"
		/>
		<line
			x1="11"
			y1="14.5"
			x2="13"
			y2="17.5"
			stroke="currentColor"
			strokeWidth="1"
		/>
		<line
			x1="13"
			y1="14.5"
			x2="11"
			y2="17.5"
			stroke="currentColor"
			strokeWidth="1"
		/>

		{/* Seat and backrest */}
		<rect x="9" y="10" width="6" height="2" fill="none" stroke="currentColor" />
		<rect x="13" y="8" width="2" height="4" fill="none" stroke="currentColor" />

		{/* Push handles */}
		<line x1="15" y1="8" x2="17" y2="6" stroke="currentColor" />
		<line x1="15" y1="12" x2="17" y2="10" stroke="currentColor" />

		{/* Footrests */}
		<line x1="9" y1="18" x2="7" y2="20" stroke="currentColor" />
		<line x1="15" y1="18" x2="17" y2="20" stroke="currentColor" />
	</svg>
);

// Export all custom icons
export default {
	BacteriaIcon,
	HormoneIcon,
	VibrationIcon,
	WheelchairIcon,
};
