"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ILLUSTRATION from "../../assets/images/svg/Business deal-bro.svg";
import Logo from "../../assets/images/logo.webp";
import { Input, Button, Card, Tabs, Checkbox, Radio, Group, Badge } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Factory, Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getCategories } from "../../assets/Categories";
import { useMantineTheme } from "@mantine/core";

const CATEGORIES = getCategories();

export default function AuthPage() {
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "retailer",
    categories: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("email");
  const [otp, setOtp] = useState("");
  const { login, user, logout } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    e?.preventDefault();
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
      if (!formData.categories.length) return setError("Please select at least one category");
      handleRegistrationSubmit();
    }
  };

  const handleRegistrationSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${ServerUrl}/api/auth/register`, {
        ...formData,
        phone: formData.phone.startsWith("+") ? formData.phone : `+${formData.phone}`,
      });
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
        code: otp,
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
        method,
      });
      setError(`OTP resent to ${method}`);
    } catch (err) {
      setError(err.response?.data?.message || "Resend failed");
    }
  };

  const prevStep = () => {
    if (registrationStep > 1) {
      setRegistrationStep((prev) => prev - 1);
      setError("");
    }
  };

  const toggleCategory = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden" >
      {/* Company branding section */}
      <div className="bg-[var(--color-primary)] text-white p-8 flex flex-col items-center justify-center lg:w-1/2">
        <div className="max-w-md mx-auto text-center">
          <img src={Logo} alt="Company Logo" className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl text-[var(--color-heading)] font-bold mb-4">VYAPAAR - B2B</h1>
          <p className="text-lg text-[var(--color-heading)] mb-8">Your trusted business partner</p>
          <img
            src={ILLUSTRATION}
            alt="Business illustration"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Auth form section */}
      {!user ? (
        <div className="flex-1 p-6 flex items-center justify-center">
          <Card
            shadow="md"
            padding="lg"
            radius="md"
            withBorder
            className="w-full max-w-lg border-gray-200 neon-border"
          >
            <Card.Section p="lg">
            <Tabs
                            defaultValue="login"
                            variant="pills"
                            radius="md"
                            styles={{
                              list: {
                                backgroundColor: theme.colors.gray[0],
                                padding: "4px",
                                borderRadius: theme.radius.md,
                                marginBottom: theme.spacing.lg,
                              },
                              tab: {
                                borderRadius: theme.radius.md,
                                fontWeight: 500,
                                padding: "10px 20px",
                                transition: "all 0.2s ease",
                                "&[data-active]": {
                                  backgroundColor: theme.colors.blue[7],
                                  color: "white",
                                },
                                "&:hover": {
                                  backgroundColor: theme.colors.indigo[5],
                                },
                                // Remove pseudo-elements
                                "&::before, &::after": {
                                  display: "none",
                                },
                              },
                              tabLabel: {
                                // Ensure tab text itself has no pseudo-elements
                                "&::before, &::after": {
                                  display: "none",
                                },
                              },
                            }}
                          >
                <Tabs.List grow>
                  <Tabs.Tab value="login">Login</Tabs.Tab>
                  <Tabs.Tab value="register">Register</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="login" pt="md">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <Input.Wrapper label="Username" required>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        radius="md"
                        size="md"
                      />
                    </Input.Wrapper>

                    <Input.Wrapper label="Password" required>
                      <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        radius="md"
                        size="md"
                      />
                    </Input.Wrapper>

                    <Checkbox
                      label="Remember me"
                      color="indigo"
                      size="sm"
                      className="mt-2"
                      styles={{
                        input: {
                          cursor: "pointer",
                        },
                        label: {
                          cursor: "pointer",
                          color: theme.colors.gray[7],
                        },
                      }}
                    />

                    {error && (
                      <Badge color="red" variant="filled" fullWidth>
                        {error}
                      </Badge>
                    )}

                    <Button
                      className=""
                      color=" indigo" hover="hover:bg-blue-100"
                      type="submit"
                      fullWidth
                      loading={loading}
                      radius="md"
                      size="md"
                      variant="filled"
                    >
                      Login
                    </Button>

                    <div className="text-center mt-4">
                      <a
                        href="/forgot-password"
                        className="text-sm text-[var(--color-heading)] hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </form>
                </Tabs.Panel>

                <Tabs.Panel value="register" pt="md">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Basic Info */}
                    {registrationStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <Input.Wrapper label="Username" required>
                          <Input
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            radius="md"
                            size="md"
                          />
                        </Input.Wrapper>

                        <Input.Wrapper label="Password" required>
                          <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            radius="md"
                            size="md"
                          />
                        </Input.Wrapper>

                        <Input.Wrapper label="Email" required>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            radius="md"
                            size="md"
                          />
                        </Input.Wrapper>

                        <Input.Wrapper label="Phone" required>
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            radius="md"
                            size="md"
                          />
                        </Input.Wrapper>
                      </motion.div>
                    )}

                    {/* Step 2: Role Selection */}
                    {registrationStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          Select Your Role
                        </h3>
                        <Radio.Group
                          name="role"
                          value={formData.role}
                          onChange={(value) =>
                            handleInputChange({ target: { name: "role", value } })
                          }
                        >
                          <Group mt="md" spacing="lg">
                            {[
                              {
                                value: "manufacturer",
                                label: "Manufacturer",
                                icon: <Factory size={18} />,
                              },
                              {
                                value: "wholesaler",
                                label: "Wholesaler",
                                icon: <Building2 size={18} />,
                              },
                              {
                                value: "retailer",
                                label: "Retailer",
                                icon: <Store size={18} />,
                              },
                            ].map((role) => (
                              <Radio
                                key={role.value}
                                value={role.value}
                                label={
                                  <div className="flex items-center gap-2">
                                    {role.icon}
                                    {role.label}
                                  </div>
                                }
                                size="md"
                                styles={{
                                  radio: {
                                    cursor: "pointer",
                                    borderColor: theme.colors.indigo[6],
                                  },
                                  label: {
                                    cursor: "pointer",
                                    paddingLeft: "0.5rem",
                                    color: theme.colors.gray[8],
                                  },
                                }}
                              />
                            ))}
                          </Group>
                        </Radio.Group>
                      </motion.div>
                    )}

                    {/* Step 3: Category Selection */}
                    {registrationStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          Select Business Categories
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {CATEGORIES.map((category) => (
                            <Button
                              key={category.id}
                              type="button"
                              variant={
                                formData.categories.includes(category.id)
                                  ? "filled"
                                  : "outline"
                              }
                              color="indigo"
                              onClick={() => toggleCategory(category.id)}
                              size="sm"
                              radius="md"
                              fullWidth
                              styles={{
                                root: {
                                  borderWidth: 2,
                                  "&:hover": {
                                    backgroundColor: formData.categories.includes(category.id)
                                      ? theme.colors.indigo[7]
                                      : theme.colors.gray[1],
                                  },
                                },
                              }}
                            >
                              {category.name}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: OTP Verification */}
                    {registrationStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          Verify Your Account
                        </h3>
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <Button
                              variant={verificationMethod === "email" ? "filled" : "outline"}
                              color="indigo"
                              onClick={() => setVerificationMethod("email")}
                              fullWidth
                              radius="md"
                              styles={{
                                root: {
                                  borderWidth: 2,
                                  "&:hover": {
                                    backgroundColor:
                                      verificationMethod === "email"
                                        ? theme.colors.indigo[7]
                                        : theme.colors.gray[1],
                                  },
                                },
                              }}
                            >
                              Email
                            </Button>
                            <Button
                              variant={verificationMethod === "sms" ? "filled" : "outline"}
                              color="indigo"
                              onClick={() => setVerificationMethod("sms")}
                              fullWidth
                              radius="md"
                              styles={{
                                root: {
                                  borderWidth: 2,
                                  "&:hover": {
                                    backgroundColor:
                                      verificationMethod === "sms"
                                        ? theme.colors.indigo[7]
                                        : theme.colors.gray[1],
                                  },
                                },
                              }}
                            >
                              SMS
                            </Button>
                          </div>

                          <Input.Wrapper label="Enter OTP" required>
                            <Input
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter 6-digit code"
                              radius="md"
                              size="md"
                            />
                          </Input.Wrapper>

                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleResendOTP(verificationMethod)}
                              variant="outline"
                              color="indigo"
                              fullWidth
                              radius="md"
                              styles={{
                                root: {
                                  borderWidth: 2,
                                  "&:hover": {
                                    backgroundColor: theme.colors.gray[1],
                                  },
                                },
                              }}
                            >
                              Resend OTP
                            </Button>
                            <Button
                              onClick={handleVerifyOTP}
                              disabled={loading || otp.length !== 6}
                              color="indigo"
                              fullWidth
                              radius="md"
                              loading={loading}
                              styles={{
                                root: {
                                  "&:hover": {
                                    backgroundColor: theme.colors.indigo[7],
                                  },
                                },
                              }}
                            >
                              Verify Account
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <Badge color="red" variant="filled" fullWidth mt="md">
                      {error}
                    </Badge>
                  )}

                  <div className="flex gap-3 mt-6">
                    {registrationStep > 1 && (
                      <Button
                        onClick={prevStep}
                        variant="outline"
                        color="indigo"
                        fullWidth
                        radius="md"
                        styles={{
                          root: {
                            borderWidth: 2,
                            "&:hover": {
                              backgroundColor: theme.colors.gray[1],
                            },
                          },
                        }}
                      >
                        Back
                      </Button>
                    )}

                    {registrationStep < 3 ? (
                      <Button
                        onClick={nextStep}
                        className="bg-primary"
                        fullWidth
                        radius="md"
                        loading={loading}
                        styles={{
                          root: {
                            "&:hover": {
                              backgroundColor: theme.colors.indigo[7],
                            },
                          },
                        }}
                      >
                        Next
                      </Button>
                    ) : registrationStep === 3 ? (
                      <Button
                        onClick={nextStep}
                        color="indigo"
                        fullWidth
                        radius="md"
                        loading={loading}
                        styles={{
                          root: {
                            "&:hover": {
                              backgroundColor: theme.colors.indigo[7],
                            },
                          },
                        }}
                      >
                        {loading ? "Registering..." : "Complete Registration"}
                      </Button>
                    ) : null}
                  </div>
                </Tabs.Panel>
              </Tabs>
            </Card.Section>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-1 bg-gray-50">
          <Card shadow="md" padding="lg" radius="md" withBorder className="max-w-md">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4 text-[var(--color-heading)]">
                Hello, {user.Username}!
              </h1>
              <p className="text-gray-600 mb-2">You are already logged in.</p>
              <p className="text-gray-600 mb-6">To logout, click the button below.</p>
              <Button
                onClick={logout}
                color="red"
                fullWidth
                radius="md"
                variant="filled"
                styles={{
                  root: {
                    "&:hover": {
                      backgroundColor: theme.colors.red[7],
                    },
                  },
                }}
              >
                Logout
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}