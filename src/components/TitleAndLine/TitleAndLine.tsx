import styles from './TitleAndLine.module.css';

interface TitleAndLineProps {
  title: string;
  color: string;
}

export default function TitleAndLine({ title, color }: TitleAndLineProps) {
  return (
    <h3 className={styles.titleAndLine} style={{ '--line-color': color } as React.CSSProperties}>
      {title}
    </h3>
  );
}
