"use client";

import KnowledgeGraphEducationPageClient from "./KnowledgeGraphEducationPageClient";

export default function KnowledgeGraphEducationPage() {
	return <KnowledgeGraphEducationPageClient />;
}
import {
	AlertTriangle,
	BookOpen,
	Bookmark,
	Brain,
	Clock,
	Download,
	GraduationCap,
	HelpCircle,
	Info,
	Loader2,
	Moon,
	Network,
	RefreshCw,
	Settings,
	Share2,
	Target,
	TrendingDown,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import GraphDashboard from "../../../components/graph/GraphDashboard";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../../components/ui/tabs";
import { TooltipProvider } from "../../../components/ui/tooltip";

// Import API utilities for data fetching
import { fetchGraphData } from "../../../utils/api";

// Educational content components
import EducationalOverlay from "../../../components/education/EducationalOverlay";
import LearningPath from "../../../components/education/LearningPath";
import ProgressTracker from "../../../components/education/ProgressTracker";

// Educational learning paths
const learningPaths = [
	{
		id: "basics",
		title: "Podstawy suplementacji",
		description: "Poznaj fundamenty suplementacji i ich wpływ na organizm",
		duration: "30 min",
		difficulty: "Początkujący",
		topics: [
			"Czym są suplementy",
			"Biodostępność",
			"Interakcje",
			"Bezpieczeństwo",
		],
	},
	{
		id: "nootropics",
		title: "Nootropiki i funkcje poznawcze",
		description: "Zgłęb świat nootropików i ich wpływ na mózg",
		duration: "45 min",
		difficulty: "Średniozaawansowany",
		topics: [
			"Neurotransmitery",
			"Plastyczność mózgu",
			"Pamięć",
			"Koncentracja",
		],
	},
	{
		id: "advanced",
		title: "Zaawansowane kombinacje",
		description: "Naucz się tworzyć skuteczne stosy suplementów",
		duration: "60 min",
		difficulty: "Zaawansowany",
		topics: ["Synergie", "Timing", "Cyklowanie", "Personalizacja"],
	},
];
