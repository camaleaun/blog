import type { Element, ElementContent, Root, RootContent, Text } from "hast";

const HASHTAGS = /^(#[\p{L}\p{N}_]+\s*)+$/u;

const isHashtagParagraph = (node: RootContent): node is Element =>
  node.type === "element" &&
  node.tagName === "p" &&
  node.children.every((child) => child.type === "text") &&
  HASHTAGS.test(node.children.map((child) => (child as Text).value).join("").trim());

const toTagList = (paragraph: Element): Element => {
  const text = paragraph.children.map((child) => (child as Text).value).join("").trim();
  const tags = [...new Set(text.split(/\s+/))];
  return {
    type: "element",
    tagName: "ul",
    properties: { className: ["tags"], ariaLabel: "Tags" },
    children: tags.map(
      (tag): ElementContent => ({
        type: "element",
        tagName: "li",
        properties: {},
        children: [{ type: "text", value: tag }]
      })
    )
  };
};

// Turns a paragraph made only of hashtags ("#WordPress #PHP") — the LinkedIn
// footer of a post — into a list of tags, without duplicates.
export const rehypeHashtags = () => (tree: Root) => {
  tree.children = tree.children.map((node) => (isHashtagParagraph(node) ? toTagList(node) : node));
};
