export default function HeartIcon({ filled }) {
  return (
    <svg
      className={`w-5 h-5 transition-all duration-200 ${filled ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-none'}`}
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
