function randomize(interests) {
    return Object.keys(interests)
        .map((key) => ({key, value: interests[key]}))
        .sort((a, b) =>Math.random() - 0.5)
        .reduce((acc, e) => {
            acc[e.key] = e.value;
            return acc;
        }, {});
}

module.exports= randomize
