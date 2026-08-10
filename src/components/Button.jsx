import { Link } from "react-router-dom";

const styles =
  "relative cursor-pointer overflow-hidden border-2 border-[#c1a362] bg-transparent rounded-[34px] px-6 py-2 text-[15px] font-semibold text-[#c1a362] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.320,1)] before:absolute before:inset-0 before:m-auto before:w-[50px] before:h-[50px] before:rounded-full before:scale-0 before:-z-10 before:bg-[#c1a362] before:transition-all before:duration-500 before:ease-[cubic-bezier(0.23,1,0.320,1)] hover:scale-110 hover:text-[#212121] hover:shadow-[0_0px_20px_rgba(193,163,98,0.4)] hover:before:scale-[3] active:scale-100";

export default function Button({ children, className = "", to, href, ...props }) {
  const cls = `${styles} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button {...props} className={cls}>
      {children}
    </button>
  );
}
