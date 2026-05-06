import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
                P
              </div>
              <span className="text-xl font-black text-gray-800 tracking-tighter">
                PeerSchool
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              The world’s first community-driven platform for peer-to-peer skill
              sharing. Learn anything, teach everything.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-widest">
              Platform
            </h4>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/skills")}
                  className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
                >
                  Browse Skills
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/faqs")}
                  className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-widest">
              Support
            </h4>
            <ul className="space-y-4">
              <li>
                <button className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
                  Community Guidelines
                </button>
              </li>
              <li>
                <button className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
                  Safety & Privacy
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h4 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-widest">
              Stay Connected
            </h4>
            <p className="text-gray-500 text-xs mb-4">
              Join 2,000+ peers learning together.
            </p>
            <div className="flex gap-3">
              {["Twitter", "Discord", "Github"].map((social) => (
                <button
                  key={social}
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-blue-50 hover:border-blue-100 group transition-all"
                >
                  <span className="text-gray-400 group-hover:text-blue-600 text-xs font-bold">
                    {social[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs font-medium">
            © {currentYear} PeerSchool. Made with ❤️ for the community.
          </p>
          <div className="flex gap-6">
            <button className="text-gray-400 hover:text-gray-600 text-[10px] font-bold uppercase tracking-widest transition-colors">
              Terms
            </button>
            <button className="text-gray-400 hover:text-gray-600 text-[10px] font-bold uppercase tracking-widest transition-colors">
              Privacy
            </button>
            <button className="text-gray-400 hover:text-gray-600 text-[10px] font-bold uppercase tracking-widest transition-colors">
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
