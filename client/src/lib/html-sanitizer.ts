import DOMPurify from "isomorphic-dompurify";

const allowedTags = [
  "a",
  "blockquote",
  "br",
  "caption",
  "col",
  "colgroup",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
];

const allowedAttributes = [
  "alt",
  "class",
  "colspan",
  "href",
  "rel",
  "rowspan",
  "src",
  "style",
  "target",
  "title",
];

export function sanitizeRichHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_ATTR: allowedAttributes,
    ALLOWED_TAGS: allowedTags,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  });
}
