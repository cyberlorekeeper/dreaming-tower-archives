module.exports = function (eleventyConfig) {
  // Pass-through static folders (adjust based on what you already have)
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  //eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // If you currently keep images/assets at repo root, use these instead:
  eleventyConfig.addPassthroughCopy("images");
  // eleventyConfig.addPassthroughCopy({ "assets": "assets" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};