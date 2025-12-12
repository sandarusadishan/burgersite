import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { MapPin, Phone, Mail, MessageSquare, Send, Loader2 } from "lucide-react";
import { Footer } from "../pages/Index";
import { useToast } from "../hooks/use-toast";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // EmailJS Config
  const emailJsServiceID = "service_ze926ld";
  const templateIDToCustomer = "template_od8r6i9";
  const templateIDToCompany = "template_fj1lc4l";
  const emailJsPublicKey = "FhHt8CgcP4bW9u7PF";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = formRef.current;
    const formData = {
      name: form.name.value,
      email: form.email.value,
      whatsapp: form.whatsapp.value,
      message: form.message.value,
    };

    try {
      // Send email to customer
      await emailjs.send(
        emailJsServiceID,
        templateIDToCustomer,
        formData,
        emailJsPublicKey
      );

      // Send email to company
      await emailjs.send(
        emailJsServiceID,
        templateIDToCompany,
        formData,
        emailJsPublicKey
      );

      toast({
        title: "✅ Message Sent",
        description: "We will get back to you soon!",
        duration: 2000,
        className: "bg-[#09090b] border border-[#FFB800]/20 text-white"
      });
      form.reset();
    } catch (error) {
      console.error("EmailJS error:", error);
      toast({
        title: "❌ Failed",
        description: "Could not send the message.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-inter bg-[#050505] text-white">
      <Navbar />

      <main className="flex-grow py-24 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFB800]/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
             <span className="text-[#FFB800] text-xs font-bold uppercase tracking-[0.3em] mb-4 block animate-pulse">24/7 Support</span>
             <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 text-white">
                Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-yellow-600">Touch</span>
             </h1>
             <p className="text-gray-400 max-w-lg mx-auto font-light leading-relaxed text-sm">
                Have a question or feedback? We'd love to hear from you. 
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="p-8 md:p-10 bg-[#09090b]/60 border border-white/5 backdrop-blur-md shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              
              <h2 className="text-2xl font-black mb-8 text-white uppercase tracking-tight flex items-center gap-3 relative z-10">
                <div className="p-3 bg-[#FFB800]/10 rounded-xl border border-[#FFB800]/20">
                    <MessageSquare className="w-5 h-5 text-[#FFB800]" /> 
                </div>
                Send Message
              </h2>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Name</label>
                        <Input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        required
                        className="bg-black/40 border-white/10 focus:border-[#FFB800]/50 h-12 rounded-xl text-white placeholder:text-gray-600 focus:ring-0 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Email</label>
                        <Input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        required
                        className="bg-black/40 border-white/10 focus:border-[#FFB800]/50 h-12 rounded-xl text-white placeholder:text-gray-600 focus:ring-0 transition-all"
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">WhatsApp</label>
                    <Input
                    type="text"
                    name="whatsapp"
                    placeholder="+94 77 123 4567"
                    required
                    className="bg-black/40 border-white/10 focus:border-[#FFB800]/50 h-12 rounded-xl text-white placeholder:text-gray-600 focus:ring-0 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Message</label>
                    <Textarea
                    name="message"
                    placeholder="How can we help you?"
                    rows={5}
                    required
                    className="bg-black/40 border-white/10 focus:border-[#FFB800]/50 rounded-xl text-white placeholder:text-gray-600 focus:ring-0 transition-all resize-none p-4"
                    />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#FFB800] text-black hover:bg-[#FFD600] font-bold h-12 rounded-xl uppercase tracking-widest text-xs transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,184,0,0.2)] mt-4"
                  disabled={loading}
                >
                  {loading ? (
                      <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                      </span>
                  ) : (
                      <span className="flex items-center gap-2">
                          Send Message <Send className="w-4 h-4" />
                      </span>
                  )}
                </Button>
              </form>
            </Card>

            {/* Contact Info & Map */}
            <div className="space-y-6">
              <Card className="p-8 bg-[#09090b]/40 border border-white/5 backdrop-blur-md rounded-[2rem] hover:border-[#FFB800]/30 transition-all duration-300">
                <h2 className="text-xl font-bold mb-6 text-white uppercase tracking-wide">
                  Contact Details
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#121214] flex items-center justify-center border border-white/10 group-hover:border-[#FFB800] transition-colors">
                        <Phone className="w-4 h-4 text-gray-400 group-hover:text-[#FFB800] transition-colors" /> 
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Phone</p>
                        <p className="text-white font-medium group-hover:text-[#FFB800] transition-colors">(011) 234 5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#121214] flex items-center justify-center border border-white/10 group-hover:border-[#FFB800] transition-colors">
                        <Mail className="w-4 h-4 text-gray-400 group-hover:text-[#FFB800] transition-colors" /> 
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Email</p>
                        <p className="text-white font-medium group-hover:text-[#FFB800] transition-colors">info@burgershop.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#121214] flex items-center justify-center border border-white/10 group-hover:border-[#FFB800] transition-colors">
                        <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#FFB800] transition-colors" /> 
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Location</p>
                        <p className="text-white font-medium group-hover:text-[#FFB800] transition-colors leading-tight">
                            123 Burger Lane,<br/> Colombo 03, Sri Lanka
                        </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Google Map */}
              <Card className="p-0 overflow-hidden rounded-[2rem] shadow-2xl border border-white/10 group hover:border-[#FFB800]/50 transition-all duration-500 h-[300px] relative">
                 <div className="absolute inset-0 pointer-events-none border-[4px] border-[#050505] rounded-[2rem] z-10" />
                <iframe
                  title="Our Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9168019323146!2d79.85966051477298!3d6.901594295039268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259163e8d2e8b%3A0xc3f8b0d4b0f4e1f7!2sColombo%2003%2C%20Colombo!5e0!3m2!1sen!2slk!4v1678886400000"
                  width="100%"
                  height="100%"
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
