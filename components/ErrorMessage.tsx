interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="flex items-center gap-2 py-6 text-sm text-red-400">
      <span aria-hidden="true">⛔</span>
      {message}
    </p>
  );
}
