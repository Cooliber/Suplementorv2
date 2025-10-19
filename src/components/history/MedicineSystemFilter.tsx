"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export type MedicineSystem =
	| "TCM"
	| "AYURVEDA"
	| "GREEK_ROMAN"
	| "EUROPEAN_HERBALISM"
	| "MODERN_SCIENCE"
	| "OTHER";

export function MedicineSystemFilter({
	value,
	onChange,
}: {
	value?: MedicineSystem | "ALL";
	onChange: (v: MedicineSystem | "ALL") => void;
}) {
	return (
		<div className="flex items-center gap-2">
			<label className="text-muted-foreground text-sm">System medyczny:</label>
			<Select value={value ?? "ALL"} onValueChange={(v) => onChange(v as any)}>
				<SelectTrigger className="w-52">
					<SelectValue placeholder="Wybierz system" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ALL">Wszystkie</SelectItem>
					<SelectItem value="TCM">TCM</SelectItem>
					<SelectItem value="AYURVEDA">Ajurweda</SelectItem>
					<SelectItem value="GREEK_ROMAN">Grecko-Rzymski</SelectItem>
					<SelectItem value="EUROPEAN_HERBALISM">
						Zielarstwo Europejskie
					</SelectItem>
					<SelectItem value="MODERN_SCIENCE">Nowoczesna Nauka</SelectItem>
					<SelectItem value="OTHER">Inne</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
