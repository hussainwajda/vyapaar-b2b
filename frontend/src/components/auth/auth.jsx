import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ILLUSTRATION from "../../assets/images/svg/Business deal-bro.svg";
import Logo from "../../assets/images/logo.webp";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Factory, Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getCategories } from "../../assets/Categories";

const CATEGORIES = getCategories();

export default function AuthPage() {
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "retailer",
    categories: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("email");
  const [otp, setOtp] = useState("")
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.username, formData.password, navigate);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = (e) => {
    e?.preventDefault(); // Prevent default form submission
    
    if (registrationStep === 1) {
      if (!formData.username || !formData.password || !formData.email || !formData.phone) {
        return setError("Please fill all required fields");
      }
      setError("");
      setRegistrationStep(2);
    } else if (registrationStep === 2) {
      if (!formData.role) return setError("Please select a role");
      setError("");
      setRegistrationStep(3);
    } else if (registrationStep === 3) {
      handleRegistrationSubmit();
    }
  };


  // New handler for registration submission
const handleRegistrationSubmit = async () => {
  setLoading(true);
  try {
    // Submit registration data
    await axios.post(`${ServerUrl}/api/auth/register`, {
      ...formData,
      phone: formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`
    });    
    // Move to OTP verification step
    setRegistrationStep(4);
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

const handleVerifyOTP = async () => {
  setLoading(true);
  try {
    await axios.post(`${ServerUrl}/api/auth/verify`, {
      username: formData.username,
      code: otp
    });
    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Verification failed");
  } finally {
    setLoading(false);
  }
};

const handleResendOTP = async (method) => {
  try {
    await axios.post(`${ServerUrl}/api/auth/resend-otp`, {
      username: formData.username,
      method
    });
    setError(`OTP resent to ${method}`);
  } catch (err) {
    setError(err.response?.data?.message || "Resend failed");
  }
};

  const prevStep = () => {
    if (registrationStep > 1) {
      setRegistrationStep(prev => prev - 1);
      setError("");
    }
  };

  const toggleCategory = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };
  

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Company branding section */}
      <div className="bg-[var(--color-primary)] text-[var(--color-heading)] p-8 flex flex-col items-center justify-center lg:w-1/2">
        <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left">
          {/* Company logo */}
          <div className="mb-6 flex justify-center">
            <img src={Logo} alt="Company Logo" className="h-20 w-20" />
          </div>

          {/* Company name and slogan */}
          <h1 className="text-3xl font-bold mb-2">VYAPAAR - B2B</h1>
          <p className="text-xl mb-8">Your trusted business partner</p>

          {/* Hero image */}
          <div className="mt-6 mb-8 lg:mb-0">
            <img
              src={ILLUSTRATION}
              alt="Business illustration"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Auth form section */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label>Username</label>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  {error && <p className="text-red-500">{error}</p>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <AnimatePresence mode="wait">
                  {/* Step 1: Basic Info */}
                  {registrationStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Username</label>
                        <input
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Phone</label>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Role Selection */}
                  {registrationStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-medium">Select Your Role</h3>
                      <div className="space-y-3">
                        {[
                          { value: "manufacturer", label: "Manufacturer", icon: <Factory className="w-5 h-5" /> },
                          { value: "wholesaler", label: "Wholesaler", icon: <Building2 className="w-5 h-5" /> },
                          { value: "retailer", label: "Retailer", icon: <Store className="w-5 h-5" /> },
                        ].map((role) => (
                          <label
                            key={role.value}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                              formData.role === role.value ? "border-blue-500 bg-blue-50" : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="role"
                              value={role.value}
                              checked={formData.role === role.value}
                              onChange={handleInputChange}
                              className="mr-3 text-[var(--color-heading)]"
                            />
                            {role.icon}
                            <span className="ml-2">{role.label}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Category Selection */}
                  {registrationStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-medium">Select Business Categories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.map((category) => (
                          <Button
                            key={category.id}
                            type="button"
                            variant={formData.categories.includes(category.id) ? "default" : "outline"}
                            onClick={() => toggleCategory(category.id)}
                            className="text-sm h-10"
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {registrationStep === 4 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <h3 className="text-lg font-medium">Verify Your Account</h3>
                      <div className="space-y-2">
                        <label>Verification Method</label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={verificationMethod === "email" ? "default" : "outline"}
                            onClick={() => setVerificationMethod("email")}
                          >
                            Email: {formData.email}
                          </Button>
                          <Button
                            type="button"
                            variant={verificationMethod === "sms" ? "default" : "outline"}
                            onClick={() => setVerificationMethod("sms")}
                          >
                            SMS: {formData.phone}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label>Enter OTP</label>
                        <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" />
                      </div>

                      <div className="flex gap-2">
                        <Button type="button" onClick={() => handleResendOTP(verificationMethod)} variant="outline">
                          Resend OTP
                        </Button>
                        <Button type="button" onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}>
                          {loading ? "Verifying..." : "Verify Account"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex gap-2 mt-4">
                  {registrationStep > 1 && (
                    <Button type="button" onClick={prevStep} variant="outline" className="flex-1">
                      Back
                    </Button>
                  )}

                  {registrationStep < 3 ? (
                    <Button type="button" onClick={nextStep} className="flex-1" disabled={loading}>
                      Next
                    </Button>
                  ) : registrationStep === 3 ? (
                    <Button type="button" onClick={nextStep} className="flex-1" disabled={loading}>
                      {loading ? "Registering..." : "Complete Registration"}
                    </Button>
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}