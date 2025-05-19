import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import {
	DayPickerProvider,
	NavigationProvider,
	DayPickerProps,
} from "react-day-picker";
import { WelcomeAnimationProvider } from "./hooks/use-welcome-animation";
import { queryClient } from "./lib/queryClient";

const dayPickerConfig: DayPickerProps = {
	mode: "single",
	selected: new Date(),
	onSelect: (date) => console.log(date),
};

createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<DayPickerProvider initialProps={dayPickerConfig}>
			<NavigationProvider>
				<WelcomeAnimationProvider>
					<App />
				</WelcomeAnimationProvider>
			</NavigationProvider>
		</DayPickerProvider>
	</QueryClientProvider>
);
