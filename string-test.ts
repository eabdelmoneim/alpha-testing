
const run = async () => {
    const slackMsg = ":hatching_chick: New thirdweb verified email: fevog76691@storesr.com";

    // Regex to match https URLs
    const httpsUrlRegex = /https:\/\/[^\s]+/g; // The 'g' flag is for global search, to find all matches

    // Extract all https URLs
    const httpsUrls = slackMsg.match(httpsUrlRegex);

    // Check if there are multiple https URLs
    const hasMultipleHttpsUrls = httpsUrls && httpsUrls.length > 1;
    let email: string | null = null;
    let company: string | null = null;
    
    if(hasMultipleHttpsUrls) {
        // Regex for email
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

        // Extract email
        const emailMatch = slackMsg.match(emailRegex);
        const email: string | null = emailMatch ? emailMatch[0] : null;

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