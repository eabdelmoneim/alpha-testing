
const run = async () => {
    const slackMsg = ":hatching_chick: New thirdweb verified email: <mailto:amalakawa@email1.io|amalakawa@email1.io> (<https://email1.io>)";

    // Regex to match https URLs
    const httpsUrlRegex = /https:\/\/[^\s]+/g; // The 'g' flag is for global search, to find all matches

    // Extract all https URLs
    const httpsUrls = slackMsg.match(httpsUrlRegex);
    console.log("Extracted URLs:", httpsUrls);

    // Check if there are multiple https URLs
    const hasMultipleHttpsUrls = httpsUrls && httpsUrls.length >= 1;
    let email: string | null = null;
    let company: string | null = null;
    
    if (hasMultipleHttpsUrls) {
        // Regex for email
        const emailRegex = /(?:<mailto:([\w.-]+@[\w.-]+\.\w+)|([\w.-]+@[\w.-]+\.\w+))/;

        // Extract email
        const emailMatch = slackMsg.match(emailRegex);
        const email: string | null = emailMatch ? (emailMatch[1] || emailMatch[2]) : null;

        // Extract domain from email
        const company = email ? email.split('@')[1] : null;

        console.log("Extracted Email:", email);
        console.log("Extracted Domain:", company);
    }
};
run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });