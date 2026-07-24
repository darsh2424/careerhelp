const otpTemplateEmail = (otp, expires) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;display: flex; flex-direction: column; align-items: center;justify-content: center;width: 100%; max-width: 600px; margin: 0 auto;">
            <h2>Your OTP</h2>
            <p>Your One Time Password is: <strong>${otp}</strong></p>
            <p>This code will expire at: ${expires}</p>
            <p>Please use this code to complete your verification.</p>
        </div>
    `;
};

module.exports = otpTemplateEmail;