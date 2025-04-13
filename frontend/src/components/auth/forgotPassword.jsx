import React, { useState } from "react";
import axios from "axios";
import { Card, Text } from "@mantine/core";
import { Input } from "@mantine/core";
import { Button } from "@mantine/core";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const ServerUrl = import.meta.env.VITE_SERVER_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${ServerUrl}/api/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center md:mt-40 mt-20">
      <Card className="w-96 bg-[var(--color-heading)] text-[var(--color-primary)] p-6 shadow-lg">
          <Text className="text-center overflow-hidden h-6">Forgot Password</Text>
        <Card.Section>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading} className="w-full bg-[var(--color-primary)] text-[var(--color-heading)] hover:bg-[var(--color-secondary)] cursor-pointer">
              {loading ? "Submitting..." : "Reset Password"}
            </Button>
          </form>
          {message && <p className="text-center text-sm mt-2">{message}</p>}
        </Card.Section>
      </Card>
    </div>
  );
};

export default ForgotPassword;
