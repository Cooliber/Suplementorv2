const password = "blaeritipol";
const encoded = encodeURIComponent(password);

console.log("Original password:", password);
console.log("Encoded password:", encoded);
console.log("\nIf they're different, update your .env file with the encoded version");

