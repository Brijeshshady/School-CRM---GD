import { useState } from "react";
import { Send, MessageSquare, Mail, Smartphone } from "lucide-react";
import { useApp } from "@/app/context/AppContext";
import { toast } from "sonner";
export function Communications() {
  const { messages, sendMessage, user } = useApp();
  const [messageType, setMessageType] = useState("announcement");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedAudience, setSelectedAudience] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState(["email", "app"]);
  const audiences = ["All Students", "All Parents", "All Teachers", "Grade 10", "Grade 11", "Grade 12"];
  const handleAudienceToggle = (audience) => {
    setSelectedAudience(
      (prev) => prev.includes(audience) ? prev.filter((a) => a !== audience) : [...prev, audience]
    );
  };
  const handleChannelToggle = (channel) => {
    setSelectedChannels(
      (prev) => prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };
  const handleSend = () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in subject and message");
      return;
    }
    if (selectedAudience.length === 0) {
      toast.error("Please select at least one audience");
      return;
    }
    if (selectedChannels.length === 0) {
      toast.error("Please select at least one delivery channel");
      return;
    }
    sendMessage({
      type: messageType,
      subject,
      content,
      audience: selectedAudience,
      channels: selectedChannels,
      sentBy: user?.name || "Admin",
      status: "sent"
    });
    setSubject("");
    setContent("");
    setSelectedAudience([]);
    setSelectedChannels(["email", "app"]);
    toast.success("Message sent successfully");
  };
  const handleSaveDraft = () => {
    if (!subject.trim() && !content.trim()) {
      toast.error("Cannot save empty draft");
      return;
    }
    toast.success("Draft saved successfully");
  };
  const emailCount = messages.filter((m) => m.channels.includes("email")).length;
  const smsCount = messages.filter((m) => m.channels.includes("sms")).length;
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Communications</h1>
        <p className="text-muted-foreground">Send announcements and messages to students, parents, and teachers</p>
      </div>

      {
    /* Message History Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">Total Sent</span>
          </div>
          <div className="text-2xl font-bold">{messages.length}</div>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <span className="font-medium">Email Sent</span>
          </div>
          <div className="text-2xl font-bold">{emailCount}</div>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Smartphone className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-medium">SMS Sent</span>
          </div>
          <div className="text-2xl font-bold">{smsCount}</div>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </div>
      </div>

      {
    /* Compose Message */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Compose Message</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Message Type</label>
              <div className="flex gap-2">
                <button
    onClick={() => setMessageType("announcement")}
    className={`px-4 py-2 rounded-lg border transition-colors ${messageType === "announcement" ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
  >
                  Announcement
                </button>
                <button
    onClick={() => setMessageType("notification")}
    className={`px-4 py-2 rounded-lg border transition-colors ${messageType === "notification" ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
  >
                  Notification
                </button>
                <button
    onClick={() => setMessageType("alert")}
    className={`px-4 py-2 rounded-lg border transition-colors ${messageType === "alert" ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
  >
                  Alert
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Audience</label>
              <div className="grid grid-cols-3 gap-2">
                {audiences.map((audience) => <label
    key={audience}
    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${selectedAudience.includes(audience) ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}
  >
                    <input
    type="checkbox"
    className="w-4 h-4 rounded border-border"
    checked={selectedAudience.includes(audience)}
    onChange={() => handleAudienceToggle(audience)}
  />
                    <span className="text-sm">{audience}</span>
                  </label>)}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Delivery Channels</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
    type="checkbox"
    className="w-4 h-4 rounded border-border"
    checked={selectedChannels.includes("email")}
    onChange={() => handleChannelToggle("email")}
  />
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
    type="checkbox"
    className="w-4 h-4 rounded border-border"
    checked={selectedChannels.includes("sms")}
    onChange={() => handleChannelToggle("sms")}
  />
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">SMS</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
    type="checkbox"
    className="w-4 h-4 rounded border-border"
    checked={selectedChannels.includes("app")}
    onChange={() => handleChannelToggle("app")}
  />
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">In-App</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <input
    type="text"
    placeholder="Enter message subject"
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
  />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <textarea
    rows={6}
    placeholder="Type your message here..."
    value={content}
    onChange={(e) => setContent(e.target.value)}
    className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
  />
            </div>

            <div className="flex gap-2">
              <button
    onClick={handleSaveDraft}
    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
  >
                Save as Draft
              </button>
              <button
    onClick={handleSend}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
  >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Message History</h3>
          <div className="space-y-3">
            {messages.slice(0, 5).map((message) => <div key={message.id} className="p-3 border border-border rounded-lg hover:bg-muted/30 cursor-pointer">
                <div className="font-medium text-sm mb-1">{message.subject}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{message.audience.join(", ")}</span>
                  <span>{new Date(message.sentAt).toLocaleDateString()}</span>
                </div>
              </div>)}
            {messages.length === 0 && <div className="text-center text-sm text-muted-foreground py-8">
                No messages sent yet
              </div>}
          </div>
        </div>
      </div>
    </div>;
}
