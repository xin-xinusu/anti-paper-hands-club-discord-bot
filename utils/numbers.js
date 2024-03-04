function formatWithSpaces(num) {
  const numParts = num.toString().split(".");
  numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Insert space as thousand separator
  return numParts.join(".");
}

exports.formatNumber = (num, skipthousands = false) => {
  if (num >= 1e9) {
      // Billions
      return (num / 1e9).toFixed(2) + ' b';
  } else if (num >= 1e6) {
      // Millions and hundreds of millions
      return (num / 1e6).toFixed(2) + ' m';
  } else if (num >= 1e3 && !skipthousands) {
      // Thousands, including hundreds of thousands
      return (num / 1e3).toFixed(2) + ' k';
  } else {
      // Less than 1000 or when skipping thousands formatting
      return formatWithSpaces(num);
  }
};