interface TitleAndLineProps {
  title: string;
  color: string;
}

const TitleAndLine = ({ title, color }: TitleAndLineProps) => {
  return (
    <h3
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-6xl before:h-0.5 before:bg-[var(--line-color)] before:content-[''] after:h-0.5 after:bg-[var(--line-color)] after:content-['']"
      style={{ '--line-color': color } as React.CSSProperties}
    >
      {title}
    </h3>
  );
};

export default TitleAndLine;
