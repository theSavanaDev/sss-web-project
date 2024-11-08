import { ReactNode } from "react";
import { Comfortaa as FontHeader, Montserrat as FontBody } from "next/font/google";

import { cn } from "@/lib/utils";

import { FooterBlock } from "@/payload/blocks/globals/footer/component";
import { HeaderBlock } from "@/payload/blocks/globals/header/component";
import { ThemeProvider } from "@/components/theme-provider";

import "@/frontend/global.css";

const fontHeader = FontHeader({ subsets: ["latin"], variable: "--font-header" });
const fontBody = FontBody({ subsets: ["latin"], variable: "--font-body" });

const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn("flex h-screen flex-col font-body antialiased", fontHeader.variable, fontBody.variable)}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<header>
						<HeaderBlock />
					</header>

					<main>{children}</main>

					<footer className="mt-auto">
						<FooterBlock />
					</footer>
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
