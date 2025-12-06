"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api, setAuthToken } from "@/lib/api";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

	useEffect(() => {
		const handleCallback = async () => {
			try {
				// Get token and provider from URL params (set by backend after OAuth)
				const token = searchParams.get("token");
				const error = searchParams.get("error");
				const provider = searchParams.get("provider");

				if (error) {
					setStatus("error");
					toast.error(`Social login failed: ${error}`);
					setTimeout(() => router.push("/login"), 2000);
					return;
				}

				if (token) {
					// Store token
					setAuthToken(token);
					
					// Optionally fetch user data
					try {
						await api.auth.getCurrentUser();
					} catch (err) {
						// Token might be invalid, but continue anyway
					}

					setStatus("success");
					toast.success(`Successfully logged in with ${provider}!`);
					
					// Redirect to home page
					setTimeout(() => {
						router.push("/");
					}, 1000);
				} else {
					setStatus("error");
					toast.error("No token received from authentication provider");
					setTimeout(() => router.push("/login"), 2000);
				}
			} catch (error: any) {
				setStatus("error");
				toast.error("Authentication failed. Please try again.");
				setTimeout(() => router.push("/login"), 2000);
			}
		};

		handleCallback();
	}, [searchParams, router]);

	return (
		<div className="min-h-screen bg-[#fffaf5] flex items-center justify-center">
			<div className="text-center">
				{status === "loading" && (
					<>
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
						<p className="text-gray-600">Completing authentication...</p>
					</>
				)}
				{status === "success" && (
					<>
						<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<p className="text-gray-600">Authentication successful! Redirecting...</p>
					</>
				)}
				{status === "error" && (
					<>
						<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
						<p className="text-gray-600">Authentication failed. Redirecting to login...</p>
					</>
				)}
			</div>
		</div>
	);
}

