"use client";
import { Button } from "@/Components/ui/button";
import { LoginData } from "@/Types/Auth/auth";
import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import LoadingButton from "@/Components/ui/LoadingButton";
import { redirect } from "next/navigation";
import { token } from "@/lib/authToken";
import { useRouter } from "next/navigation";

export default function Login() {
  const { push } = useRouter();
  if (token) redirect("/dashboard");

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.email === "" || formData.password === "") {
      toast.error("Please enter all the details");
      return;
    }
    try {
      setButtonLoading(true);
      const response: AxiosResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
        formData
      );
      toast.success("Login Successfull");
      localStorage.setItem("authToken", response.data.token);
      console.log("ff");

      console.log(response.data);
      push("/dashboard");
      setButtonLoading(false);
    } catch (error) {
      setButtonLoading(false);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage || "An error occurred.");
      } else {
        toast.error("An error occurred.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100  ">
      <div className="max-w-lg px-6 py-8 bg-white shadow-md rounded-md w-full lg:w-3/12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 px-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 px-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              onChange={handleChange}
            />
          </div>
          {buttonLoading ? (
            <LoadingButton />
          ) : (
            <Button type="submit" className="w-full">
              Submit
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
