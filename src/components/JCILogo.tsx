const JCILogo = ({ className = "h-12" }: { className?: string }) => (
  <svg viewBox="0 0 280 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* JCI Text */}
    <text x="0" y="60" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="56" fill="hsl(222, 47%, 11%)">JCI</text>
    {/* Shield */}
    <g transform="translate(145, 8)">
      <path d="M40 0C40 0 80 8 80 8V48C80 72 40 88 40 88C40 88 0 72 0 48V8L40 0Z" fill="none" stroke="hsl(142, 71%, 45%)" strokeWidth="4" opacity="0.5"/>
      <path d="M40 8C40 8 72 14 72 14V46C72 66 40 80 40 80C40 80 8 66 8 46V14L40 8Z" fill="none" stroke="hsl(199, 89%, 48%)" strokeWidth="4"/>
      <path d="M40 18C40 18 62 22 62 22V44C62 60 40 72 40 72C40 72 18 60 18 44V22L40 18Z" fill="none" stroke="hsl(222, 47%, 11%)" strokeWidth="3"/>
      <path d="M40 30L48 42H32L40 30Z" fill="hsl(222, 47%, 11%)"/>
    </g>
    {/* MANNAI */}
    <text x="30" y="90" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="24" fill="hsl(199, 89%, 48%)">MANNAI</text>
  </svg>
);

export default JCILogo;
