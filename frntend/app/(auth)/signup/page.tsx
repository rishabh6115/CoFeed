"use client";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { RegistrationData } from "@/Types/Auth/auth";
import { toast } from "react-hot-toast";
import axios, { AxiosResponse } from "axios";
import LoadingButton from "@/Components/ui/LoadingButton";
import { redirect } from "next/navigation";
import { token } from "@/lib/authToken";

export default function Signup() {
  if (token) redirect("/dashboard");
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    email: "",
    password: "",
    location: "",
    pic: null,
  });
  const [buttonLoading, setButtonLoading] = useState(false);

  const changeHandler = async (pic: File | null | undefined) => {
    if (!pic) {
      toast.error("Please select an image.");
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      setButtonLoading(true);
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "ddfcndmo7");
      fetch("https://api.cloudinary.com/v1_1/ddfcndmo7/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData((prevState) => ({
            ...prevState,
            pic: data.url.toString(),
          }));
          setButtonLoading(false);
        })
        .catch((err) => {
          toast.error("Image uploading failed");
          setButtonLoading(false);
        });
    } else {
      toast.error("Please enter an image");
      setButtonLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.location === "" ||
      formData.pic === null
    ) {
      toast.error("Please enter all the details");
      return;
    }
    try {
      setButtonLoading(true);
      const response: AxiosResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
        formData
      );
      toast.success("Registration Successfull");
      console.log(response.data);
      localStorage.setItem("authToken", response.data.token);
      redirect("/dashboard");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md px-6 py-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 px-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="mt-1 px-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              id="pic"
              name="pic"
              className="mt-1 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none p-2"
              onChange={(e) => {
                const selectedFile = e.target?.files?.[0];
                if (selectedFile) {
                  changeHandler(selectedFile);
                }
              }}
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
