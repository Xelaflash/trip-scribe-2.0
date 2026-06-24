const DecorativeSwoops = () => {
  return (
    <div className="absolute inset-0 size-full overflow-hidden bg-[repeating-linear-gradient(75deg,var(--color-primary-100)_0_var(--stroke-width),transparent_var(--stroke-width)_10px),var(--color-backdrop)] [--stroke-color:var(--color-primary-100)] [--stroke-width:3px]">
      <Blocker />
    </div>
  );
};

const Blocker = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1706 296"
      className="absolute inset-[calc(var(--stroke-width)*-1)] h-4/5 w-[calc(100%+4px)] min-w-[800px] max-w-none"
      preserveAspectRatio="none"
    >
      <path
        className="fill-backdrop stroke-[var(--stroke-color)] [stroke-width:var(--stroke-width)]"
        d="M178.5 293C105.361 281.294.5 227.5.5 227.5V.5H1706V293s-47.61-239.974-167-230c-93.05 7.773-116.73 153.932-209.5 164.5-81.66 9.302-110.33-70.309-190-90.5-208.419-52.822-314.703 183.072-528 156-60.841-7.722-91.53-30.876-152.5-37.5-109.87-11.936-171.372 54.966-280.5 37.5z"
      />
    </svg>
  );
};

export default DecorativeSwoops;
