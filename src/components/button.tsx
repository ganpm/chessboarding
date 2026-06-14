interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = ({ variant = "primary", className, ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center cursor-pointer rounded-md px-4 py-2 font-medium transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";
  const variantStyles = {
    primary: "bg-neutral-600 text-white hover:bg-neutral-700 focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2",
    secondary: "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}