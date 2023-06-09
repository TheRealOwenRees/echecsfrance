export default function Footer() {
  return (
    <footer className="grid grid-cols-2 bg-gray-800 text-white p-3">
      <div>
        <p>&copy; {new Date().getFullYear()} - Owen Rees</p>
      </div>
    </footer>
  );
}
