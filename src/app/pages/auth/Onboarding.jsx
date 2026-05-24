import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Building, User, MapPin, Check } from "lucide-react";
export function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    password: ""
  });
  const totalSteps = 3;
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === totalSteps) {
    }
  };
  return <div className="min-h-screen bg-background flex flex-col">
      {
    /* Header */
  }
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <span className="font-semibold">EduCRM</span>
          </div>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Already have an account? <span className="text-primary font-medium">Sign in</span>
          </Link>
        </div>
      </div>

      {
    /* Progress Steps */
  }
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {[
    { num: 1, label: "School Details", icon: Building },
    { num: 2, label: "Address", icon: MapPin },
    { num: 3, label: "Admin Account", icon: User }
  ].map((s, idx) => <div key={s.num} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${step > s.num ? "bg-accent text-white" : step === s.num ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
  >
                    {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs text-muted-foreground">Step {s.num}</div>
                  </div>
                </div>
                {idx < 2 && <div className="flex-1 h-0.5 mx-4 bg-border">
                    <div
    className="h-full bg-primary transition-all"
    style={{ width: step > s.num ? "100%" : "0%" }}
  />
                  </div>}
              </div>)}
          </div>
        </div>
      </div>

      {
    /* Form Content */
  }
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit}>
            {step === 1 && <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">School Details</h2>
                  <p className="text-muted-foreground">Tell us about your institution</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">School Name *</label>
                    <input
    type="text"
    value={formData.schoolName}
    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
    placeholder="Springfield High School"
    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">School Type *</label>
                    <select
    value={formData.schoolType}
    onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  >
                      <option value="">Select school type</option>
                      <option value="preschool">Preschool</option>
                      <option value="primary">Primary School</option>
                      <option value="secondary">Secondary School</option>
                      <option value="high-school">High School</option>
                      <option value="college">College</option>
                      <option value="university">University</option>
                    </select>
                  </div>
                </div>
              </div>}

            {step === 2 && <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">School Address</h2>
                  <p className="text-muted-foreground">Where is your school located?</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <input
    type="text"
    value={formData.address}
    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
    placeholder="123 Main Street"
    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
    type="text"
    value={formData.city}
    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
    placeholder="Springfield"
    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">State *</label>
                      <input
    type="text"
    value={formData.state}
    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
    placeholder="CA"
    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                    <input
    type="text"
    value={formData.zipCode}
    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
    placeholder="12345"
    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                  </div>
                </div>
              </div>}

            {step === 3 && <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Admin Account</h2>
                  <p className="text-muted-foreground">Create your administrator account</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
    type="text"
    value={formData.adminName}
    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
    placeholder="John Doe"
    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
    type="email"
    value={formData.adminEmail}
    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
    placeholder="admin@school.com"
    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
    type="tel"
    value={formData.adminPhone}
    onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
    placeholder="+1 (555) 123-4567"
    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Password *</label>
                    <input
    type="password"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    placeholder="Create a strong password"
    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                  </div>
                </div>
              </div>}

            {
    /* Navigation Buttons */
  }
            <div className="mt-8 flex items-center justify-between">
              <button
    type="button"
    onClick={handleBack}
    className={`px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors ${step === 1 ? "invisible" : ""}`}
  >
                Back
              </button>

              {step < totalSteps ? <button
    type="button"
    onClick={handleNext}
    className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
  >
                  Continue
                </button> : <button
    type="submit"
    className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
  >
                  Create Account
                </button>}
            </div>
          </form>
        </div>
      </div>
    </div>;
}
