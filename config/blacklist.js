const blacklist = [];

module.exports = {
    addToken: (token) => {
        blacklist.push(token); // Add the token to the blacklist
    },
    isTokenBlacklisted: (token) => {
        return blacklist.includes(token); // Check if the token is blacklisted
    }
};