export function maskEmail(email) {
    const [username, domain] = email.split('@'); //
    
    // Fallback if the username is too short to mask gracefully
    if (username.length <= 2) {
        return `${username[0]}${'*'.repeat(username.length - 1)}@${domain}`;
    }

    const firstChar = username[0];
    const lastChar = username[username.length - 1];
    const maskedLength = username.length - 2;
    
    // Create the string of stars and join it all together
    return `${firstChar}${'*'.repeat(maskedLength)}${lastChar}@${domain}`; //
}