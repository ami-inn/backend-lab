const getOtpTemplate = (otp: string, ttlInSeconds: number): string => {
	const minutes = Math.ceil(ttlInSeconds / 60);

	return `
		<h1>Verify your IRCTC account</h1>
		<p>Your one-time password is:</p>
		<p><strong>${otp}</strong></p>
		<p>This code expires in ${minutes} minute${minutes === 1 ? "" : "s"}.</p>
	`;
};

const getWelcomeTemplate = (): string => `
	<h1>Welcome to IRCTC</h1>
	<p>Your account has been created successfully.</p>
`;

export { getOtpTemplate, getWelcomeTemplate };
