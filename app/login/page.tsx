"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { api, socialLogin } from "@/lib/api";

export default function LoginPage() {
	const router = useRouter();
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: ""
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (isLogin) {
				// Login
				const response = await api.auth.login({
					email: formData.email,
					password: formData.password,
				});
				toast.success("Login successful!");
				router.push("/");
			} else {
				// Register
				if (formData.password !== formData.confirmPassword) {
					toast.error("Passwords do not match");
					setIsLoading(false);
					return;
				}
				if (!formData.firstName || !formData.lastName || !formData.phone) {
					toast.error("Please fill in all required fields");
					setIsLoading(false);
					return;
				}
				const response = await api.auth.register({
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					phone: formData.phone,
					password: formData.password,
				});
				toast.success("Registration successful!");
				router.push("/");
			}
		} catch (error: any) {
			toast.error(error.message || "An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialLogin = (provider: 'google' | 'facebook') => {
		setIsLoading(true);
		try {
			// Redirect to backend OAuth endpoint
			// The backend will handle the OAuth flow and redirect back with token
			socialLogin.initiate(provider);
		} catch (error: any) {
			toast.error(`Failed to initiate ${provider} login`);
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#fffaf5] flex items-center justify-center py-16 px-6">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-xl shadow-lg p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							{isLogin ? "Welcome Back" : "Create Account"}
						</h1>
						<p className="text-gray-600">
							{isLogin ? "Sign in to your account" : "Sign up to get started"}
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{!isLogin && (
							<>
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										First Name
									</label>
									<input
										type="text"
										value={formData.firstName}
										onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
										required={!isLogin}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										placeholder="Enter your first name"
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Last Name
									</label>
									<input
										type="text"
										value={formData.lastName}
										onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
										required={!isLogin}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										placeholder="Enter your last name"
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Phone Number
									</label>
									<input
										type="tel"
										value={formData.phone}
										onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
										required={!isLogin}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										placeholder="Enter your phone number"
									/>
								</div>
							</>
						)}

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
								<input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									required
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
									placeholder="Enter your email"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
								<input
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									required
									className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
									placeholder="Enter your password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
						</div>

						{!isLogin && (
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Confirm Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
									<input
										type={showPassword ? "text" : "password"}
										value={formData.confirmPassword}
										onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
										required={!isLogin}
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										placeholder="Confirm your password"
									/>
								</div>
							</div>
						)}

						{isLogin && (
							<div className="flex items-center justify-between">
								<label className="flex items-center">
									<input type="checkbox" className="mr-2" />
									<span className="text-sm text-gray-600">Remember me</span>
								</label>
								<Link href="/forgot-password" className="text-sm text-primary-gold hover:underline">
									Forgot password?
								</Link>
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-primary-gold text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-gray-600">
							{isLogin ? "Don't have an account? " : "Already have an account? "}
							<button
								type="button"
								onClick={() => {
									setIsLogin(!isLogin);
									setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
								}}
								className="text-primary-gold font-semibold hover:underline"
							>
								{isLogin ? "Sign Up" : "Sign In"}
							</button>
						</p>
					</div>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<p className="text-center text-sm text-gray-600 mb-4">Or continue with</p>
						<div className="flex gap-4">
							<button
								type="button"
								onClick={() => handleSocialLogin('google')}
								disabled={isLoading}
								className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span className="text-sm font-semibold">Google</span>
							</button>
							<button
								type="button"
								onClick={() => handleSocialLogin('facebook')}
								disabled={isLoading}
								className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span className="text-sm font-semibold">Facebook</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

