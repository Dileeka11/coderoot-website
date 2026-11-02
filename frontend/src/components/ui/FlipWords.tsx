import { Fragment } from "react";

/**
 * Splits a heading into words that swing up into place when it scrolls into view. The heading
 * that uses this needs data-flip. The text stays whole in the HTML, in order, with its spaces.
 */
export function FlipWords({ text }: { text: string }) {
  return text.split(" ").map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      {index > 0 && " "}
      <span className="flip-word">
        <span style={{ "--w": index } as React.CSSProperties}>{word}</span>
      </span>
    </Fragment>
  ));
}
