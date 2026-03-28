export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p>© {new Date().getFullYear()} CopyCatch. All rights reserved.</p>
          <p className="text-sm">Built by WCE Team</p>
        </div>
      </footer>
    );
  }
  