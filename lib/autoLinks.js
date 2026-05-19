const links = [
  { keyword: "smart watch", url: "/blog/best-smart-watches" },
  { keyword: "headphones", url: "/blog/best-headphones-2026" },
  { keyword: "gaming", url: "/blog/best-gaming-accessories" },
  { keyword: "amazon deals", url: "/" },
];

export function autoLink(text = "") {
  let result = text;

  links.forEach((l) => {
    const regex = new RegExp(l.keyword, "gi");
    result = result.replace(
      regex,
      `<a href="${l.url}">${l.keyword}</a>`
    );
  });

  return result;
}
