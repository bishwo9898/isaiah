"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate form submission
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        setStatus("idle");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-cormorant font-light tracking-tighter leading-[0.85] text-white mb-6">
              Let's Create
              <br />
              Together
            </h1>
            <p className="text-xs md:text-sm font-inter font-light tracking-[0.3em] uppercase text-white/70">
              Get in touch
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className="w-full bg-transparent border-b border-white/20 py-4 px-2 text-white placeholder:text-white/40 font-inter text-sm tracking-[0.1em] focus:outline-none focus:border-white/60 transition-all duration-300"
                  />
                </div>
                <div className="group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full bg-transparent border-b border-white/20 py-4 px-2 text-white placeholder:text-white/40 font-inter text-sm tracking-[0.1em] focus:outline-none focus:border-white/60 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className="w-full bg-transparent border-b border-white/20 py-4 px-2 text-white placeholder:text-white/40 font-inter text-sm tracking-[0.1em] focus:outline-none focus:border-white/60 transition-all duration-300"
                />
              </div>

              <div className="group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  required
                  rows={6}
                  className="w-full bg-transparent border border-white/20 rounded-lg py-4 px-4 text-white placeholder:text-white/40 font-inter text-sm tracking-[0.1em] focus:outline-none focus:border-white/60 transition-all duration-300 resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "sending" || status === "sent"}
                  className="w-full md:w-auto px-12 py-4 bg-white text-black font-inter text-xs tracking-[0.25em] uppercase font-light hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
                >
                  {status === "idle" && "Send Message"}
                  {status === "sending" && "Sending..."}
                  {status === "sent" && "Message Sent!"}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info & Social Links */}
          <div className="max-w-2xl mx-auto mt-20 pt-20 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xs font-inter font-light tracking-[0.3em] uppercase text-white/70 mb-4">
                  Email
                </h3>
                <a
                  href="mailto:hello@isaiahcalibre.com"
                  className="text-white font-inter text-sm md:text-base tracking-[0.05em] hover:text-white/60 transition-all duration-300"
                >
                  hello@isaiahcalibre.com
                </a>
              </div>

              <div>
                <h3 className="text-xs font-inter font-light tracking-[0.3em] uppercase text-white/70 mb-4">
                  Follow
                </h3>
                <div className="flex gap-6">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-inter text-sm tracking-[0.15em] uppercase hover:text-white/60 transition-all duration-300"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-inter text-sm tracking-[0.15em] uppercase hover:text-white/60 transition-all duration-300"
                  >
                    Twitter
                  </a>
                  <a
                    href="https://vimeo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-inter text-sm tracking-[0.15em] uppercase hover:text-white/60 transition-all duration-300"
                  >
                    Vimeo
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-20">
            <Link
              href="/"
              className="inline-block text-white/60 font-inter text-xs tracking-[0.25em] uppercase hover:text-white transition-all duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
