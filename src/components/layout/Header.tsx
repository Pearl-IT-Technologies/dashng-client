import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
	ShoppingBag,
	Heart,
	Search,
	User,
	Menu,
	ChevronDown,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import Container from "@/components/ui/Container";
import { useCart } from "@/hooks/use-cart";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import dashLogo from "@/assets/dash-logo-new.png";

const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [womenSubmenuOpen, setWomenSubmenuOpen] = useState(false);
	const [menSubmenuOpen, setMenSubmenuOpen] = useState(false);
	const [location] = useLocation();
	const { user, logoutMutation } = useAuth();

	// Using the combined cart hook for both guest and authenticated users
	const { cartItems, itemCount, isGuest } = useCart();

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const toggleWomenSubmenu = () => {
		setWomenSubmenuOpen(!womenSubmenuOpen);
	};

	const toggleMenSubmenu = () => {
		setMenSubmenuOpen(!menSubmenuOpen);
	};

	const [searchQuery, setSearchQuery] = useState("");
	const [searchOpen, setSearchOpen] = useState(false);

	const navLinks = [
		{ href: "/", label: "Home", exact: true },
		{
			href: "/women",
			label: "Women",
			isDropdown: true,
			subItems: [
				{ href: "/women/clothing", label: "Clothing" },
				{ href: "/women/bags", label: "Bags" },
				{ href: "/women/jewelry", label: "Jewelry" },
				{ href: "/women/accessories", label: "Accessories" },
			],
		},
		{
			href: "/men",
			label: "Men",
			isDropdown: true,
			subItems: [
				{ href: "/men/clothing", label: "Clothing" },
				{ href: "/men/bags", label: "Bags" },
				{ href: "/men/jewelry", label: "Jewelry" },
				{ href: "/men/accessories", label: "Accessories" },
			],
		},
		{ href: "/brands", label: "Brands" },
		{ href: "/new-arrivals", label: "New Arrivals" },
		{ href: "/sale", label: "Sale" },
	];

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/products?search=${encodeURIComponent(
				searchQuery.trim()
			)}`;
			setSearchOpen(false);
		}
	};

	const isActiveLink = (path: string, exact: boolean = false) => {
		if (exact) return location === path;
		return location.startsWith(path);
	};

	return (
		<header className="bg-white shadow-sm sticky top-0 z-50">
			<Container>
				<div className="py-2 flex items-center justify-between">
					{/* Mobile Menu Toggle */}
					<div className="lg:hidden">
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleMobileMenu}
							aria-label="Toggle navigation menu"
						>
							<Menu className="h-5 w-5" />
						</Button>
					</div>

					{/* Logo */}
					<div className="flex-1 lg:flex-initial text-center lg:text-left">
						<Link href="/" className="inline-block">
							<img src={dashLogo} alt="DASH Logo" className="h-16 w-auto" />
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden lg:block flex-grow">
						<ul className="flex justify-center items-center space-x-8">
							{navLinks.map((link) => (
								<li
									key={link.href}
									className={link.isDropdown ? "relative group" : ""}
								>
									{link.isDropdown ? (
										<>
											<button
												className={`py-2 flex items-center text-sm font-medium uppercase tracking-wide transition-colors ${
													isActiveLink(link.href)
														? "text-[#D4AF37]"
														: "hover:text-[#D4AF37]"
												}`}
											>
												{link.label} <ChevronDown className="ml-1 h-3 w-3" />
											</button>
											<div className="absolute left-0 top-full w-48 bg-white shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
												{link.subItems?.map((subItem) => (
													<Link
														key={subItem.href}
														href={subItem.href}
														className="block px-4 py-2 text-sm hover:bg-gray-50"
													>
														{subItem.label}
													</Link>
												))}
											</div>
										</>
									) : (
										<Link
											href={link.href}
											className={`py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
												isActiveLink(link.href, link.exact)
													? "text-[#D4AF37]"
													: "hover:text-[#D4AF37]"
											}`}
										>
											{link.label}
										</Link>
									)}
								</li>
							))}
						</ul>
					</nav>

					{/* User Actions */}
					<div className="flex items-center space-x-4">
						<Dialog open={searchOpen} onOpenChange={setSearchOpen}>
							<DialogTrigger asChild>
								<Button variant="ghost" size="icon" aria-label="Search">
									<Search className="h-5 w-5" />
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md">
								<form onSubmit={handleSearch} className="flex flex-col gap-4">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
										<Input
											type="text"
											placeholder="Search for products..."
											className="pl-10 pr-4 py-2"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											autoFocus
										/>
									</div>
									<div className="flex justify-end">
										<Button
											type="submit"
											className="bg-[#D4AF37] hover:bg-[#C09C1F] text-white"
										>
											Search
										</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>

						<Link href="/wishlist">
							<Button
								variant="ghost"
								size="icon"
								aria-label="View your wishlist"
							>
								<Heart className="h-5 w-5" />
							</Button>
						</Link>

						{user ? (
							<div className="relative group">
								<Button variant="ghost" size="icon" aria-label="Account">
									<User className="h-5 w-5" />
								</Button>
								<div className="absolute right-0 top-full w-48 bg-white shadow-lg py-2 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
									<div className="px-4 py-2 text-sm font-medium border-b border-gray-100">
										Hello, {user.firstName || user.username}
									</div>
									<Link
										href="/profile"
										className="block px-4 py-2 text-sm hover:bg-gray-50"
									>
										My Profile
									</Link>
									<Link
										href="/account"
										className="block px-4 py-2 text-sm hover:bg-gray-50"
									>
										My Account
									</Link>
									<Link
										href="/orders"
										className="block px-4 py-2 text-sm hover:bg-gray-50"
									>
										My Orders
									</Link>
									{user.isAdmin && (
										<Link
											href="/admin/dashboard"
											className="block px-4 py-2 text-sm hover:bg-gray-50"
										>
											Admin Dashboard
										</Link>
									)}
									<button
										onClick={handleLogout}
										className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
									>
										Logout
									</button>
								</div>
							</div>
						) : (
							<div className="relative group">
								<Button variant="ghost" size="icon" aria-label="Sign in">
									<User className="h-5 w-5" />
								</Button>
								<div className="absolute right-0 top-full w-48 bg-white shadow-lg py-2 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
									<div className="px-4 py-2 text-sm font-medium border-b border-gray-100">
										Account Options
									</div>
									<Link
										href="/auth"
										className="block px-4 py-2 text-sm hover:bg-gray-50"
									>
										<span className="text-[#D4AF37]">User Login / Sign Up</span>
									</Link>
									<Link
										href="/auth?admin=true"
										className="block px-4 py-2 text-sm hover:bg-gray-50"
									>
										<span className="text-gray-700">Admin Login</span>
									</Link>
								</div>
							</div>
						)}

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Link href="/cart" className="relative">
										<Button
											variant="ghost"
											size="icon"
											aria-label="View your shopping bag"
										>
											<ShoppingBag className="h-5 w-5" />
											{itemCount > 0 && (
												<span
													className={`absolute -top-2 -right-2 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ${
														isGuest ? "bg-gray-500" : "bg-[#D4AF37]"
													}`}
												>
													{itemCount}
												</span>
											)}
											{isGuest && itemCount > 0 && (
												<span className="absolute bottom-0 right-0 w-2 h-2 bg-gray-400 rounded-full"></span>
											)}
										</Button>
									</Link>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									{isGuest ? "Guest Shopping Bag" : "Your Shopping Bag"}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>
			</Container>

			{/* Mobile Menu (Conditionally rendered) */}
			{mobileMenuOpen && (
				<div className="lg:hidden bg-white border-t">
					<Container>
						<div className="py-3">
							<div className="flex justify-between items-center mb-4">
								<h2 className="font-serif font-medium text-lg">Menu</h2>
								<Button
									variant="ghost"
									size="icon"
									onClick={toggleMobileMenu}
									aria-label="Close menu"
								>
									<X className="h-5 w-5" />
								</Button>
							</div>

							{/* Mobile Search */}
							<form onSubmit={handleSearch} className="mb-4">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
									<Input
										type="text"
										placeholder="Search for products..."
										className="pl-10 pr-4 py-2"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
									<Button
										type="submit"
										className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 bg-[#D4AF37] hover:bg-[#C09C1F] text-white"
										size="sm"
									>
										Search
									</Button>
								</div>
							</form>
							<ul className="space-y-3">
								{navLinks.map((link) => (
									<li key={link.href}>
										{link.isDropdown ? (
											<>
												<button
													className="w-full text-left py-2 flex items-center justify-between text-sm font-medium uppercase"
													onClick={
														link.label === "Women"
															? toggleWomenSubmenu
															: toggleMenSubmenu
													}
												>
													{link.label}
													<ChevronDown
														className={`h-4 w-4 transition-transform ${
															(link.label === "Women" && womenSubmenuOpen) ||
															(link.label === "Men" && menSubmenuOpen)
																? "rotate-180"
																: ""
														}`}
													/>
												</button>
												{((link.label === "Women" && womenSubmenuOpen) ||
													(link.label === "Men" && menSubmenuOpen)) && (
													<div className="pl-4 pt-2 pb-1 space-y-2">
														{link.subItems?.map((subItem) => (
															<Link
																key={subItem.href}
																href={subItem.href}
																className="block py-1 text-sm"
																onClick={toggleMobileMenu}
															>
																{subItem.label}
															</Link>
														))}
													</div>
												)}
											</>
										) : (
											<Link
												href={link.href}
												className="block py-2 text-sm font-medium uppercase"
												onClick={toggleMobileMenu}
											>
												{link.label}
											</Link>
										)}
									</li>
								))}
								{user ? (
									<>
										<li className="border-t pt-3 mt-3">
											<div className="text-sm font-medium mb-2">Account</div>
											<Link
												href="/profile"
												className="block py-1 text-sm"
												onClick={toggleMobileMenu}
											>
												My Profile
											</Link>
											<Link
												href="/account"
												className="block py-1 text-sm"
												onClick={toggleMobileMenu}
											>
												My Account
											</Link>
											<Link
												href="/orders"
												className="block py-1 text-sm"
												onClick={toggleMobileMenu}
											>
												My Orders
											</Link>
											{user.isAdmin && (
												<Link
													href="/admin/dashboard"
													className="block py-1 text-sm"
													onClick={toggleMobileMenu}
												>
													Admin Dashboard
												</Link>
											)}
											<button
												onClick={() => {
													handleLogout();
													toggleMobileMenu();
												}}
												className="block py-1 text-sm text-red-600"
											>
												Logout
											</button>
										</li>
									</>
								) : (
									<li className="border-t pt-3 mt-3">
										<div className="text-sm font-medium mb-2">
											Account Options
										</div>
										<Link
											href="/auth"
											className="block py-1 text-sm text-[#D4AF37]"
											onClick={toggleMobileMenu}
										>
											User Login / Sign Up
										</Link>
										<Link
											href="/auth?admin=true"
											className="block py-1 text-sm text-gray-700"
											onClick={toggleMobileMenu}
										>
											Admin Login
										</Link>
									</li>
								)}
							</ul>
						</div>
					</Container>
				</div>
			)}
		</header>
	);
};

export default Header;
