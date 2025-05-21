import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { WelcomeAnimationProvider } from "./hooks/use-welcome-animation";
import { queryClient } from "./lib/queryClient";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
	<Router>
		<QueryClientProvider client={queryClient}>
			<WelcomeAnimationProvider>
				<App />
			</WelcomeAnimationProvider>
		</QueryClientProvider>
	</Router>,
);
