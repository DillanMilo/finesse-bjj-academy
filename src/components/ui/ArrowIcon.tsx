type ArrowDirection = "up-right" | "right" | "left" | "down";

const paths: Record<ArrowDirection, string> = {
  "up-right": "M4 20 20 4M8 4h12v12",
  right: "M4 12h16M12 4l8 8-8 8",
  left: "M20 12H4M12 4l-8 8 8 8",
  down: "M12 4v16M4 12l8 8 8-8",
};

export default function ArrowIcon({
  direction = "up-right",
  className = "h-5 w-5",
}: {
  direction?: ArrowDirection;
  className?: string;
}) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className={`inline-block shrink-0 align-middle ${className}`}>
      <path d={paths[direction]} />
    </svg>
  );
}
